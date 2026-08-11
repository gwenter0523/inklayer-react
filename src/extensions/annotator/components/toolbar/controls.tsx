import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { ButtonProps, Flex, Separator } from '@radix-ui/themes'
import { ColorPicker } from '@/components/color_picker'
import { ToolbarButton } from '@/components/toolbar_button'
import { ZoomTool } from '@/components/zoom_tool'
import { usePainter } from '../../context/use_painter'
import { useOptionsContext } from '../../context/options_context'
import { useAnnotationStore } from '../../store'
import {
    annotationDefinitions,
    AnnotationType,
    IAnnotationType,
} from '../../const/definitions'
import { AuthorLabelsIcon, PaletteIcon } from '../../const/icons'
import { SignatureTool } from './signature'
import { StampTool } from './stamp'
import { useTranslation } from 'react-i18next'
import type {
    PdfAnnotatorControlPresentation,
    PdfAnnotatorToolControlProps,
    PdfAnnotatorToolName,
} from '../../types/annotator'

const TOOL_TO_ANNOTATION_TYPE: Record<PdfAnnotatorToolName, AnnotationType> = {
    select: AnnotationType.SELECT,
    rectangle: AnnotationType.RECTANGLE,
    circle: AnnotationType.CIRCLE,
    note: AnnotationType.NOTE,
    arrow: AnnotationType.ARROW,
    cloud: AnnotationType.CLOUD,
    freehand: AnnotationType.FREEHAND,
    freeHighlight: AnnotationType.FREE_HIGHLIGHT,
    freeText: AnnotationType.FREETEXT,
    signature: AnnotationType.SIGNATURE,
    stamp: AnnotationType.STAMP,
}

export function annotationTypeForTool(tool: PdfAnnotatorToolName): IAnnotationType {
    const annotation = annotationDefinitions.find((item) => item.type === TOOL_TO_ANNOTATION_TYPE[tool])
    if (!annotation) throw new Error(`UNKNOWN_ANNOTATION_TOOL:${tool}`)
    return annotation
}

export function annotationToolNameForType(type: AnnotationType | undefined): PdfAnnotatorToolName | null {
    if (type === undefined) return null
    const entry = (Object.entries(TOOL_TO_ANNOTATION_TYPE) as [PdfAnnotatorToolName, AnnotationType][])
        .find(([, annotationType]) => annotationType === type)
    return entry?.[0] ?? null
}

function presentationButtonProps(presentation: PdfAnnotatorControlPresentation): Partial<ButtonProps> {
    if (presentation !== 'menu-item') return {}
    return {
        variant: 'ghost',
        size: '2',
        style: { width: '100%', justifyContent: 'flex-start', gap: 8 },
    }
}

type AnnotationToolControlProps = PdfAnnotatorToolControlProps & {
    default_signatures?: string[]
    default_stamps?: string[]
}

export const AnnotationToolControl: React.FC<AnnotationToolControlProps> = ({
    tool,
    presentation = 'toolbar-icon',
    label,
    default_signatures,
    default_stamps,
}) => {
    const { t } = useTranslation(['annotator'], { useSuspense: false })
    const { painter } = usePainter()
    const currentAnnotationType = useAnnotationStore((state) => state.currentAnnotationType)
    const annotation = useMemo(() => annotationTypeForTool(tool), [tool])
    const canCreate = painter?.can('annotation.create') ?? false
    const selected = currentAnnotationType?.type === annotation.type
    const title = label ?? t(`annotator:tool.${annotation.name}`)
    const buttonProps = presentationButtonProps(presentation)

    const activate = useCallback((dataTransfer: string | null = null) => {
        const next = selected ? null : annotation
        painter?.activate(next, next && [AnnotationType.SIGNATURE, AnnotationType.STAMP].includes(next.type)
            ? dataTransfer
            : null)
    }, [annotation, painter, selected])

    if (tool === 'signature') {
        return (
            <SignatureTool
                annotation={annotation}
                disabled={!canCreate}
                selected={selected}
                presentation={presentation}
                label={title}
                default_signatures={default_signatures}
                onAdd={(dataUrl) => activate(dataUrl)}
            />
        )
    }

    if (tool === 'stamp') {
        return (
            <StampTool
                annotation={annotation}
                disabled={!canCreate}
                selected={selected}
                presentation={presentation}
                label={title}
                default_stamps={default_stamps}
                onAdd={(dataUrl) => activate(dataUrl)}
            />
        )
    }

    return (
        <ToolbarButton
            disabled={tool !== 'select' && !canCreate}
            selected={selected}
            tooltip={presentation === 'menu-item' ? 'none' : 'auto'}
            title={String(title)}
            label={presentation === 'menu-item' ? title : undefined}
            icon={annotation.icon}
            buttonProps={buttonProps}
            onClick={() => activate()}
        />
    )
}

