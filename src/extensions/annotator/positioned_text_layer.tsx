import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePdfViewerContext } from '@/context/pdf_viewer_context'
import type {
    PdfPositionedTextGeometry,
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
    readonly div: HTMLDivElement
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
        eventBus.on('pagesloaded', refresh)
        eventBus.on('pagerendered', refresh)
        eventBus.on('updateviewarea', refresh)
        eventBus.on('scalechanging', refresh)
        eventBus.on('rotationchanging', refresh)
        return () => {
            eventBus.off('pagesloaded', refresh)
            eventBus.off('pagerendered', refresh)
            eventBus.off('updateviewarea', refresh)
            eventBus.off('scalechanging', refresh)
            eventBus.off('rotationchanging', refresh)
        }
    }, [eventBus, isReady, pdfViewer, refreshVisiblePages, source])

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

    const mountedPages = useMemo(() => {
        if (!pdfViewer) return []
        return visiblePageNumbers.flatMap((pageNumber): PageMount[] => {
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
                div: pageView.div,
                scaleX: viewport.width / page.dimensions.width,
                scaleY: viewport.height / page.dimensions.height
            }]
        })
    }, [pages, pdfViewer, visiblePageNumbers])

    return <>
        {mountedPages.map((mount) => {
            const page = pages.get(mount.pageNumber)
            if (!page) return null
            return createPortal(
                <div className={styles.positionedTextLayer} data-inklayer-positioned-text-page={mount.pageNumber}>
                    {page.spans.map((span) => (
                        <PositionedTextSpan
                            key={span.id}
                            span={span}
                            scaleX={mount.scaleX}
                            scaleY={mount.scaleY}
                        />
                    ))}
                </div>,
                mount.div,
                `positioned-text-${mount.pageNumber}`
            )
        })}
    </>
}

function PositionedTextSpan({
    span,
    scaleX,
    scaleY
}: {
    span: PdfPositionedTextSpan
    scaleX: number
    scaleY: number
}): React.JSX.Element | null {
    const { geometry } = span
    const style = positionedTextStyle(geometry, scaleX, scaleY)
    if (!style || !span.text.trim()) return null

    return <span
        className={styles.positionedTextSpan}
        data-inklayer-positioned-text-id={span.id}
        data-inklayer-positioned-text-block-id={span.blockId}
        data-inklayer-positioned-text-span-id={span.spanId}
        style={style}
    >{span.text}</span>
}

function positionedTextStyle(
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
        fontSize: Math.max(1, cssHeight),
        lineHeight: `${Math.max(1, cssHeight)}px`,
        transformOrigin: '0 0',
        transform: `matrix(${matrix.join(',')})`
    }
}
