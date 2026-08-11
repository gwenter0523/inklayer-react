import React from 'react'
import { AnnotationToolbarControls } from './controls'

interface ToolbarProps {
    defaultAnnotationName: string
    stamps?: string[]
    signatures?: string[]
}

export const Toolbar: React.FC<ToolbarProps> = ({ defaultAnnotationName, stamps, signatures }) => (
    <AnnotationToolbarControls
        defaultAnnotationName={defaultAnnotationName}
        stamps={stamps}
        signatures={signatures}
    />
)
