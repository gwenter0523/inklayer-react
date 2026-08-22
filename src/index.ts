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
  PdfPositionedTextRange,
  PdfPositionedTextBlock,
  PdfPositionedTextSpan,
  PdfPositionedTextPage,
  PdfPositionedTextSelection,
  PdfPositionedTextSelectionSegment,
  PdfPositionedTextSource,
} from './extensions/annotator/types/annotator';
export { PdfPositionedTextSelectionResolver } from './extensions/annotator/painter/pdf_positioned_text_selection';
export { PdfViewer } from './features/viewer';
export type { PdfViewerProps } from './features/viewer';
export type {
  IAnnotationStore,
  IAnnotationComment,
  IAnnotationReference,
} from './extensions/annotator/const/definitions';
export type {User, PdfBaseProps, PdfJsOptions} from './types';
