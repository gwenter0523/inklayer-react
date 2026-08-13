import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePdfViewerContext } from '@/context/pdf_viewer_context'
import type {
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
    if (![geometry.x, geometry.y, geometry.width, geometry.height].every(Number.isFinite) ||
        geometry.width <= 0 || geometry.height <= 0 || !span.text) return null

    return <span
        className={styles.positionedTextSpan}
        data-inklayer-positioned-text-id={span.id}
        data-inklayer-positioned-text-block-id={span.blockId}
        data-inklayer-positioned-text-span-id={span.spanId}
        style={{
            left: geometry.x * scaleX,
            top: geometry.y * scaleY,
            width: geometry.width * scaleX,
            height: geometry.height * scaleY,
            fontSize: Math.max(1, geometry.height * scaleY),
            lineHeight: `${Math.max(1, geometry.height * scaleY)}px`
        }}
    >{span.text}</span>
}
