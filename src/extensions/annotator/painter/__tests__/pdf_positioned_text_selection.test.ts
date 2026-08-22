/** @jest-environment jsdom */

import { PdfPositionedTextSelectionResolver } from '../pdf_positioned_text_selection'
import type { PdfPositionedTextSource } from '../../types/annotator'

function appendSpan(
    root: HTMLElement,
    options: {
        id: string
        pageNumber: number
        text: string
        start: number
        end: number
        sourceKey: string
    }
): HTMLSpanElement {
    const page = root.querySelector(`[data-inklayer-positioned-text-page="${options.pageNumber}"]`)
        ?? (() => {
            const created = document.createElement('div')
            created.dataset.inklayerPositionedTextPage = String(options.pageNumber)
            root.append(created)
            return created
        })()
    const span = document.createElement('span')
    span.dataset.inklayerPositionedTextId = options.id
    span.dataset.inklayerPositionedTextPage = String(options.pageNumber)
    span.dataset.inklayerPositionedTextSourceKey = options.sourceKey
    span.dataset.inklayerPositionedTextLogicalStart = String(options.start)
    span.dataset.inklayerPositionedTextLogicalEnd = String(options.end)
    span.textContent = options.text
    page.append(span)
    return span
}

function selectText(start: Node, startOffset: number, end: Node, endOffset: number): Range {
    const range = document.createRange()
    range.setStart(start, startOffset)
    range.setEnd(end, endOffset)
    return range
}

function source(logicalText: string, sourceKey = 'source-key'): PdfPositionedTextSource {
    return {
        pageCount: 2,
        sourceKey,
        logicalText,
        getPage: jest.fn(async () => null)
    } as PdfPositionedTextSource
}

describe('PdfPositionedTextSelectionResolver', () => {
    it('resolves an inline selection from a positioned span logical range', () => {
        const root = document.createElement('div')
        const span = appendSpan(root, {
            id: 'span-1',
            pageNumber: 1,
            text: '本院认为',
            start: 0,
            end: 4,
            sourceKey: 'source-key'
        })
        const resolver = new PdfPositionedTextSelectionResolver(root, source('本院认为，证据充分。'))

        const result = resolver.resolve(selectText(span.firstChild!, 1, span.firstChild!, 3))

        expect(result).toEqual(expect.objectContaining({
            sourceKey: 'source-key',
            text: '院认',
            range: { start: 1, end: 3 }
        }))
    })

    it('preserves paragraph separators and table TSV supplied by the source across spans', () => {
        const logicalText = '第一段结尾。\n\n第二段开头。\n姓名\t金额\n张三\t10'
        const root = document.createElement('div')
        const first = appendSpan(root, {
            id: 'span-1',
            pageNumber: 1,
            text: '第一段结尾。',
            start: 0,
            end: 6,
            sourceKey: 'source-key'
        })
        const second = appendSpan(root, {
            id: 'span-2',
            pageNumber: 1,
            text: '第二段开头。',
            start: 8,
            end: 14,
            sourceKey: 'source-key'
        })
        const third = appendSpan(root, {
            id: 'span-3',
            pageNumber: 1,
            text: '姓名',
            start: 15,
            end: 17,
            sourceKey: 'source-key'
        })
        const fourth = appendSpan(root, {
            id: 'span-4',
            pageNumber: 1,
            text: '金额',
            start: 18,
            end: 20,
            sourceKey: 'source-key'
        })
        const resolver = new PdfPositionedTextSelectionResolver(root, source(logicalText))

        expect(resolver.resolve(selectText(first.firstChild!, 2, second.firstChild!, 2))?.text)
            .toBe('段结尾。\n\n第二')
        expect(resolver.resolve(selectText(third.firstChild!, 0, fourth.firstChild!, 2))?.text)
            .toBe('姓名\t金额')
    })

    it('resolves a cross-page selection from the same logical source', () => {
        const logicalText = '上一页最后一句。\n\n下一页第一句。'
        const root = document.createElement('div')
        const first = appendSpan(root, {
            id: 'page-1-span',
            pageNumber: 1,
            text: '上一页最后一句。',
            start: 0,
            end: 8,
            sourceKey: 'source-key'
        })
        const second = appendSpan(root, {
            id: 'page-2-span',
            pageNumber: 2,
            text: '下一页第一句。',
            start: 10,
            end: 16,
            sourceKey: 'source-key'
        })
        const resolver = new PdfPositionedTextSelectionResolver(root, source(logicalText))

        const result = resolver.resolve(selectText(first.firstChild!, 4, second.firstChild!, 4))

        expect(result?.text).toBe('后一句。\n\n下一页第')
        expect(result?.segments.map((segment) => segment.pageNumber)).toEqual([1, 2])
    })

    it('returns the same logical range for a reverse DOM selection', () => {
        const root = document.createElement('div')
        const first = appendSpan(root, {
            id: 'span-1',
            pageNumber: 1,
            text: '前半段',
            start: 0,
            end: 3,
            sourceKey: 'source-key'
        })
        const second = appendSpan(root, {
            id: 'span-2',
            pageNumber: 1,
            text: '后半段',
            start: 3,
            end: 6,
            sourceKey: 'source-key'
        })
        const resolver = new PdfPositionedTextSelectionResolver(root, source('前半段后半段'))
        const range = selectText(first.firstChild!, 0, second.firstChild!, 3)
        const selection = {
            type: 'Range',
            anchorNode: second.firstChild,
            anchorOffset: 3,
            focusNode: first.firstChild,
            focusOffset: 0,
            rangeCount: 1,
            getRangeAt: () => range,
            toString: () => '前半段后半段'
        } as unknown as Selection

        expect(resolver.resolve(selection)).toEqual(expect.objectContaining({
            text: '前半段后半段',
            range: { start: 0, end: 6 }
        }))
    })

    it('does not resolve stale source-keyed spans', () => {
        const root = document.createElement('div')
        const span = appendSpan(root, {
            id: 'stale',
            pageNumber: 1,
            text: '旧文本',
            start: 0,
            end: 3,
            sourceKey: 'old-source'
        })
        const resolver = new PdfPositionedTextSelectionResolver(root, source('新文本', 'new-source'))

        expect(resolver.resolve(selectText(span.firstChild!, 0, span.firstChild!, 3))).toBeNull()
    })
})
