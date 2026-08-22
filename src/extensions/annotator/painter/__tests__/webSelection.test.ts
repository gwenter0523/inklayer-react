/** @jest-environment jsdom */

import Highlighter from 'web-highlighter'
import { WebSelection } from '../webSelection'
import type { PdfPositionedTextSource } from '../../types/annotator'

jest.mock('web-highlighter', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        stop: jest.fn(),
        on: jest.fn(function () {
            return this
        }),
        off: jest.fn(function () {
            return this
        }),
        dispose: jest.fn(),
        getDoms: jest.fn(() => []),
        removeAll: jest.fn(),
        fromRange: jest.fn()
    }))
}))

interface MockHighlighter {
    off: jest.Mock
    dispose: jest.Mock
    getDoms: jest.Mock
    on: jest.Mock
}

const getHighlighterInstance = (index: number) =>
    jest.mocked(Highlighter).mock.results[index].value as unknown as MockHighlighter

function logicalSource(sourceKey = 'source-key'): PdfPositionedTextSource {
    return {
        pageCount: 1,
        sourceKey,
        logicalText: '第一段。\n\n第二段。',
        getPage: jest.fn(async () => null)
    }
}

function appendLogicalSpan(root: HTMLElement, sourceKey = 'source-key') {
    const span = document.createElement('span')
    span.dataset.inklayerPositionedTextId = 'span-1'
    span.dataset.inklayerPositionedTextPage = '1'
    span.dataset.inklayerPositionedTextSourceKey = sourceKey
    span.dataset.inklayerPositionedTextLogicalStart = '0'
    span.dataset.inklayerPositionedTextLogicalEnd = '4'
    span.textContent = '第一段。'
    root.append(span)
    return span
}

