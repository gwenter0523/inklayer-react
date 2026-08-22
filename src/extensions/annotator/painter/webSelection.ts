import Highlighter from 'web-highlighter'
import type {
    PdfPositionedTextSelection,
    PdfPositionedTextSource
} from '../types/annotator'
import { PdfPositionedTextSelectionResolver } from './pdf_positioned_text_selection'

interface HighlightCreatedEvent {
    sources: Array<{ id: string }>
}

/**
 * WebSelection 类用于处理网页选区的实用工具类。
 */
export class WebSelection {
    isEditing: boolean // 指示是否启用编辑模式
    onSelect: (range: Range | null) => void // 当选区被选中时调用的回调函数
    onHighlight: (
        selection: Partial<Record<string, HTMLElement[]>>,
        logicalSelection?: PdfPositionedTextSelection
    ) => void
    highlighterObj: null | Highlighter
    private root: HTMLDivElement | null = null
    private isSelecting = false
    private activeRange: Range | null = null
    private positionedTextSource?: PdfPositionedTextSource
    private positionedTextResolver: PdfPositionedTextSelectionResolver | null = null

    private readonly handleSelectionChange = () => {
        const selection = window.getSelection()
        if (selection?.type === 'Caret' || selection?.anchorNode === null) {
            this.isSelecting = false
            this.activeRange = null
            this.onSelect(null)
            return
        }
        if (selection && selection.toString()) {
            const range = selection.getRangeAt(0)
            const selectedElement = range.commonAncestorContainer
            if (this.root?.contains(selectedElement)) {
                this.isSelecting = true
                return
            }
        }

        this.isSelecting = false
        this.activeRange = null
        this.onSelect(null)
    }

    private readonly handleSelectionEnd = () => {
        if (!this.isSelecting) return

        this.isSelecting = false
        const selection = window.getSelection()
        const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null
        if (range && this.root?.contains(range.commonAncestorContainer)) {
            this.activeRange = range
            this.onSelect(range)
        } else {
            this.activeRange = null
            this.onSelect(null)
        }
    }

    private readonly handleCopy = (event: ClipboardEvent) => {
        const resolver = this.positionedTextResolver
        const selection = window.getSelection()
        const resolved = resolver?.resolve(selection ?? null)
        if (!resolved || !event.clipboardData) return

        event.clipboardData.setData('text/plain', resolved.text)
        event.preventDefault()
    }

    private readonly handleHighlightCreated = (data: HighlightCreatedEvent) => {
        const highlighter = this.highlighterObj
        if (!highlighter) return

        const allSourcesSpan = data.sources.flatMap((source) => highlighter.getDoms(source.id))
        const pageSelection = allSourcesSpan.reduce<Record<string, HTMLElement[]>>((acc, span) => {
            // Resolve the provider-owned page marker before falling back to
            // PDF.js's native page wrapper.
            const page = span.closest('[data-inklayer-positioned-text-page]')?.getAttribute('data-inklayer-positioned-text-page')
                ?? span.closest('.page')?.getAttribute('data-page-number')
                ?? '-1'
            ;(acc[page] ||= []).push(span)
            return acc
        }, {})

        const logicalSelection = this.activeRange
            ? this.positionedTextResolver?.resolve(this.activeRange) ?? undefined
            : undefined
        if (logicalSelection) {
            this.onHighlight(pageSelection, logicalSelection)
        } else {
            this.onHighlight(pageSelection)
        }
        highlighter.removeAll()
        window.getSelection()?.removeAllRanges()
    }

    /**
     * 构造一个新的 WebSelection 实例。
     * @param onSelect 当选区被选中时调用的回调函数
     */
    constructor({
        onSelect,
        onHighlight,
        positionedTextSource
    }: {
        onSelect: (range: Range | null) => void
        onHighlight: (
            selection: Partial<Record<string, HTMLElement[]>>,
            logicalSelection?: PdfPositionedTextSelection
        ) => void
        positionedTextSource?: PdfPositionedTextSource
    }) {
        this.isEditing = false
        this.onSelect = onSelect
        this.onHighlight = onHighlight
        this.positionedTextSource = positionedTextSource
        this.highlighterObj = null
    }

    /**
     * 在指定的根元素和页码上创建一个高亮器。
     * @param root 要应用高亮器的根元素
     */
    public create(root: HTMLDivElement) {
        this.destroy()
        this.root = root
        this.positionedTextResolver = this.positionedTextSource
            ? new PdfPositionedTextSelectionResolver(root, this.positionedTextSource)
            : null

        this.highlighterObj = new Highlighter({
            $root: root,
            wrapTag: 'mark'
        })
        this.highlighterObj.stop()
        document.addEventListener('selectionchange', this.handleSelectionChange)
        document.addEventListener('mouseup', this.handleSelectionEnd)
        document.addEventListener('touchend', this.handleSelectionEnd)
        root.addEventListener('copy', this.handleCopy, true)
        this.highlighterObj.on('selection:create', this.handleHighlightCreated)
    }

    public setPositionedTextSource(source?: PdfPositionedTextSource): void {
        this.positionedTextSource = source
        this.positionedTextResolver = this.root && source
            ? new PdfPositionedTextSelectionResolver(this.root, source)
            : null
        this.activeRange = null
        this.onSelect(null)
    }

    public highlight(range: Range | null) {
        this.activeRange = range
        if (range) {
            this.highlighterObj?.fromRange(range)
        }
    }

    public isRangeSelectionActive(): boolean {
        return this.isSelecting
    }

    public destroy() {
        document.removeEventListener('selectionchange', this.handleSelectionChange)
        document.removeEventListener('mouseup', this.handleSelectionEnd)
        document.removeEventListener('touchend', this.handleSelectionEnd)
        this.root?.removeEventListener('copy', this.handleCopy, true)

        if (this.highlighterObj) {
            this.highlighterObj.off('selection:create', this.handleHighlightCreated)
            this.highlighterObj.dispose()
            this.highlighterObj = null
        }

        this.root = null
        this.isSelecting = false
        this.activeRange = null
        this.positionedTextResolver = null
    }
}
