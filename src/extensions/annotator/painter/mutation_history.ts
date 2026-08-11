export interface AnnotationHistoryTransaction {
    mergeKey?: string
    undo: () => boolean
    redo: () => boolean
}

type StoredTransaction = AnnotationHistoryTransaction & {
    id: number
}

export type AnnotationHistoryListener = () => void

export class AnnotationMutationHistory {
    private readonly limit: number
    private undoStack: StoredTransaction[] = []
    private redoStack: StoredTransaction[] = []
    private listeners = new Set<AnnotationHistoryListener>()
    private nextId = 1

    public constructor(limit = 100) {
        this.limit = Math.max(1, Math.floor(limit))
    }

    public get canUndo(): boolean {
        return this.undoStack.length > 0
    }

    public get canRedo(): boolean {
        return this.redoStack.length > 0
    }

    public subscribe(listener: AnnotationHistoryListener): () => void {
        this.listeners.add(listener)
        return () => this.listeners.delete(listener)
    }

    public record(transaction: AnnotationHistoryTransaction): number {
        const previous = this.undoStack[this.undoStack.length - 1]
        if (transaction.mergeKey && previous?.mergeKey === transaction.mergeKey) {
            previous.redo = transaction.redo
        } else {
            this.undoStack.push({ ...transaction, id: this.nextId })
            this.nextId += 1
            if (this.undoStack.length > this.limit) this.undoStack.shift()
        }
        this.redoStack = []
        this.emit()
        return this.undoStack[this.undoStack.length - 1]?.id ?? this.nextId - 1
    }

    public undo(): boolean {
        const transaction = this.undoStack.pop()
        if (!transaction) return false
        if (!transaction.undo()) {
            this.undoStack.push(transaction)
            return false
        }
        this.redoStack.push(transaction)
        this.emit()
        return true
    }

    public redo(): boolean {
        const transaction = this.redoStack.pop()
        if (!transaction) return false
        if (!transaction.redo()) {
            this.redoStack.push(transaction)
            return false
        }
        this.undoStack.push(transaction)
        this.emit()
        return true
    }

    public undoEntry(id: number): boolean {
        const index = this.undoStack.findIndex((transaction) => transaction.id === id)
        if (index < 0) return false
        const [transaction] = this.undoStack.splice(index, 1)
        if (!transaction.undo()) {
            this.undoStack.splice(index, 0, transaction)
            return false
        }
        this.redoStack.push(transaction)
        this.emit()
        return true
    }

    public clear(): void {
        if (!this.canUndo && !this.canRedo) return
        this.undoStack = []
        this.redoStack = []
        this.emit()
    }

    private emit(): void {
        this.listeners.forEach((listener) => listener())
    }
}
