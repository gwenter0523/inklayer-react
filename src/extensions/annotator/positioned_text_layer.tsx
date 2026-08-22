import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePdfViewerContext } from '@/context/pdf_viewer_context'
import type {
    PdfPositionedTextGeometry,
    PdfPositionedTextBlock,
    PdfPositionedTextPage,
    PdfPositionedTextSource,
    PdfPositionedTextSpan
} from './types/annotator'
import styles from './positioned_text_layer.module.scss'

interface PositionedTextLayerProps {
    source: PdfPositionedTextSource
}

interface PageMount {
    readonly pageNumber: number
    readonly host: HTMLDivElement
    readonly scaleX: number
    readonly scaleY: number
}

const VIEWPORT_MARGIN_PAGES = 1

/**
 * Renders an application-owned text source into PDF.js page containers.
 * PDF.js remains responsible for the page viewport; this component only
 * places transparent selectable spans in the provider-owned page coordinate
 * system and never reads PDF.js private text state.
 */
export const PositionedTextLayer: React.FC<PositionedTextLayerProps> = ({ source }) => {
    const { pdfViewer, eventBus, viewerContainerRef, isReady } = usePdfViewerContext()
    const [visiblePageNumbers, setVisiblePageNumbers] = useState<readonly number[]>([])
    const [pages, setPages] = useState<ReadonlyMap<number, PdfPositionedTextPage>>(new Map())
    const [, setPageRenderGeneration] = useState(0)
    const loadingPagesRef = useRef(new Set<number>())
    const generationRef = useRef(0)

    const pageNumbersForViewport = useCallback((): readonly number[] => {
        if (!pdfViewer || !viewerContainerRef.current) return []
        const pageCount = Math.min(source.pageCount, pdfViewer.pagesCount)
        if (pageCount <= 0) return []

        const containerRect = viewerContainerRef.current.getBoundingClientRect()
        const hasMeasuredViewport = containerRect.width > 0 && containerRect.height > 0
        const visible = new Set<number>()
        for (let index = 0; index < pageCount; index += 1) {
            const pageView = pdfViewer.getPageView(index)
            const pageRect = pageView?.div?.getBoundingClientRect()
            if (!pageRect || pageRect.width <= 0 || pageRect.height <= 0) continue
            if (hasMeasuredViewport && (
                pageRect.bottom >= containerRect.top &&
                pageRect.top <= containerRect.bottom
            )) {
                visible.add(index + 1)
            }
        }

        if (visible.size === 0) {
            const currentPage = Math.max(1, Math.min(pageCount, pdfViewer.currentPageNumber || 1))
            visible.add(currentPage)
        }

        const withMargin = new Set<number>()
        visible.forEach((pageNumber) => {
            for (let offset = -VIEWPORT_MARGIN_PAGES; offset <= VIEWPORT_MARGIN_PAGES; offset += 1) {
                const candidate = pageNumber + offset
                if (candidate >= 1 && candidate <= pageCount) withMargin.add(candidate)
            }
        })
        return [...withMargin].sort((left, right) => left - right)
    }, [pdfViewer, source.pageCount, viewerContainerRef])

    const refreshVisiblePages = useCallback(() => {
        setVisiblePageNumbers(pageNumbersForViewport())
    }, [pageNumbersForViewport])

    useEffect(() => {
        generationRef.current += 1
        loadingPagesRef.current.clear()
        setPages(new Map())
        setVisiblePageNumbers([])
        if (!pdfViewer || !eventBus || !isReady) return undefined

        refreshVisiblePages()
        const refresh = () => refreshVisiblePages()
        const refreshRenderedPage = () => {
            refreshVisiblePages()
            setPageRenderGeneration((current) => current + 1)
        }
        const delayedRefreshes = [0, 50, 200, 500].map((delay) => window.setTimeout(refresh, delay))
        const viewerContainer = viewerContainerRef.current
        const resizeObserver = typeof ResizeObserver === 'undefined' || !viewerContainer
            ? null
            : new ResizeObserver(refresh)
        if (viewerContainer) {
            resizeObserver?.observe(viewerContainer)
            viewerContainer.addEventListener('scroll', refresh, { passive: true })
        }
        eventBus.on('pagesloaded', refresh)
        eventBus.on('pagerendered', refreshRenderedPage)
        eventBus.on('updateviewarea', refresh)
        eventBus.on('scalechanging', refresh)
        eventBus.on('rotationchanging', refresh)
        return () => {
            delayedRefreshes.forEach((timer) => window.clearTimeout(timer))
            resizeObserver?.disconnect()
            viewerContainer?.removeEventListener('scroll', refresh)
            eventBus.off('pagesloaded', refresh)
            eventBus.off('pagerendered', refreshRenderedPage)
            eventBus.off('updateviewarea', refresh)
            eventBus.off('scalechanging', refresh)
            eventBus.off('rotationchanging', refresh)
        }
    }, [eventBus, isReady, pdfViewer, refreshVisiblePages, source, viewerContainerRef])

    useEffect(() => {
        if (!pdfViewer || !visiblePageNumbers.length) return undefined
        const generation = generationRef.current
        let disposed = false
        visiblePageNumbers.forEach((pageNumber) => {
            if (pages.has(pageNumber) || loadingPagesRef.current.has(pageNumber)) return
            loadingPagesRef.current.add(pageNumber)
            void source.getPage(pageNumber).then((page) => {
                loadingPagesRef.current.delete(pageNumber)
                if (disposed || generationRef.current !== generation || !page) return
                setPages((previous) => {
                    const next = new Map(previous)
                    next.set(pageNumber, page)
                    return next
                })
            }).catch(() => {
                loadingPagesRef.current.delete(pageNumber)
            })
        })
        return () => {
            disposed = true
        }
    }, [pages, pdfViewer, source, visiblePageNumbers])

    const mountedPages = pdfViewer
        ? visiblePageNumbers.flatMap((pageNumber): PageMount[] => {
            const pageView = pdfViewer.getPageView(pageNumber - 1)
            const page = pages.get(pageNumber)
            if (!pageView?.div || !page) return []
            const viewport = pageView.viewport
            if (!viewport ||
                ![viewport.width, viewport.height, page.dimensions.width, page.dimensions.height].every(Number.isFinite) ||
                viewport.width <= 0 || viewport.height <= 0 ||
                page.dimensions.width <= 0 || page.dimensions.height <= 0) return []
            return [{
                pageNumber,
                host: ensurePositionedTextHost(pageView.div, pageNumber, source.sourceKey),
                scaleX: viewport.width / page.dimensions.width,
                scaleY: viewport.height / page.dimensions.height
            }]
        })
        : []

    return <>
        {mountedPages.map((mount) => {
            const page = pages.get(mount.pageNumber)
            if (!page) return null
            return createPortal(
                <>
                    {page.blocks?.map((block) => (
                        <PositionedTextBlock
                            key={block.id}
                            block={block}
                            scaleX={mount.scaleX}
                            scaleY={mount.scaleY}
                        />
                    ))}
                    {page.spans.map((span) => (
                        <PositionedTextSpan
                            key={span.id}
                            span={span}
                            pageNumber={mount.pageNumber}
                            sourceKey={source.sourceKey}
                            scaleX={mount.scaleX}
                            scaleY={mount.scaleY}
                        />
                    ))}
                </>,
                mount.host,
                `positioned-text-${mount.pageNumber}`
            )
        })}
    </>
}