describe('WebSelection', () => {
    beforeEach(() => {
        jest.mocked(Highlighter).mockClear()
    })

    it('removes document and highlighter listeners when destroyed', () => {
        const onSelect = jest.fn()
        const selection = { type: 'Caret', anchorNode: null } as unknown as Selection
        const getSelection = jest.spyOn(window, 'getSelection').mockReturnValue(selection)
        const webSelection = new WebSelection({ onSelect, onHighlight: jest.fn() })

        webSelection.create(document.createElement('div'))
        document.dispatchEvent(new Event('selectionchange'))
        expect(onSelect).toHaveBeenCalledTimes(1)

        const highlighter = getHighlighterInstance(0)
        webSelection.destroy()
        document.dispatchEvent(new Event('selectionchange'))

        expect(onSelect).toHaveBeenCalledTimes(1)
        expect(highlighter.off).toHaveBeenCalledWith('selection:create', expect.any(Function))
        expect(highlighter.dispose).toHaveBeenCalledTimes(1)
        getSelection.mockRestore()
    })

    it('cleans up the previous instance before creating another one', () => {
        const webSelection = new WebSelection({ onSelect: jest.fn(), onHighlight: jest.fn() })

        webSelection.create(document.createElement('div'))
        const firstHighlighter = getHighlighterInstance(0)
        webSelection.create(document.createElement('div'))

        expect(firstHighlighter.off).toHaveBeenCalledTimes(1)
        expect(firstHighlighter.dispose).toHaveBeenCalledTimes(1)
        expect(Highlighter).toHaveBeenCalledTimes(2)

        webSelection.destroy()
    })

    it('does not retain document listeners across repeated mount cycles', () => {
        const onSelect = jest.fn()
        const selection = { type: 'Caret', anchorNode: null } as unknown as Selection
        const getSelection = jest.spyOn(window, 'getSelection').mockReturnValue(selection)
        const webSelection = new WebSelection({ onSelect, onHighlight: jest.fn() })

        for (let index = 0; index < 50; index++) {
            webSelection.create(document.createElement('div'))
            webSelection.destroy()
        }

        document.dispatchEvent(new Event('selectionchange'))
        expect(onSelect).not.toHaveBeenCalled()
        expect(Highlighter).toHaveBeenCalledTimes(50)
        for (let index = 0; index < 50; index++) {
            expect(getHighlighterInstance(index).dispose).toHaveBeenCalledTimes(1)
        }

        getSelection.mockRestore()
    })

    it('ignores selections outside the PDF viewer root', () => {
        const onSelect = jest.fn()
        const root = document.createElement('div')
        const pdfText = document.createTextNode('PDF text')
        const input = document.createElement('input')
        root.appendChild(pdfText)
        document.body.append(root, input)

        const pdfRange = document.createRange()
        pdfRange.selectNodeContents(pdfText)
        const inputRange = document.createRange()
        inputRange.selectNode(input)

        let selection = {
            type: 'Range',
            anchorNode: pdfText,
            rangeCount: 1,
            toString: () => 'PDF text',
            getRangeAt: () => pdfRange
        } as unknown as Selection
        const getSelection = jest.spyOn(window, 'getSelection').mockImplementation(() => selection)
        const webSelection = new WebSelection({ onSelect, onHighlight: jest.fn() })
        webSelection.create(root)

        document.dispatchEvent(new Event('selectionchange'))
        expect(webSelection.isRangeSelectionActive()).toBe(true)

        selection = {
            type: 'Range',
            anchorNode: input,
            rangeCount: 1,
            toString: () => '446',
            getRangeAt: () => inputRange
        } as unknown as Selection
        document.dispatchEvent(new Event('selectionchange'))
        input.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

        expect(webSelection.isRangeSelectionActive()).toBe(false)
        expect(onSelect).toHaveBeenLastCalledWith(null)
        expect(onSelect).not.toHaveBeenCalledWith(pdfRange)

        webSelection.destroy()
        root.remove()
        input.remove()
        getSelection.mockRestore()
    })

    it('resolves page numbers from positioned text layers mounted outside PDF.js pages', () => {
        const onHighlight = jest.fn()
        const webSelection = new WebSelection({ onSelect: jest.fn(), onHighlight })
        const root = document.createElement('div')
        document.body.append(root)
        webSelection.create(root)

        const highlighter = getHighlighterInstance(0)
        const positionedLayer = document.createElement('div')
        positionedLayer.setAttribute('data-inklayer-positioned-text-page', '7')
        const span = document.createElement('span')
        positionedLayer.append(span)
        root.append(positionedLayer)
        highlighter.getDoms.mockReturnValue([span])

        const selectionCreate = highlighter.on.mock.calls.find(([event]) => event === 'selection:create')?.[1] as
            | ((data: { sources: Array<{ id: string }> }) => void)
            | undefined
        expect(selectionCreate).toBeDefined()
        selectionCreate?.({ sources: [{ id: 'source-1' }] })

        expect(onHighlight).toHaveBeenCalledWith({ '7': [span] })
        webSelection.destroy()
        root.remove()
    })

    it('writes only resolver-owned logical text to text/plain on the current viewer root', () => {
        const root = document.createElement('div')
        const span = appendLogicalSpan(root)
        document.body.append(root)
        const webSelection = new WebSelection({
            onSelect: jest.fn(),
            onHighlight: jest.fn(),
            positionedTextSource: logicalSource()
        })
        webSelection.create(root)

        const range = document.createRange()
        range.selectNodeContents(span.firstChild!)
        const selection = window.getSelection()!
        selection.removeAllRanges()
        selection.addRange(range)
        const setData = jest.fn()
        const copyEvent = new Event('copy', { bubbles: true, cancelable: true })
        Object.defineProperty(copyEvent, 'clipboardData', { value: { setData } })

        root.dispatchEvent(copyEvent)

        expect(setData).toHaveBeenCalledTimes(1)
        expect(setData).toHaveBeenCalledWith('text/plain', '第一段。')
        expect(copyEvent.defaultPrevented).toBe(true)
        webSelection.destroy()
        root.remove()
        selection.removeAllRanges()
    })

    it('leaves the existing browser copy behavior untouched without a logical source', () => {
        const root = document.createElement('div')
        const text = document.createTextNode('native viewer text')
        root.append(text)
        document.body.append(root)
        const webSelection = new WebSelection({ onSelect: jest.fn(), onHighlight: jest.fn() })
        webSelection.create(root)

        const range = document.createRange()
        range.selectNodeContents(text)
        const selection = window.getSelection()!
        selection.removeAllRanges()
        selection.addRange(range)
        const copyEvent = new Event('copy', { bubbles: true, cancelable: true })
        const setData = jest.fn()
        Object.defineProperty(copyEvent, 'clipboardData', { value: { setData } })

        root.dispatchEvent(copyEvent)

        expect(copyEvent.defaultPrevented).toBe(false)
        expect(setData).not.toHaveBeenCalled()
        webSelection.destroy()
        root.remove()
        selection.removeAllRanges()
    })

    it('does not hijack copy outside the current viewer and clears stale source selections', () => {
        const root = document.createElement('div')
        const span = appendLogicalSpan(root)
        const outside = document.createElement('div')
        document.body.append(root, outside)
        const webSelection = new WebSelection({
            onSelect: jest.fn(),
            onHighlight: jest.fn(),
            positionedTextSource: logicalSource()
        })
        webSelection.create(root)

        const range = document.createRange()
        range.selectNodeContents(span.firstChild!)
        const selection = window.getSelection()!
        selection.removeAllRanges()
        selection.addRange(range)
        const outsideCopy = new Event('copy', { bubbles: true, cancelable: true })
        const outsideSetData = jest.fn()
        Object.defineProperty(outsideCopy, 'clipboardData', { value: { setData: outsideSetData } })
        outside.dispatchEvent(outsideCopy)
        expect(outsideCopy.defaultPrevented).toBe(false)
        expect(outsideSetData).not.toHaveBeenCalled()

        webSelection.setPositionedTextSource(logicalSource('new-source'))
        const staleCopy = new Event('copy', { bubbles: true, cancelable: true })
        const staleSetData = jest.fn()
        Object.defineProperty(staleCopy, 'clipboardData', { value: { setData: staleSetData } })
        root.dispatchEvent(staleCopy)
        expect(staleCopy.defaultPrevented).toBe(false)
        expect(staleSetData).not.toHaveBeenCalled()

        webSelection.destroy()
        root.remove()
        outside.remove()
        selection.removeAllRanges()
    })

    it('passes the same logical selection to resolver-driven annotation creation', () => {
        const onHighlight = jest.fn()
        const root = document.createElement('div')
        const span = appendLogicalSpan(root)
        document.body.append(root)
        const webSelection = new WebSelection({
            onSelect: jest.fn(),
            onHighlight,
            positionedTextSource: logicalSource()
        })
        webSelection.create(root)
        const range = document.createRange()
        range.selectNodeContents(span.firstChild!)
        webSelection.highlight(range)

        const highlighter = getHighlighterInstance(0)
        const selectionCreate = highlighter.on.mock.calls.find(([event]) => event === 'selection:create')?.[1] as
            | ((data: { sources: Array<{ id: string }> }) => void)
            | undefined
        selectionCreate?.({ sources: [] })

        expect(onHighlight).toHaveBeenCalledWith(
            {},
            expect.objectContaining({ sourceKey: 'source-key', text: '第一段。' })
        )
        webSelection.destroy()
        root.remove()
    })
})
