/** @jest-environment jsdom */

import { act, renderHook, waitFor } from '@testing-library/react'
import { MessageChannel } from 'node:worker_threads'
import type { PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { usePdfViewer } from '../usePdfViewer'

const mockPdfViewerConstructor = jest.fn()

jest.mock('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url', () => 'pdf.worker.mjs', { virtual: true })

jest.mock('pdfjs-dist/legacy/build/pdf.mjs', () => ({
    AnnotationEditorType: { DISABLE: 0 },
    AnnotationMode: { DISABLE: 0 },
    GlobalWorkerOptions: {},
    PDFDataRangeTransport: class {},
    getDocument: jest.fn()
}))

jest.mock('pdfjs-dist/legacy/web/pdf_viewer.mjs', () => ({
    DownloadManager: class {},
    EventBus: class {},
    PDFFindController: class {},
    PDFLinkService: class {
        setViewer = jest.fn()
        setDocument = jest.fn()
    },
    PDFViewer: class {
        cleanup = jest.fn()
        setDocument = jest.fn()

        constructor(options: unknown) {
            mockPdfViewerConstructor(options)
        }
    }
}))

interface DeferredTask {
    promise: Promise<PDFDocumentProxy>
    resolve: (document: PDFDocumentProxy) => void
    reject: (error: Error) => void
    destroy: jest.Mock<Promise<void>, []>
    onProgress: ((progress: { loaded: number; total: number }) => void) | null
}

function createDeferredTask(): DeferredTask {
    let resolve!: (document: PDFDocumentProxy) => void
    let reject!: (error: Error) => void
    const promise = new Promise<PDFDocumentProxy>((resolvePromise, rejectPromise) => {
        resolve = resolvePromise
        reject = rejectPromise
    })

    return {
        promise,
        resolve,
        reject,
        destroy: jest.fn(async () => undefined),
        onProgress: null
    }
}

function createDocument(name: string) {
    return {
        name,
        destroy: jest.fn(async () => undefined),
        getMetadata: jest.fn(async () => ({ info: { Title: name } }))
    } as unknown as PDFDocumentProxy
}

describe('usePdfViewer', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('keeps the native PDF.js page spacing used by adaptive zoom', () => {
        const loadingTask = createDeferredTask()
        jest.mocked(getDocument).mockReturnValue(loadingTask as never)
        const containerRef = { current: document.createElement('div') }

        const { unmount } = renderHook(() =>
            usePdfViewer(containerRef, {
                url: 'test.pdf',
                enableRange: false
            })
        )

        expect(mockPdfViewerConstructor).toHaveBeenCalledTimes(1)
        expect(mockPdfViewerConstructor.mock.calls[0][0]).not.toHaveProperty('removePageBorders')

        unmount()
    })

    it('passes host PDF.js font asset options to document loading', async () => {
        const loadingTask = createDeferredTask()
        jest.mocked(getDocument).mockReturnValue(loadingTask as never)
        const containerRef = { current: document.createElement('div') }

        const { unmount } = renderHook(() =>
            usePdfViewer(containerRef, {
                url: 'test.pdf',
                enableRange: false,
                pdfjsOptions: {
                    cMapUrl: '/cmaps/',
                    cMapPacked: true,
                    standardFontDataUrl: '/standard_fonts/',
                    useSystemFonts: false
                }
            })
        )

        await waitFor(() => expect(getDocument).toHaveBeenCalledTimes(1))
        expect(getDocument).toHaveBeenCalledWith(expect.objectContaining({
            cMapUrl: '/cmaps/',
            cMapPacked: true,
            standardFontDataUrl: '/standard_fonts/',
            useSystemFonts: false
        }))

        unmount()
    })

    it('does not reuse a PDF data buffer after PDF.js transfers it during a viewer reload', async () => {
        const firstTask = createDeferredTask()
        const secondTask = createDeferredTask()
        const getDocumentMock = jest.mocked(getDocument)
        const dataLengths: number[] = []
        getDocumentMock.mockImplementation((options: { data?: unknown }) => {
            const data = options.data as Uint8Array
            dataLengths.push(data.byteLength)
            if (data.byteLength === 0) {
                throw new DOMException(
                    "Failed to execute 'postMessage' on 'Worker': An ArrayBuffer is detached and could not be cloned.",
                    'DataCloneError'
                )
            }
            const transferChannel = new MessageChannel()
            transferChannel.port1.postMessage(data.buffer, [data.buffer])
            transferChannel.port1.close()
            transferChannel.port2.close()
            return (dataLengths.length === 1 ? firstTask : secondTask) as never
        })
        const containerRef = { current: document.createElement('div') }
        const source = new Uint8Array([37, 80, 68, 70])
        const onLoadError = jest.fn()

        const { result, rerender, unmount } = renderHook(
            ({ textLayerMode }) => usePdfViewer(containerRef, {
                data: source,
                enableRange: false,
                textLayerMode,
                onLoadError
            }),
            { initialProps: { textLayerMode: 0 } }
        )

        await waitFor(() => expect(getDocumentMock).toHaveBeenCalledTimes(1))
        rerender({ textLayerMode: 1 })
        await waitFor(() => expect(getDocumentMock).toHaveBeenCalledTimes(2))
        await waitFor(() => expect(onLoadError).not.toHaveBeenCalled())
        expect(dataLengths).toEqual([4, 4])
        expect(result.current.loadError).toBeNull()

        firstTask.resolve(createDocument('first'))
        secondTask.resolve(createDocument('second'))
        unmount()
    })

    it('ignores a stale loading task after the URL changes', async () => {
        const firstTask = createDeferredTask()
        const secondTask = createDeferredTask()
        const getDocumentMock = jest.mocked(getDocument)
        getDocumentMock.mockReturnValueOnce(firstTask as never).mockReturnValueOnce(secondTask as never)

        const firstDocument = createDocument('first')
        const secondDocument = createDocument('second')
        const onLoadSuccess = jest.fn()
        const onLoadError = jest.fn()
        const onLoadEnd = jest.fn()
        const container = document.createElement('div')
        const containerRef = { current: container }

        const { result, rerender } = renderHook(
            ({ url }) =>
                usePdfViewer(
                    containerRef,
                    {
                        url,
                        enableRange: false,
                        onLoadSuccess,
                        onLoadError,
                        onLoadEnd
                    }
                ),
            { initialProps: { url: 'first.pdf' } }
        )

        await waitFor(() => expect(getDocumentMock).toHaveBeenCalledTimes(1))
        rerender({ url: 'second.pdf' })
        await waitFor(() => expect(getDocumentMock).toHaveBeenCalledTimes(2))

        await act(async () => {
            secondTask.resolve(secondDocument)
            await secondTask.promise
        })

        await waitFor(() => expect(result.current.pdfDocument).toBe(secondDocument))

        await act(async () => {
            firstTask.resolve(firstDocument)
            await firstTask.promise
        })

        expect(firstTask.destroy).toHaveBeenCalled()
        expect(firstDocument.destroy).toHaveBeenCalled()
        expect(result.current.pdfDocument).toBe(secondDocument)
        expect(result.current.loadError).toBeNull()
        expect(onLoadSuccess).toHaveBeenCalledTimes(1)
        expect(onLoadSuccess).toHaveBeenCalledWith(secondDocument)
        expect(onLoadError).not.toHaveBeenCalled()
        expect(onLoadEnd).toHaveBeenCalledTimes(1)
    })
})