function ensurePositionedTextHost(pageDiv: HTMLDivElement, pageNumber: number, sourceKey?: string): HTMLDivElement {
    const existing = pageDiv.querySelector<HTMLDivElement>(`:scope > [data-inklayer-positioned-text-page="${pageNumber}"]`)
    if (existing) {
        if (sourceKey) existing.dataset.inklayerPositionedTextSourceKey = sourceKey
        return existing
    }
    const host = document.createElement('div')
    host.className = styles.positionedTextLayer
    host.dataset.inklayerPositionedTextPage = String(pageNumber)
    if (sourceKey) host.dataset.inklayerPositionedTextSourceKey = sourceKey
    pageDiv.append(host)
    return host
}

function PositionedTextBlock({
    block,
    scaleX,
    scaleY
}: {
    block: PdfPositionedTextBlock
    scaleX: number
    scaleY: number
}): React.JSX.Element | null {
    const style = positionedBlockStyle(block.geometry, scaleX, scaleY)
    if (!style) return null

    return <div
        className={styles.positionedTextBlock}
        data-inklayer-positioned-text-block={block.id}
        data-inklayer-positioned-text-block-id={block.blockId}
        data-inklayer-positioned-text-block-kind={block.kind}
        aria-hidden="true"
        style={style}
    />
}

