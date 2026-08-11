import { AnnotationMutationHistory } from '../mutation_history'

describe('AnnotationMutationHistory', () => {
    it('moves one transaction between undo and redo and clears redo on a new mutation', () => {
        const history = new AnnotationMutationHistory()
        const events: string[] = []

        history.record({
            undo: () => {
                events.push('undo:first')
                return true
            },
            redo: () => {
                events.push('redo:first')
                return true
            }
        })

        expect(history.canUndo).toBe(true)
        expect(history.canRedo).toBe(false)
        expect(history.undo()).toBe(true)
        expect(history.canUndo).toBe(false)
        expect(history.canRedo).toBe(true)
        expect(history.redo()).toBe(true)
        expect(history.canUndo).toBe(true)
        expect(history.canRedo).toBe(false)

        expect(history.undo()).toBe(true)
        history.record({
            undo: () => true,
            redo: () => true
        })
        expect(history.canRedo).toBe(false)
        expect(events).toEqual(['undo:first', 'redo:first', 'undo:first'])
    })

    it('coalesces repeated transforms for one annotation into one transaction', () => {
        const history = new AnnotationMutationHistory()
        const events: string[] = []

        history.record({
            mergeKey: 'transform:annotation-1',
            undo: () => {
                events.push('undo:first')
                return true
            },
            redo: () => {
                events.push('redo:first')
                return true
            }
        })
        history.record({
            mergeKey: 'transform:annotation-1',
            undo: () => {
                events.push('undo:second')
                return true
            },
            redo: () => {
                events.push('redo:second')
                return true
            }
        })

        expect(history.undo()).toBe(true)
        expect(history.redo()).toBe(true)
        expect(events).toEqual(['undo:first', 'redo:second'])
    })

    it('keeps only the newest one hundred transactions and isolates instances', () => {
        const first = new AnnotationMutationHistory()
        const second = new AnnotationMutationHistory()
        for (let index = 0; index < 101; index += 1) {
            first.record({ undo: () => true, redo: () => true })
        }

        let count = 0
        while (first.undo()) count += 1
        expect(count).toBe(100)
        expect(second.canUndo).toBe(false)
    })
})
