import type {
    PdfPositionedTextSelection,
    PdfPositionedTextSelectionSegment,
    PdfPositionedTextSource,
    PdfPositionedTextRange
} from '../types/annotator'

const POSITIONED_TEXT_SELECTOR = '[data-inklayer-positioned-text-id]'

/**
 * Resolves a browser DOM selection against a provider-owned logical source.
 *
 * The resolver deliberately does not infer whitespace, paragraphs, tables, or
 * reading order. The host supplies the authoritative logical text and each
 * positioned span's UTF-16 range; this class only maps DOM boundaries to that
 * source range.
 */
export class PdfPositionedTextSelectionResolver {
    private readonly root: HTMLElement
    private source: PdfPositionedTextSource

    public constructor(root: HTMLElement, source: PdfPositionedTextSource) {
        this.root = root
        this.source = source
    }

    public setSource(source: PdfPositionedTextSource): void {
        this.source = source
    }

    public resolve(selectionOrRange: Selection | Range | null): PdfPositionedTextSelection | null {
        const logicalText = this.source.logicalText
        const sourceKey = this.source.sourceKey
        if (!logicalText || !sourceKey || !selectionOrRange) return null

        const range = selectionOrRange instanceof Range
            ? selectionOrRange
            : selectionOrRange.rangeCount > 0
                ? selectionOrRange.getRangeAt(0)
                : null
        if (!range || range.collapsed || !this.root.contains(range.commonAncestorContainer)) return null

        const spans = this.positionedSpansInRange(range, sourceKey)
        if (spans.length === 0) return null

        const startSpan = findPositionedSpan(range.startContainer, sourceKey)
        const endSpan = findPositionedSpan(range.endContainer, sourceKey)
        if (!startSpan || !endSpan) return null

        const startRange = readLogicalRange(startSpan)
        const endRange = readLogicalRange(endSpan)
        if (!startRange || !endRange) return null

        const startOffset = offsetWithinSpan(startSpan, range.startContainer, range.startOffset)
        const endOffset = offsetWithinSpan(endSpan, range.endContainer, range.endOffset)
        if (startOffset === null || endOffset === null) return null

        const start = startRange.start + startOffset
        const end = endRange.start + endOffset
        const safeRange = normalizeRange({ start, end }, logicalText.length)
        if (!safeRange || safeRange.start === safeRange.end) return null

        const segments = spans.flatMap((span): PdfPositionedTextSelectionSegment[] => {
            const spanRange = readLogicalRange(span)
            if (!spanRange) return []
            const segmentStart = Math.max(safeRange.start, spanRange.start)
            const segmentEnd = Math.min(safeRange.end, spanRange.end)
            if (segmentStart >= segmentEnd) return []
            const pageNumber = Number(
                span.dataset.inklayerPositionedTextPage
                    ?? span.closest('[data-inklayer-positioned-text-page]')?.getAttribute('data-inklayer-positioned-text-page')
            )
            if (!Number.isSafeInteger(pageNumber) || pageNumber < 1) return []
            return [{
                id: span.dataset.inklayerPositionedTextId || '',
                pageNumber,
                range: { start: segmentStart, end: segmentEnd },
                blockId: span.dataset.inklayerPositionedTextBlockId || undefined,
                spanId: span.dataset.inklayerPositionedTextSpanId || undefined
            }]
        })

        return {
            sourceKey,
            text: logicalText.slice(safeRange.start, safeRange.end),
            range: safeRange,
            segments
        }
    }

    private positionedSpansInRange(range: Range, sourceKey: string): HTMLElement[] {
        const spans = Array.from(this.root.querySelectorAll<HTMLElement>(POSITIONED_TEXT_SELECTOR))
            .filter((span) => {
                if (span.dataset.inklayerPositionedTextSourceKey !== sourceKey) return false
                const logicalRange = readLogicalRange(span)
                if (!logicalRange) return false
                try {
                    return range.intersectsNode(span)
                } catch {
                    return false
                }
            })

        const startSpan = findPositionedSpan(range.startContainer, sourceKey)
        const endSpan = findPositionedSpan(range.endContainer, sourceKey)
        if (startSpan && !spans.includes(startSpan)) spans.push(startSpan)
        if (endSpan && !spans.includes(endSpan)) spans.push(endSpan)
        return spans.sort(compareDocumentOrder)
    }
}

function findPositionedSpan(node: Node | null, sourceKey: string): HTMLElement | null {
    let element: Element | null = node instanceof Element ? node : node?.parentElement ?? null
    while (element) {
        if (
            element instanceof HTMLElement
            && element.matches(POSITIONED_TEXT_SELECTOR)
            && element.dataset.inklayerPositionedTextSourceKey === sourceKey
        ) {
            return element
        }
        element = element.parentElement
    }
    return null
}

function readLogicalRange(element: HTMLElement): PdfPositionedTextRange | null {
    const start = Number(element.dataset.inklayerPositionedTextLogicalStart)
    const end = Number(element.dataset.inklayerPositionedTextLogicalEnd)
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end <= start) return null
    return { start, end }
}

function offsetWithinSpan(span: HTMLElement, node: Node, offset: number): number | null {
    if (!span.contains(node) && span !== node) return null
    try {
        const prefix = document.createRange()
        prefix.selectNodeContents(span)
        prefix.setEnd(node, offset)
        return prefix.toString().length
    } catch {
        return null
    }
}

function normalizeRange(range: PdfPositionedTextRange, length: number): PdfPositionedTextRange | null {
    const start = Math.max(0, Math.min(range.start, length))
    const end = Math.max(0, Math.min(range.end, length))
    if (start === end) return null
    return start < end ? { start, end } : { start: end, end: start }
}

function compareDocumentOrder(left: Node, right: Node): number {
    if (left === right) return 0
    const position = left.compareDocumentPosition(right)
    return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
}