function PositionedTextSpan({
    span,
    pageNumber,
    sourceKey,
    scaleX,
    scaleY
}: {
    span: PdfPositionedTextSpan
    pageNumber: number
    sourceKey?: string
    scaleX: number
    scaleY: number
}): React.JSX.Element | null {
    const { geometry } = span
    const style = positionedTextStyle(geometry, scaleX, scaleY)
    const contentRef = useRef<HTMLSpanElement>(null)

    useLayoutEffect(() => {
        const content = contentRef.current
        const targetWidth = typeof style?.width === 'number' ? style.width : 0
        const targetHeight = typeof style?.height === 'number' ? style.height : 0
        if (!content || targetWidth <= 0 || targetHeight <= 0) return

        const fitTextToGeometry = () => {
            content.style.fontSize = `${targetHeight}px`
            content.style.lineHeight = `${targetHeight}px`
            const naturalWidth = content.offsetWidth
            if (!Number.isFinite(naturalWidth) || naturalWidth <= 0) return
            const fontSize = targetHeight * targetWidth / naturalWidth
            content.style.fontSize = `${fontSize}px`
            content.dataset.inklayerPositionedTextFontSize = String(fontSize)
        }

        fitTextToGeometry()
        let active = true
        void document.fonts?.ready.then(() => {
            if (active) fitTextToGeometry()
        })
        return () => { active = false }
    }, [span.text, style?.height, style?.width])

    if (!style || !span.text.trim()) return null

    return <span
        className={styles.positionedTextSpan}
        data-inklayer-positioned-text-id={span.id}
        data-inklayer-positioned-text-page={pageNumber}
        data-inklayer-positioned-text-source-key={sourceKey}
        data-inklayer-positioned-text-block-id={span.blockId}
        data-inklayer-positioned-text-span-id={span.spanId}
        data-inklayer-positioned-text-logical-start={span.logicalRange?.start}
        data-inklayer-positioned-text-logical-end={span.logicalRange?.end}
        style={style}
    ><span ref={contentRef} className={styles.positionedTextContent}>{span.text}</span></span>
}

function positionedTextStyle(
    geometry: PdfPositionedTextGeometry,
    scaleX: number,
    scaleY: number
): React.CSSProperties | null {
    const geometryStyle = positionedGeometryStyle(geometry, scaleX, scaleY)
    if (!geometryStyle) return null
    const height = typeof geometryStyle.height === 'number' ? geometryStyle.height : 0
    return {
        ...geometryStyle,
        fontSize: Math.max(1, height),
        lineHeight: `${Math.max(1, height)}px`,
        zIndex: 1
    }
}

function positionedBlockStyle(
    geometry: PdfPositionedTextGeometry,
    scaleX: number,
    scaleY: number
): React.CSSProperties | null {
    const geometryStyle = positionedGeometryStyle(geometry, scaleX, scaleY)
    if (!geometryStyle) return null
    return {
        ...geometryStyle,
        boxSizing: 'border-box',
        border: '1px solid rgba(37, 99, 235, 0.95)',
        backgroundColor: 'rgba(37, 99, 235, 0.04)',
        pointerEvents: 'none',
        zIndex: 0
    }
}

function positionedGeometryStyle(
    geometry: PdfPositionedTextGeometry,
    scaleX: number,
    scaleY: number
): React.CSSProperties | null {
    const points = geometry.kind === 'bbox'
        ? [
            { x: geometry.x, y: geometry.y },
            { x: geometry.x + geometry.width, y: geometry.y },
            { x: geometry.x + geometry.width, y: geometry.y + geometry.height },
            { x: geometry.x, y: geometry.y + geometry.height }
        ]
        : geometry.points
    if (points.length < 4 || !points.slice(0, 4).every((point) => Number.isFinite(point.x) && Number.isFinite(point.y))) {
        return null
    }
    const [topLeft, topRight, , bottomLeft] = points
    const width = Math.hypot(topRight.x - topLeft.x, topRight.y - topLeft.y)
    const height = Math.hypot(bottomLeft.x - topLeft.x, bottomLeft.y - topLeft.y)
    if (![width, height, scaleX, scaleY].every(Number.isFinite) ||
        width <= 0 || height <= 0 || scaleX <= 0 || scaleY <= 0) return null
    const cssWidth = width * scaleX
    const cssHeight = height * scaleY
    const matrix = [
        (topRight.x - topLeft.x) * scaleX / cssWidth,
        (topRight.y - topLeft.y) * scaleY / cssWidth,
        (bottomLeft.x - topLeft.x) * scaleX / cssHeight,
        (bottomLeft.y - topLeft.y) * scaleY / cssHeight,
        0,
        0
    ]
    return {
        left: topLeft.x * scaleX,
        top: topLeft.y * scaleY,
        width: cssWidth,
        height: cssHeight,
        transformOrigin: '0 0',
        transform: `matrix(${matrix.join(',')})`
    }
}
