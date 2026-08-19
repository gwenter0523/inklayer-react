/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { act, render, waitFor } from '@testing-library/react'
import React from 'react'
import { PdfViewerContext, type PdfViewerContextValue } from '@/context/pdf_viewer_context'
import { PositionedTextLayer } from '../positioned_text_layer'
import type { PdfPositionedTextSource } from '../types/annotator'

describe('PositionedTextLayer', () => {
    it('loads only visible pages plus one adjacent page and projects span geometry', async () => {
        const offsetWidth = jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(240)
        const host = document.createElement('div')
        document.body.appendChild(host)
        const pageDivs = [1, 2, 3].map(() => document.createElement('div'))
        pageDivs.forEach((div) => host.appendChild(div))
        const pageRects = [
            { top: 0, bottom: 800 },
            { top: 816, bottom: 1616 },
            { top: 1632, bottom: 2432 }
        ]
        pageDivs.forEach((div, index) => {
            Object.defineProperty(div, 'getBoundingClientRect', {
                configurable: true,
                value: () => ({
                    ...pageRects[index],
                    left: 0,
                    right: 600,
                    width: 600,
                    height: 800,
                    x: 0,
                    y: pageRects[index].top,
                    toJSON: () => ({})
                })
            })
        })
        const viewerContainer = document.createElement('div')
        host.appendChild(viewerContainer)
        Object.defineProperty(viewerContainer, 'getBoundingClientRect', {
            configurable: true,
            value: () => ({
                top: 0,
                bottom: 800,
                left: 0,
                right: 600,
                width: 600,
                height: 800,
                x: 0,
                y: 0,
                toJSON: () => ({})
            })
        })
        const eventHandlers = new Map<string, () => void>()
        const eventBus = {
            on: jest.fn((event: string, handler: () => void) => eventHandlers.set(event, handler)),
            off: jest.fn((event: string) => eventHandlers.delete(event))
        }
        const pdfViewer = {
            pagesCount: 3,
            currentPageNumber: 1,
            getPageView: jest.fn((index: number) => ({
                div: pageDivs[index],
                viewport: { width: 600, height: 800 }
            }))
        }
        const source: PdfPositionedTextSource = {
            pageCount: 3,
            getPage: jest.fn(async (pageNumber: number) => pageNumber === 1
                ? {
                    pageNumber: 1,
                    dimensions: { width: 600, height: 800 },
                    blocks: [{
                        id: 'block-a-layout',
                        blockId: 'block-a',
                        kind: 'paragraph',
                        geometry: { kind: 'bbox', x: 50, y: 110, width: 200, height: 60 }
                    }],
                    spans: [{
                        id: 'span-a',
                        blockId: 'block-a',
                        spanId: 'span-a',
                        text: '可选择文字',
                        geometry: { kind: 'bbox', x: 60, y: 120, width: 180, height: 32 }
                    }]
                }
                : { pageNumber, dimensions: { width: 600, height: 800 }, spans: [] })
        }
        const contextValue = {
            pdfViewer,
            eventBus,
            viewerContainerRef: { current: viewerContainer },
            isReady: true,
        } as unknown as PdfViewerContextValue

        render(
            <PdfViewerContext.Provider value={contextValue}>
                <PositionedTextLayer source={source} />
            </PdfViewerContext.Provider>
        )

        await waitFor(() => expect(source.getPage).toHaveBeenCalledWith(1))
        expect(source.getPage).toHaveBeenCalledWith(2)
        expect(source.getPage).not.toHaveBeenCalledWith(3)
        await waitFor(() => expect(pageDivs[0].querySelector('[data-inklayer-positioned-text-id="span-a"]')).toBeInTheDocument())

        const span = pageDivs[0].querySelector('[data-inklayer-positioned-text-id="span-a"]')
        expect(span).toHaveTextContent('可选择文字')
        expect(span).toHaveAttribute('data-inklayer-positioned-text-block-id', 'block-a')
        expect(span).toHaveStyle({ left: '60px', top: '120px', width: '180px', height: '32px' })
        expect(span).toHaveStyle({ transform: 'matrix(1,0,0,1,0,0)' })
        expect(span?.firstElementChild).toHaveTextContent('可选择文字')
        expect(span?.firstElementChild).toHaveStyle({ fontSize: '24px', lineHeight: '32px' })
        const block = pageDivs[0].querySelector('[data-inklayer-positioned-text-block="block-a-layout"]')
        expect(block).toBeInTheDocument()
        expect(block).toHaveAttribute('data-inklayer-positioned-text-block-kind', 'paragraph')
        expect(block).toHaveStyle({
            left: '50px',
            top: '110px',
            width: '200px',
            height: '60px',
            pointerEvents: 'none'
        })
        expect(eventBus.on).toHaveBeenCalledWith('scalechanging', expect.any(Function))

        const firstLayer = pageDivs[0].querySelector('[data-inklayer-positioned-text-page="1"]')
        firstLayer?.remove()
        act(() => eventHandlers.get('pagerendered')?.())
        await waitFor(() => {
            const remountedLayer = pageDivs[0].querySelector('[data-inklayer-positioned-text-page="1"]')
            expect(remountedLayer).toBeInTheDocument()
            expect(remountedLayer).not.toBe(firstLayer)
            expect(remountedLayer?.querySelector('[data-inklayer-positioned-text-id="span-a"]')).toHaveTextContent('可选择文字')
        })

        offsetWidth.mockRestore()
        host.remove()
    })

    it('preserves a rotated text quad in the selectable span transform', async () => {
        const pageDiv = document.createElement('div')
        const host = document.createElement('div')
        host.appendChild(pageDiv)
        document.body.appendChild(host)
        Object.defineProperty(pageDiv, 'getBoundingClientRect', {
            configurable: true,
            value: () => ({ top: 0, bottom: 800, left: 0, right: 600, width: 600, height: 800, x: 0, y: 0, toJSON: () => ({}) })
        })
        Object.defineProperty(host, 'getBoundingClientRect', {
            configurable: true,
            value: () => ({ top: 0, bottom: 800, left: 0, right: 600, width: 600, height: 800, x: 0, y: 0, toJSON: () => ({}) })
        })
        const eventBus = { on: jest.fn(), off: jest.fn() }
        const pdfViewer = {
            pagesCount: 1,
            currentPageNumber: 1,
            getPageView: jest.fn(() => ({ div: pageDiv, viewport: { width: 600, height: 800 } }))
        }
        const source: PdfPositionedTextSource = {
            pageCount: 1,
            getPage: jest.fn(async () => ({
                pageNumber: 1,
                dimensions: { width: 600, height: 800 },
                spans: [{
                    id: 'rotated',
                    text: '旋转文字',
                    geometry: {
                        kind: 'polygon',
                        points: [{ x: 100, y: 100 }, { x: 100, y: 200 }, { x: 80, y: 200 }, { x: 80, y: 100 }]
                    }
                }]
            }))
        }
        const contextValue = {
            pdfViewer,
            eventBus,
            viewerContainerRef: { current: host },
            isReady: true,
        } as unknown as PdfViewerContextValue

        render(
            <PdfViewerContext.Provider value={contextValue}>
                <PositionedTextLayer source={source} />
            </PdfViewerContext.Provider>
        )

        await waitFor(() => expect(host.querySelector('[data-inklayer-positioned-text-id="rotated"]')).toBeInTheDocument())
        expect(host.querySelector('[data-inklayer-positioned-text-id="rotated"]')).toHaveStyle({
            left: '100px',
            top: '100px',
            transform: 'matrix(0,1,-1,0,0,0)'
        })
        host.remove()
    })
})
