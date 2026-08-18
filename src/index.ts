import '@radix-ui/themes/styles.css'
import './extensions/annotator/painter/index.scss';

export { PdfAnnotator } from './features/annotator';
export type {
  PdfAnnotatorProps,
  PdfAnnotatorOptions,
  PdfAnnotatorChromeProps,
  PdfAnnotatorToolName,
  PdfAnnotatorToolControlProps,
  PdfAnnotatorControlPresentation,
  PdfAnnotatorHistoryControl,
  AnnotationPermissionAction,
  AnnotationPermissionMode,
  AnnotationPermissionRequest,
  AnnotationPermissions,
  PdfAnnotatorWriteIntent,
  PdfPositionedTextGeometry,
  PdfPositionedTextPoint,
  PdfPositionedTextBlock,
  PdfPositionedTextSpan,
  PdfPositionedTextPage,
  PdfPositionedTextSource,
} from './extensions/annotator/types/annotator';
export { PdfViewer } from './features/viewer';
export type { PdfViewerProps } from './features/viewer';
export type {
  IAnnotationStore,
  IAnnotationComment,
  IAnnotationReference,
} from './extensions/annotator/const/definitions';
export type {User, PdfBaseProps, PdfJsOptions} from './types';
