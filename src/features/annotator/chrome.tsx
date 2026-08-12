import React, { useEffect } from 'react'
import { usePdfViewerContext } from '../../context/pdf_viewer_context'
import { PageZoomControl } from '../../components/page_zoom_control'
import { usePainter } from '../../extensions/annotator/context/use_painter'
import { useAnnotationStore } from '../../extensions/annotator/store'
import { AnnotationType } from '../../extensions/annotator/const/definitions'
import {
    AnnotationAuthorLabelsControl,
    AnnotationColorControl,
    AnnotationToolControl,
    annotationToolNameForType,
} from '../../extensions/annotator/components/toolbar/controls'
import { exportAnnotationsToExcel, exportAnnotationsToPdf } from '../../extensions/annotator/painter/annot'
import { annotationsToStores, storesToAnnotations } from '../../core/adapters/store.mapper'
import type {
    PdfAnnotatorChromeProps,
    PdfAnnotatorProps,
} from '../../extensions/annotator/types/annotator'

interface PdfAnnotatorChromeBridgeProps {
    Chrome: NonNullable<PdfAnnotatorProps['chrome']>
    onSave?: PdfAnnotatorProps['onSave']
    enableNativeAnnotations: boolean
    searchAvailable: boolean
}

const SEARCH_PANEL_KEY = 'search-sidebar'
const ANNOTATIONS_PANEL_KEY = 'annotator-sidebar-toggle'

export const PdfAnnotatorChromeBridge: React.FC<PdfAnnotatorChromeBridgeProps> = ({
    Chrome,
    onSave,
    enableNativeAnnotations,
    searchAvailable,
}) => {
    const { painter, requestWrite } = usePainter()
    const currentAnnotationType = useAnnotationStore((state) => state.currentAnnotationType)
    const {
        activeSidebarPanel,
        closeSidebar,
        openSidebar,
        isNavigationSidebarOpen,
        toggleNavigationSidebar,
        pdfViewer,
    } = usePdfViewerContext()
    const canCreate = painter?.can('annotation.create') ?? false
    const canRequestWrite = Boolean(requestWrite)

    useEffect(() => {
        // A requestable reader can still be in the short hand-off window between
        // the tool click and the writer becoming visible to the permission
        // controller. Clearing the tool here races that hand-off and makes every
        // drawing appear one-shot. Only fail closed when creation is unavailable
        // and there is no writer request path left.
        if (canCreate || canRequestWrite) return
        if (currentAnnotationType && currentAnnotationType.type !== AnnotationType.SELECT) {
            painter?.activate(null, null)
        }
    }, [canCreate, canRequestWrite, currentAnnotationType, painter])

    useEffect(() => () => {
        painter?.activate(null, null)
    }, [painter])

    const togglePanel = (key: string) => {
        if (activeSidebarPanel === key) closeSidebar()
        else openSidebar(key)
    }

    const actions: PdfAnnotatorChromeProps['actions'] = {
        save: () => {
            if (painter) onSave?.(storesToAnnotations(painter.getData()))
        },
        getAnnotations: () => storesToAnnotations(painter?.getData() ?? []),
        replaceAnnotations: async (annotations) => {
            if (painter) await painter.replaceAnnotations(annotationsToStores(annotations), enableNativeAnnotations)
        },
        exportToExcel: (fileName) => {
            if (painter && pdfViewer) void exportAnnotationsToExcel(pdfViewer, painter.getData(), fileName)
        },
        exportToPdf: (fileName) => {
            if (painter && pdfViewer) void exportAnnotationsToPdf(pdfViewer, painter.getData(), fileName)
        },
    }

    return (
        <Chrome
            activeTool={annotationToolNameForType(currentAnnotationType?.type)}
            canCreate={canCreate}
            canRequestWrite={canRequestWrite}
            ToolControl={AnnotationToolControl}
            ColorControl={AnnotationColorControl}
            AuthorLabelsControl={AnnotationAuthorLabelsControl}
            PageZoomControl={PageZoomControl}
            history={painter?.getHistory()}
            panels={{
                navigation: {
                    open: isNavigationSidebarOpen,
                    toggle: toggleNavigationSidebar,
                },
                search: {
                    open: activeSidebarPanel === SEARCH_PANEL_KEY,
                    available: searchAvailable,
                    toggle: () => togglePanel(SEARCH_PANEL_KEY),
                },
                annotations: {
                    open: activeSidebarPanel === ANNOTATIONS_PANEL_KEY,
                    toggle: () => togglePanel(ANNOTATIONS_PANEL_KEY),
                },
            }}
            actions={actions}
        />
    )
}
