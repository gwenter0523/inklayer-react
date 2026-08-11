import { createContext } from 'react'
import type { Painter } from '../painter'
import type { PdfAnnotatorWriteIntent } from '../types/annotator'

export interface PainterContextValue {
    painter: Painter | null
    setPainter: (painter: Painter | null) => void
    refreshPainter: () => void
    revision: number
    requestWrite?: (intent: PdfAnnotatorWriteIntent) => Promise<boolean>
}

export const PainterContext = createContext<PainterContextValue | undefined>(undefined)
