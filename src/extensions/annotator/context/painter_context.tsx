import { useCallback, useMemo, useState } from 'react'
import type { Painter } from '../painter'
import React from 'react'
import { PainterContext } from './painter_context_value'
import type { PdfAnnotatorWriteIntent } from '../types/annotator'

export const PainterProvider: React.FC<{
    children: React.ReactNode
    requestWrite?: (intent: PdfAnnotatorWriteIntent) => Promise<boolean>
}> = ({ children, requestWrite }) => {
    const [painter, setPainter] = useState<Painter | null>(null)
    const [revision, setRevision] = useState(0)
    const refreshPainter = useCallback(() => setRevision(value => value + 1), [])
    const value = useMemo(
        () => ({ painter, setPainter, refreshPainter, revision, requestWrite }),
        [painter, refreshPainter, requestWrite, revision]
    )

    return (
        <PainterContext.Provider value={value}>
            {children}
        </PainterContext.Provider>
    )
}