export const AnnotationColorControl: React.FC<{
    presentation?: PdfAnnotatorControlPresentation
}> = ({ presentation = 'toolbar-icon' }) => {
    const { defaultOptions } = useOptionsContext()
    const { painter } = usePainter()
    const currentAnnotationType = useAnnotationStore((state) => state.currentAnnotationType)
    const isColorDisabled = !currentAnnotationType?.styleEditable?.color
    const buttonProps = presentationButtonProps(presentation)

    const handleColorChange = (color: string) => {
        if (!currentAnnotationType) return
        const updatedAnnotation = {
            ...currentAnnotationType,
            style: { ...currentAnnotationType.style, color },
        }
        painter?.activate(updatedAnnotation, null)
    }

    return (
        <ColorPicker
            value={currentAnnotationType?.style?.color || defaultOptions!.colors![0]}
            onChange={handleColorChange}
            presets={defaultOptions.colors!}
            popover
            trigger={(
                <ToolbarButton
                    disabled={isColorDisabled || !painter?.can('annotation.create')}
                    tooltip={presentation === 'menu-item' ? 'none' : 'auto'}
                    title="Color"
                    label={presentation === 'menu-item' ? 'Color' : undefined}
                    buttonProps={buttonProps}
                    icon={(
                        <PaletteIcon
                            style={{ '--palette-preview-color': currentAnnotationType?.style?.color } as React.CSSProperties}
                        />
                    )}
                />
            )}
        />
    )
}

export const AnnotationAuthorLabelsControl: React.FC<{
    presentation?: PdfAnnotatorControlPresentation
}> = ({ presentation = 'toolbar-icon' }) => {
    const { t } = useTranslation(['annotator'], { useSuspense: false })
    const { painter } = usePainter()
    const [visible, setVisible] = useState(false)
    const buttonProps = presentationButtonProps(presentation)

    useLayoutEffect(() => {
        setVisible(painter?.areAnnotationAuthorLabelsVisible() ?? false)
    }, [painter])

    return (
        <ToolbarButton
            disabled={!painter}
            selected={visible}
            tooltip={presentation === 'menu-item' ? 'none' : 'auto'}
            title={visible
                ? t('annotator:authorLabels.hide')
                : t('annotator:authorLabels.show', { shortcut: 'Alt' })}
            label={presentation === 'menu-item' ? '作者标签' : undefined}
            buttonProps={buttonProps}
            icon={<AuthorLabelsIcon />}
            onClick={() => {
                if (!painter) return
                const next = !painter.areAnnotationAuthorLabelsVisible()
                painter.setAnnotationAuthorLabelsVisible(next)
                setVisible(next)
            }}
        />
    )
}

export const AnnotationToolbarControls: React.FC<{
    defaultAnnotationName?: string
    stamps?: string[]
    signatures?: string[]
}> = ({ defaultAnnotationName = '', stamps, signatures }) => {
    const defaultAnnotation = defaultAnnotationName
        ? annotationDefinitions.find((item) => item.name === defaultAnnotationName) ?? null
        : null
    const { painter } = usePainter()

    React.useEffect(() => {
        if (!defaultAnnotation) return
        painter?.activate(defaultAnnotation, null)
        return () => {
            painter?.activate(null, null)
        }
    }, [defaultAnnotation, painter])

    return (
        <Flex gap="3" align="center">
            <ZoomTool />
            <Separator orientation="vertical" />
            <AnnotationToolControl tool="select" />
            {annotationDefinitions
                .filter((item) => item.webSelectionDependencies === false && item.type !== AnnotationType.SELECT)
                .map((item) => (
                    <AnnotationToolControl
                        key={item.name}
                        tool={item.name as PdfAnnotatorToolName}
                        default_stamps={item.type === AnnotationType.STAMP ? stamps : undefined}
                        default_signatures={item.type === AnnotationType.SIGNATURE ? signatures : undefined}
                    />
                ))}
            <Separator orientation="vertical" />
            <AnnotationColorControl />
            <Separator orientation="vertical" />
            <AnnotationAuthorLabelsControl />
        </Flex>
    )
}
