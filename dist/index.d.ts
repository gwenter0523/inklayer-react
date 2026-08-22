import { default as default_2 } from 'react';
import { EventBus } from 'pdfjs-dist/types/web/pdf_viewer';
import { IRect } from 'konva/lib/types';
import { PDFDocumentProxy } from 'pdfjs-dist/types/web/pdf_viewer';
import { PDFViewer } from 'pdfjs-dist/types/web/pdf_viewer';

/** 批注（Annotation）
 *
 * 这是 InkLayer 的核心模型，是持久化存储的唯一事实来源。
 *
 * 数据流：
 * - 写入：Konva Node → Adapter.extract() → Annotation → Storage
 * - 读取：Storage → Annotation → Adapter.render() → Konva Node → Canvas
 *
 * 约束：
 * - ❌ 禁止在此对象中出现 konva / canvas / viewport 字段
 * - ❌ 禁止序列化 Konva Node 状态
 * - ✅ 所有几何必须基于 PDF 用户空间
 * - ✅ 所有字段都是可选的，便于渐进增强
 */
declare interface Annotation {
    /** 全局唯一标识符
     *
     * 要求：
     * - 稳定：创建后不应改变
     * - 唯一：跨文档/跨会话唯一
     * - 建议使用 UUID / ULID
     */
    id: string;
    /** 高层语义类型
     *
     * 这是产品分类，不是 PDF subtype
     * PDF Subtype → AnnotationKind 的映射由 Adapter 处理
     */
    kind: AnnotationKind;
    /** 批注锚点（位置） */
    target: AnnotationTarget;
    /** 语义内容（是什么）
     *
     * 表达批注的业务含义，不包含渲染细节
     * 例如：文本批注的文本内容、印章的名称
     */
    payload?: AnnotationPayload;
    /** 外观提示（怎么画）
     *
     * 这是渲染提示，不是语义
     * 不同渲染器可能有不同解释
     */
    appearance?: AnnotationAppearance;
    /** 批注关系（关联）
     *
     * 用于：回复链、Popup 关联、引用关系
     */
    relations?: AnnotationRelations;
    /** 元信息（生命周期）
     *
     * 不影响渲染，不参与导出计算
     * 但对协作、审计、版本控制很重要
     */
    meta?: AnnotationMeta;
    /** 扩展点
     *
     * 用于：
     * - Adapter 私有数据（如 PDF.js 具体类型）
     * - 业务扩展（如 AI 分析结果）
     * - 调试信息
     *
     * 约束：
     * - 不能影响 Core 的序列化和兼容性
     * - 不能作为业务逻辑的唯一依赖
     */
    extensions?: Record<string, unknown>;
}

/** 批注外观 */
declare interface AnnotationAppearance {
    /** 描边颜色 */
    strokeColor?: string;
    /** 填充颜色 */
    fillColor?: string;
    /** 描边粗细（pt） */
    strokeWidth?: number;
    /** 透明度（0-1） */
    opacity?: number;
    /** 虚线样式 */
    dashArray?: number[];
    /** 文字大小（用于 note / text-markup） */
    fontSize?: number;
    /** 文字字体 */
    fontFamily?: string;
    /** 文字对齐 */
    textAlign?: 'left' | 'center' | 'right';
    /** 渲染顺序（图层） */
    zIndex?: number;
}

/** 批注类型（产品语义）
 *
 * 注意：这是 InkLayer 的语义分类，不是 PDF 的 Subtype
 * PDF Subtype → InkLayer Kind 的映射由 Adapter 处理
 */
declare type AnnotationKind = 'text-markup' | 'note' | 'ink' | 'shape' | 'line' | 'stamp' | 'file';

/** 批注元信息 */
declare interface AnnotationMeta {
    /** Stable, document-scoped display number used by annotation references. */
    referenceNumber?: number;
    /** 创建时间（ISO 8601） */
    createdAt?: string;
    /** 更新时间（ISO 8601） */
    updatedAt?: string;
    /** 作者标识
     *
     * 可用形式：
     * - 字符串 ID：'user-123'
     * - 完整对象：{ id: 'user-123', name: 'Alice', avatarUrl: '...' }
     */
    authorId?: string | {
        id: string;
        name?: string;
        avatarUrl?: string;
    };
    /** 是否来自 PDF 原生批注
     *
     * true: 从 PDF 文件中加载的原生批注
     * false: InkLayer 创建的新批注
     */
    isNative?: boolean;
    /** 来源系统
     *
     * - 'inklayer': InkLayer 创建
     * - 'pdfjs': 从 PDF.js 导入
     * - 'import': 从外部导入
     */
    source?: 'inklayer' | 'pdfjs' | 'import';
    /** 版本号（用于协作冲突处理） */
    version?: number;
}

/** 批注内容联合类型 */
declare type AnnotationPayload = TextMarkupPayload | NotePayload | InkPayload | ShapePayload | LinePayload | StampPayload | FilePayload;

export declare type AnnotationPermissionAction = 'annotation.create' | 'annotation.transform' | 'annotation.edit' | 'annotation.delete' | 'annotation.comment' | 'annotation.change-status' | 'comment.edit' | 'comment.delete';

export declare type AnnotationPermissionMode = 'unrestricted' | 'owner-only';

export declare interface AnnotationPermissionRequest {
    action: AnnotationPermissionAction;
    currentUser: User | null;
    annotation?: Readonly<Annotation>;
    comment?: Readonly<IAnnotationComment>;
    /** Result calculated by the configured permission mode. */
    defaultAllowed: boolean;
}

export declare interface AnnotationPermissions {
    /** @default 'unrestricted' */
    mode?: AnnotationPermissionMode;
    /**
     * Synchronously overrides the configured mode. Return undefined to keep
     * the default decision.
     */
    can?: (request: AnnotationPermissionRequest) => boolean | undefined;
}

/** 批注关系 */
declare interface AnnotationRelations {
    /** 父批注 ID（如回复的父批注） */
    parentId?: string;
    /** 直接回复列表 */
    replies?: string[];
    /** Popup 所属批注（用于 Note 的 Popup 关联） */
    popupFor?: string;
    /** 关联/引用批注 */
    linkedAnnotationIds?: string[];
}

/** 批注锚点
 *
 * 定义批注在哪个文档的哪一页的什么位置
 */
declare interface AnnotationTarget {
    /** PDF 页索引（从 0 开始）
     *
     * 注意：这是 PDF 逻辑页顺序，与打印页码、Viewer 显示页码可能不同
     */
    pageIndex: number;
    /** 几何信息（PDF 用户空间坐标） */
    geometry: Geometry;
    /** 坐标系标识，当前固定为此值
     *
     * 约束：所有几何必须基于 PDF User Space
     * 未来可能扩展：'viewport'（屏幕坐标）
     */
    coordinateSystem: 'pdf-user-space';
    /** 可选文档标识
     *
     * 用于跨文档系统（如文档管理平台）
     * InkLayer Core 不强制要求，由应用层决定
     */
    documentId?: string;
}

declare enum AnnotationType {
    NONE = -1,// 没有批注类型
    SELECT = 0,// 选择批注
    HIGHLIGHT = 1,// 高亮批注
    STRIKEOUT = 2,// 删除线批注
    UNDERLINE = 3,// 下划线批注
    FREETEXT = 4,// 自由文本批注
    RECTANGLE = 5,// 矩形批注
    CIRCLE = 6,// 圆形批注
    FREEHAND = 7,// 自由绘制批注
    FREE_HIGHLIGHT = 8,// 自由高亮批注
    SIGNATURE = 9,// 签名批注
    STAMP = 10,// 盖章批注
    NOTE = 11,// 注释
    ARROW = 12,// 箭头批注
    CLOUD = 13
}

declare enum CommentStatus {
    Accepted = "Accepted",
    Rejected = "Rejected",
    Cancelled = "Cancelled",
    Completed = "Completed",
    None = "None",
    Closed = "Closed"
}

declare type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? (T[K] extends (...args: never[]) => unknown ? T[K] : DeepPartial<T[K]>) : T[K];
};

/** 文件附件（File Attachment）
 *
 * PDF 原生类型：FileAttachment
 */
declare interface FilePayload {
    kind: 'file';
    /** 文件名 */
    fileName: string;
    /** 文件 URL 或路径 */
    fileUrl: string;
    /** 文件大小（字节） */
    size?: number;
    /** MIME 类型 */
    mimeType?: string;
}

/** 批注几何类型联合 */
declare type Geometry = RectGeometry | QuadGeometry | PathGeometry | LineGeometry | PolyGeometry;

export declare interface IAnnotationComment {
    id: string;
    title: string;
    date: string | null;
    content: string;
    status?: CommentStatus;
    /** Stable author identity used by collaboration permissions. */
    user?: User;
    /** Structured annotation references contained in `content`. */
    references?: IAnnotationReference[];
}

declare interface IAnnotationContentsObj {
    text: string;
    /** Source text covered by a text-markup annotation. */
    selectedText?: string;
    image?: string;
    /** Structured annotation references contained in `text`. */
    references?: IAnnotationReference[];
}

/**
 * A stable annotation target stored beside the readable #N text.
 * `annotationId` drives navigation; `label` only identifies the text token.
 */
export declare interface IAnnotationReference {
    type: 'annotation';
    annotationId: string;
    label: string;
}

export declare interface IAnnotationStore {
    id: string;
    /** Stable, document-scoped display number used by annotation references. */
    referenceNumber?: number;
    pageNumber: number;
    konvaString: string;
    konvaClientRect: IRect;
    title: string;
    type: AnnotationType;
    color?: string | null;
    subtype: PdfjsAnnotationSubtype;
    pdfjsType: PdfjsAnnotationType;
    date: string | null;
    contentsObj?: IAnnotationContentsObj | null;
    comments: IAnnotationComment[];
    user: User;
    native: boolean;
}

/** 自由手绘（Ink）
 *
 * PDF 原生类型：Ink
 */
declare interface InkPayload {
    kind: 'ink';
    /** 笔画颜色 */
    color?: string;
    /** 笔画粗细（pt） */
    width?: number;
}

/** 直线/箭头几何
 *
 * 适用场景：直线、箭头、测量线
 *
 * @property start - 起点
 * @property end - 终点
 */
declare interface LineGeometry {
    type: 'line';
    start: PdfPoint;
    end: PdfPoint;
}

/** 直线/箭头（Line）
 *
 * PDF 原生类型：Line
 */
declare interface LinePayload {
    kind: 'line';
    /** 起点是否有箭头 */
    arrowStart?: boolean;
    /** 终点是否有箭头 */
    arrowEnd?: boolean;
}

/** 文本批注（Note / Popup）
 *
 * PDF 原生类型：FreeText, Popup
 */
declare interface NotePayload {
    kind: 'note';
    /** 批注内容文本 */
    text: string;
}

/** 路径几何（自由绘制）
 *
 * 适用场景：自由手绘（Ink）、云线、任意形状
 *
 * @property points - 路径点序列
 * @property closed - 是否闭合路径（默认 false）
 */
declare interface PathGeometry {
    type: 'path';
    /** 路径点序列 */
    points: PdfPoint[];
    /** 是否闭合，默认 false */
    closed?: boolean;
}

export declare const PdfAnnotator: default_2.FC<PdfAnnotatorProps>;

export declare interface PdfAnnotatorChromeProps {
    activeTool: PdfAnnotatorToolName | null;
    canCreate: boolean;
    canRequestWrite?: boolean;
    ToolControl: default_2.ComponentType<PdfAnnotatorToolControlProps>;
    ColorControl: default_2.ComponentType<{
        presentation?: PdfAnnotatorControlPresentation;
    }>;
    AuthorLabelsControl: default_2.ComponentType<{
        presentation?: PdfAnnotatorControlPresentation;
    }>;
    PageZoomControl: default_2.ComponentType;
    history?: PdfAnnotatorHistoryControl;
    panels: {
        navigation: {
            open: boolean;
            toggle(): void;
        };
        search: {
            open: boolean;
            available: boolean;
            toggle(): void;
        };
        annotations: {
            open: boolean;
            toggle(): void;
        };
    };
    actions: {
        save(): void;
        getAnnotations(): Annotation[];
        replaceAnnotations?(annotations: Annotation[]): Promise<void>;
        exportToExcel(fileName?: string): void;
        exportToPdf(fileName?: string): void;
    };
}

export declare type PdfAnnotatorControlPresentation = 'toolbar-icon' | 'menu-item';

export declare interface PdfAnnotatorHistoryControl {
    readonly canUndo: boolean;
    readonly canRedo: boolean;
    undo(): boolean;
    redo(): boolean;
    subscribe(listener: () => void): () => void;
}

/**
 * PDF 注解器配置选项 / PDF Annotator Configuration Options
 * 定义PDF注解器的所有可配置参数 / Defines all configurable parameters for the PDF annotator
 */
export declare type PdfAnnotatorOptions = {
    /**
     * 颜色选项 / Color options
     * 用户在注解工具中可以选择的颜色列表 / List of colors users can select in annotation tools
     * @default: ['#ff0000', '#ffbe00', '#ffff00', '#83d33c', '#00b445', '#00b2f4', '#1677ff', '#001f63', '#7828a4', '#ff00ff']
     */
    colors?: string[];
    /**
     * 签名配置 / Signature configuration
     * 控制签名功能的相关设置 / Settings that control signature functionality
     */
    signature?: {
        /**
         * 签名颜色选项 / Signature color options
         * 签名工具可用的颜色 / Colors available for the signature tool
         * @default: ['#000000', '#ff0000', '#1677ff']
         */
        colors?: string[];
        /**
         * 默认签名类型 / Default signature type
         * Draw: 手绘签名 / Draw: Hand-drawn signature
         * Enter: 键入签名 / Enter: Typed signature
         * Upload: 上传签名 / Upload: Uploaded signature
         * @default: 'Draw'
         */
        type?: 'Draw' | 'Enter' | 'Upload';
        /**
         * 最大文件大小 / Maximum file size
         * 允许上传的签名文件最大字节数 / Maximum bytes allowed for uploaded signature files
         * @default: 1024 * 1024 * 5 (5MB)
         */
        maxSize?: number;
        /**
         * 接受的文件类型 / Accepted file types
         * 签名上传功能接受的文件扩展名 / File extensions accepted by the signature upload feature
         * @default: '.png,.jpg,.jpeg,.bmp'
         */
        accept?: string;
        /**
         * 默认的签名图片 base64 string / Default signature
         * @default: []
         */
        defaultSignature?: string[];
        /**
         * 手写字体列表 / Handwriting font list
         * 特殊的手写字体选项 / Special handwriting font options
         * @example [
         {
         label: '楷体',
         value: 'STKaiti',
         external: false,
         },{
         label: 'font name',
         value: 'font value',
         external: true,
         url: 'font url'
         },
         {
         label: '平方长安体',
         value: 'PingFangChangAnTi-2',
         external: true,
         url: PingFangChangAnTiFont import url
         }
         ]
         * @default: []
         */
        defaultFont?: {
            /**
             * 字体显示名称 / Font display name
             */
            label: string;
            /**
             * 实际CSS字体值 / Actual CSS font value
             */
            value: string;
            /**
             * 是否为外部字体 / Whether it's an external font
             * 如果为true，则从url加载字体 / If true, font is loaded from the url
             */
            external: boolean;
            /**
             * 字体文件URL / Font file URL
             * 外部字体文件的位置 / Location of the external font file
             */
            url?: string;
        }[];
    };
    /**
     * 盖章配置 / Stamp configuration
     * 控制盖章功能的相关设置 / Settings that control stamp functionality
     */
    stamp?: {
        /**
         * 最大文件大小 / Maximum file size
         * 允许上传的印章文件最大字节数 / Maximum bytes allowed for uploaded stamp files
         * @default: 1024 * 1024 * 5 (5MB)
         */
        maxSize?: number;
        /**
         * 接受的文件类型 / Accepted file types
         * 盖章上传功能接受的文件扩展名 / File extensions accepted by the stamp upload feature
         * @default: '.png,.jpg,.jpeg,.bmp'
         */
        accept?: string;
        /**
         * 默认印章 base64 string / Default stamp
         * @default: []
         */
        defaultStamp?: string[];
        /**
         * 印章编辑器配置 / Stamp editor configuration
         * 控制印章编辑器外观的设置 / Settings controlling the appearance of the stamp editor
         */
        editor?: {
            /**
             * 默认背景颜色 / Default background color
             * 印章的默认背景颜色 / Default background color for stamps
             * @default: #00b445
             */
            defaultBackgroundColor?: string;
            /**
             * 默认边框颜色 / Default border color
             * 印章的默认边框颜色 / Default border color for stamps
             * @default: ''
             */
            defaultBorderColor?: string;
            defaultBorderStyle?: 'none' | 'solid' | 'dashed';
            /**
             * 默认文字颜色 / Default text color
             * 印章文字的默认颜色 / Default color for stamp text
             * @default: '#fff'
             */
            defaultTextColor?: string;
            /**
             * 默认字体列表 / Default font
             * 提供的默认字体选项，包含标签和实际CSS字体值 / Provided default font options with labels and actual CSS font values
             * @default [
             { label: 'Arial', value: 'Arial' },
             { label: 'Times New Roman', value: 'Times New Roman' },
             { label: 'Georgia', value: 'Georgia' },
             { label: 'Verdana', value: 'Verdana' },
             { label: 'Tahoma', value: 'Tahoma, Geneva, sans-serif' },
             { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
             { label: 'Courier New', value: '"Courier New", Courier, monospace' },
             { label: 'Lucida Console', value: '"Lucida Console", Monaco, monospace' },
             { label: '宋体', value: 'SimSun, Songti SC, STSong, 宋体, "Noto Serif SC", serif' },
             { label: '黑体', value: 'Microsoft YaHei, PingFang SC, Heiti SC, SimHei, 黑体, sans-serif' },
             { label: '楷体', value: 'KaiTi, KaiTi_GB2312, STFangsong, 楷体, "AR PL UKai CN", serif' }
             ]
             */
            defaultFont?: {
                /**
                 * 字体显示名称 / Font display name
                 */
                label: string;
                /**
                 * 实际CSS字体值 / Actual CSS font value
                 */
                value: string;
            }[];
        };
    };
};

/**
 * PDF 批注组件的配置参数
 */
export declare interface PdfAnnotatorProps extends PdfBaseProps {
    /**
     * Replaces the built-in annotator chrome with a host-owned layout while
     * keeping annotation controls and viewer actions SDK-owned.
     */
    chrome?: default_2.ComponentType<PdfAnnotatorChromeProps>;
    /** Whether the SDK search panel is available to a host chrome. */
    searchAvailable?: boolean;
    /**
     * Optional provider-neutral processed text source. When present, InkLayer
     * disables PDF.js native text selection and renders this page-lazy source
     * as the single selectable text owner over the original PDF visuals.
     */
    positionedTextSource?: PdfPositionedTextSource;
    /**
     * 当前用户信息，用于标注作者标识
     * @default: { id: 'null', name: 'unknown' }
     */
    user?: User;
    /**
     * Client-side interaction permissions for collaborative review.
     * This does not replace server-side authorization.
     * @default { mode: 'unrestricted' }
     */
    annotationPermissions?: AnnotationPermissions;
    /**
     * Requests the host's durable writer before a real annotation mutation.
     * Read-only peers keep their annotation controls visible while this seam
     * performs the serialized writer transfer.
     */
    requestWrite?(intent: PdfAnnotatorWriteIntent): Promise<boolean>;
    /**
     * 是否在批注器初始化时显示全部批注作者标签。
     * 用户仍可通过工具栏按钮切换，或在 macOS 按住 Command、
     * Windows/Linux 按住 Alt 临时显示全部作者标签。
     * @default false
     */
    defaultShowAnnotationAuthorLabels?: boolean;
    /**
     * 是否加载PDF自带的批注
     * @default false
     */
    enableNativeAnnotations?: boolean;
    /**
     * 默认选项配置
     * 如果不提供，则使用系统默认配置
     */
    defaultOptions?: DeepPartial<PdfAnnotatorUserOptions>;
    /**
     * 初始批注列表（Core 格式 Annotation[]），组件内部自动转换。
     * 从后端/api 拿到数据后直接传入即可，无需额外处理。
     *
     * @example
     * const annotations = await api.getAnnotations(docId)
     * <PdfAnnotator initialAnnotations={annotations} />
     */
    initialAnnotations?: Annotation[];
    /**
     * 是否默认显示批注侧边栏
     * @default false
     */
    defaultShowAnnotationsSidebar?: boolean;
    /**
     * 自定义额外按钮区域组件
     * 可以是一个 React 组件或者 React 元素
     * 组件会接收到以下属性:
     * - save: () => void 保存当前批注
     * - getAnnotations: () => Annotation[] 获取当前批注（Core 格式）
     * - exportToExcel: () => void 导出到 Excel
     * - exportToPdf: () => void 导出到 PDF
     */
    actions?: default_2.ReactNode | default_2.ComponentType<{
        save: () => void;
        getAnnotations: () => Annotation[];
        exportToExcel: (fileName?: string) => void;
        exportToPdf: (fileName?: string) => void;
    }>;
    /**
     * 保存回调（Core 格式 Annotation[]）
     * 组件内部自动转换，调用方拿到的是干净的 Annotation[]
     */
    onSave?: (annotations: Annotation[]) => void;
    /**
     * 加载完成回调
     */
    onLoad?: () => void;
    onAnnotationAdded?: (annotation: Annotation) => void;
    /**
     * 删除批注回调
     * @param annotation
     * @returns
     */
    onAnnotationDeleted?: (id: string) => void;
    onAnnotationSelected?: (annotation: Annotation | null, isClick: boolean) => void;
    onAnnotationUpdated?: (annotation: Annotation) => void;
}

export declare interface PdfAnnotatorToolControlProps {
    tool: PdfAnnotatorToolName;
    presentation?: PdfAnnotatorControlPresentation;
    label?: default_2.ReactNode;
    /**
     * Open the tool's color palette while the selected color-capable tool is hovered or focused.
     * The color palette is only active for the selected tool; other tools keep their tooltip.
     */
    colorOnHover?: boolean;
}

export declare type PdfAnnotatorToolName = 'select' | 'rectangle' | 'circle' | 'note' | 'arrow' | 'cloud' | 'freehand' | 'freeHighlight' | 'freeText' | 'signature' | 'stamp';

declare type PdfAnnotatorUserOptions = DeepPartial<PdfAnnotatorOptions>;

export declare type PdfAnnotatorWriteIntent = Readonly<{
    kind: 'tool' | 'mutation';
    tool?: PdfAnnotatorToolName;
    action?: AnnotationPermissionAction;
    annotationId?: string;
}>;

export declare interface PdfBaseProps {
    /**
     * 主题模式
     * @default 'auto'
     */
    appearance?: "auto" | "dark" | "light";
    /**
     * 主题色
     * @default: 'violet'
     */
    theme?: 'ruby' | 'indigo' | 'gray' | 'gold' | 'bronze' | 'brown' | 'yellow' | 'amber' | 'orange' | 'tomato' | 'red' | 'crimson' | 'pink' | 'plum' | 'purple' | 'violet' | 'iris' | 'blue' | 'cyan' | 'teal' | 'jade' | 'green' | 'grass' | 'lime' | 'mint' | 'sky' | undefined;
    /**
     * 页面标题
     */
    title?: React.ReactNode;
    /**
     * PDF 文件地址，支持字符串 URL 或 URL 对象
     * @example "https://example.com/doc.pdf"
     */
    url?: string | URL;
    /**
     * PDF 数据 - 直接传入二进制数据，优先级高于 url
     * 支持 base64 字符串、ArrayBuffer、TypedArray 等格式
     */
    data?: string | number[] | ArrayBuffer | Uint8Array | Uint16Array | Uint32Array;
    /**
     * 语言区域，用于国际化
     * @default 'zh-CN'
     */
    locale?: 'zh-CN' | 'en-US';
    /**
     * 默认选项，用于初始化 PDF 阅读器 缩放
     * @default 'auto'
     */
    initialScale?: PdfScale;
    /**
     * pdf viewer 容器的样式
     * @default { width: '100vw', height: '100vh' }
     */
    layoutStyle?: React.CSSProperties;
    /**
     * 是否开启流式加载模式, auto 为自动判断
     * @default auto
     */
    enableRange?: boolean | 'auto';
    /** PDF.js document asset options for CMaps and standard fonts. */
    pdfjsOptions?: PdfJsOptions;
}

declare type PdfjsAnnotationSubtype = 'None' | 'Link' | 'Text' | 'Widget' | 'Popup' | 'FreeText' | 'Line' | 'Square' | 'Circle' | 'PolyLine' | 'Polygon' | 'Caret' | 'Ink' | 'Highlight' | 'Underline' | 'Squiggly' | 'StrikeOut' | 'Stamp' | 'FileAttachment' | 'Note' | 'Arrow';

declare enum PdfjsAnnotationType {
    NONE = 0,
    TEXT = 1,
    LINK = 2,
    FREETEXT = 3,
    LINE = 4,
    SQUARE = 5,
    CIRCLE = 6,
    POLYGON = 7,
    POLYLINE = 8,
    HIGHLIGHT = 9,
    UNDERLINE = 10,
    SQUIGGLY = 11,
    STRIKEOUT = 12,
    STAMP = 13,
    CARET = 14,
    INK = 15,
    POPUP = 16,
    FILEATTACHMENT = 17,
    SOUND = 18,
    MOVIE = 19,
    WIDGET = 20,
    SCREEN = 21,
    PRINTERMARK = 22,
    TRAPNET = 23,
    WATERMARK = 24,
    THREED = 25,
    REDACT = 26,
    NOTE = 27
}

export declare interface PdfJsOptions {
    /** Base URL for packed CMap assets used by embedded CID fonts. */
    cMapUrl?: string;
    /** Whether the CMap assets use the packed binary format. */
    cMapPacked?: boolean;
    /** Base URL for standard PDF font assets. */
    standardFontDataUrl?: string;
    /** Allow PDF.js to fall back to system fonts when an embedded font is unavailable. */
    useSystemFonts?: boolean;
}

/**
 * InkLayer Annotation Core v0.1 — Freeze Version
 * ===============================================
 *
 * 核心批注数据模型，作为 InkLayer SDK 的标准定义。
 *
 * 设计原则：
 * - 与 UI / 渲染框架无关（Konva / PDF.js / React）
 * - 坐标统一使用 PDF 用户空间（左下角为原点，1pt = 1/72 inch）
 * - 持久化存储的唯一事实来源（Source of Truth）
 * - 可被 Adapter 转换为任意渲染引擎
 *
 * 文档约定：
 * - pageIndex: PDF 逻辑页，从 0 开始
 * - coordinateSystem: 当前固定为 'pdf-user-space'
 * - 所有颜色使用 CSS 颜色字符串（如 '#FF0000', 'rgba(0,0,0,0.5)'）
 *
 * @author InkLayer
 * @version 0.1.0
 */
/** PDF 空间中的点 */
declare interface PdfPoint {
    /** X 坐标（从左向右） */
    x: number;
    /** Y 坐标（从下向上） */
    y: number;
}

/**
 * Layout-only block geometry supplied by a host parser. This seam is kept
 * separate from selectable text spans because a block bbox does not imply
 * line- or glyph-level text geometry.
 */
export declare interface PdfPositionedTextBlock {
    /** Stable source identity for the layout block. */
    readonly id: string;
    readonly blockId?: string;
    readonly kind?: string;
    readonly geometry: PdfPositionedTextGeometry;
}

/**
 * Provider-neutral geometry for an externally supplied selectable text span.
 * Coordinates are expressed in the page's visual top-left coordinate space.
 * Polygon points are ordered around the text quad, beginning at its top-left
 * corner. A bbox remains the preferred representation for axis-aligned text.
 */
export declare type PdfPositionedTextGeometry = Readonly<{
    readonly kind: 'bbox';
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}> | Readonly<{
    readonly kind: 'polygon';
    readonly points: readonly PdfPositionedTextPoint[];
}>;

export declare interface PdfPositionedTextPage {
    /** One-based physical PDF page number. */
    readonly pageNumber: number;
    /** Visual page dimensions matching the geometry coordinate space. */
    readonly dimensions: Readonly<{
        width: number;
        height: number;
    }>;
    /** Optional layout overlay rendered independently from selectable spans. */
    readonly blocks?: readonly PdfPositionedTextBlock[];
    readonly spans: readonly PdfPositionedTextSpan[];
}

/** Provider-neutral point in the page's visual top-left coordinate space. */
export declare interface PdfPositionedTextPoint {
    readonly x: number;
    readonly y: number;
}

/** UTF-16 offsets into the source's logical text string. */
export declare interface PdfPositionedTextRange {
    readonly start: number;
    readonly end: number;
}

export declare interface PdfPositionedTextSelection {
    readonly sourceKey: string;
    readonly text: string;
    readonly range: PdfPositionedTextRange;
    readonly segments: readonly PdfPositionedTextSelectionSegment[];
}

/**
 * Resolves a browser DOM selection against a provider-owned logical source.
 *
 * The resolver deliberately does not infer whitespace, paragraphs, tables, or
 * reading order. The host supplies the authoritative logical text and each
 * positioned span's UTF-16 range; this class only maps DOM boundaries to that
 * source range.
 */
export declare class PdfPositionedTextSelectionResolver {
    private readonly root;
    private source;
    constructor(root: HTMLElement, source: PdfPositionedTextSource);
    setSource(source: PdfPositionedTextSource): void;
    resolve(selectionOrRange: Selection | Range | null): PdfPositionedTextSelection | null;
    private positionedSpansInRange;
}

export declare interface PdfPositionedTextSelectionSegment {
    readonly id: string;
    readonly pageNumber: number;
    readonly range: PdfPositionedTextRange;
    readonly blockId?: string;
    readonly spanId?: string;
}

/**
 * Lazy external text provider owned by the host application.
 * InkLayer owns the page transform and selectable DOM projection.
 */
export declare interface PdfPositionedTextSource {
    /** Stable identity; changing it invalidates an existing DOM selection. */
    readonly sourceKey?: string;
    /**
     * Host-normalized logical text. InkLayer never infers paragraph or table
     * separators; it slices this value using span logical ranges.
     */
    readonly logicalText?: string;
    readonly pageCount: number;
    getPage(pageNumber: number): Promise<PdfPositionedTextPage | null>;
}

export declare interface PdfPositionedTextSpan {
    /** Stable source identity for the supplied span. */
    readonly id: string;
    readonly blockId?: string;
    readonly spanId?: string;
    readonly text: string;
    readonly geometry: PdfPositionedTextGeometry;
    /**
     * Optional logical source range. The host owns paragraph/table semantics;
     * InkLayer only maps DOM boundaries back to these offsets.
     */
    readonly logicalRange?: PdfPositionedTextRange;
}

/** 四边形点，用于文本高亮等多段区域
 *
 * 顺序：p1→p2→p3→p4（顺时针或逆时针）
 * 常用于选中一段文本后的 QuadPoints
 */
declare interface PdfQuad {
    p1: PdfPoint;
    p2: PdfPoint;
    p3: PdfPoint;
    p4: PdfPoint;
}

/** PDF 空间中的矩形 */
declare interface PdfRect {
    /** 左下角 X 坐标 */
    x: number;
    /** 左下角 Y 坐标 */
    y: number;
    /** 宽度 */
    width: number;
    /** 高度 */
    height: number;
}

declare type PdfScale = 'auto' | 'page-actual' | 'page-fit' | 'page-width' | string;

export declare const PdfViewer: default_2.FC<PdfViewerProps>;

/**
 * 定义通过 Context 提供给所有子组件的值
 */
declare interface PdfViewerContextValue {
    /** PDF 文档对象 */
    pdfDocument: PDFDocumentProxy | null;
    /** PDFViewer 实例 */
    pdfViewer: PDFViewer | null;
    /** EventBus 实例 */
    eventBus: EventBus | null;
    /** PDF 渲染容器的 DOM 引用，供扩展使用 */
    viewerContainerRef: default_2.RefObject<HTMLDivElement>;
    /** PDF 核心实例是否都已准备就绪，可以安全地进行交互 */
    isReady: boolean;
    activeSidebarPanel: SidebarPanelKey | null;
    isNavigationSidebarOpen: boolean;
    toggleNavigationSidebar: () => void;
    toggleSidebar: () => void;
    openSidebar: (key: SidebarPanelKey) => void;
    closeSidebar: () => void;
    isSidebarCollapsed: boolean;
    print: () => void;
    download: (fileName?: string) => void;
}

export declare interface PdfViewerProps extends PdfBaseProps {
    /**
     * 自定义额外按钮区域组件
     * 可以是一个 React 组件或者 React 元素
     */
    actions?: default_2.ReactNode | ((context: PdfViewerContextValue) => default_2.ReactNode);
    /**
     * 自定义侧边栏组件
     */
    sidebar?: SidebarPanel[];
    /**
     * 自定义工具栏组件
     * 可以是一个 React 组件或者 React 元素
     * 默认显示 ZoomTool 组件
     */
    toolbar?: default_2.ReactNode | ((context: PdfViewerContextValue) => default_2.ReactNode);
    /**
     * 是否显示文本层（用于选择和搜索文本）
     * @default true
     */
    showTextLayer?: boolean;
    /**
     * 是否显示原生批注
     * @default false
     */
    showAnnotations?: boolean;
    /**
     * 默认选中的侧边栏项 key
     */
    defaultActiveSidebarKey?: SidebarPanelKey | null;
    /**
     * 文档加载完成回调
     * @param pdfViewer
     * @returns
     */
    onDocumentLoaded?: (pdfViewer: PDFViewer | null) => void;
    /**
     * PDFjs EventBus 完成回调
     * @param eventBus
     * @returns
     */
    onEventBusReady?: (eventBus: EventBus | null) => void;
}

/** 多边形/折线几何
 *
 * 适用场景：多边形、折线、不规则形状
 *
 * @property points - 顶点序列
 * @property closed - 是否闭合（多边形 true，折线 false）
 */
declare interface PolyGeometry {
    type: 'poly';
    points: PdfPoint[];
    /** 是否闭合：多边形=true，折线=false */
    closed: boolean;
}

/** 四边形几何（文本标注）
 *
 * 适用场景：文本高亮、下划线、删除线、波浪线
 * PDF 中 TextMarkup annotation 使用 QuadPoints
 */
declare interface QuadGeometry {
    type: 'quad';
    /** 多组四边形，用于选中文本跨越多行的情况 */
    quads: PdfQuad[];
}

/** 矩形几何
 *
 * 适用场景：印章、形状（矩形）、文本批注图标、边界框
 */
declare interface RectGeometry {
    type: 'rect';
    rect: PdfRect;
}

/** 形状（Shape）
 *
 * PDF 原生类型：Square, Circle, Polygon, Cloud
 */
declare interface ShapePayload {
    kind: 'shape';
    /** 形状类型 */
    shape: 'rect' | 'ellipse' | 'cloud' | 'polygon';
}

declare interface SidebarPanel {
    key: string;
    title: default_2.ReactNode;
    icon: default_2.ReactNode;
    render: (context: PdfViewerContextValue) => default_2.ReactNode;
}

declare type SidebarPanelKey = string;

/** 印章（Stamp）
 *
 * PDF 原生类型：Stamp
 *
 * 设计说明：Stamp 的语义是"这是什么章"，不是"怎么画出来"
 * 外观渲染由 AnnotationAppearance 和 Adapter 处理
 */
declare interface StampPayload {
    kind: 'stamp';
    /**
     * 印章逻辑标识符
     *
     * - 标准 PDF 印章使用规范名称：'Approved', 'Rejected', 'Draft', 'Final' 等
     * - 自定义印章使用应用定义的标识符：'company-seal', 'personal-mark' 等
     *
     * 用途：PDF 导出映射、多端协作一致性
     */
    name: string;
    /**
     * 可选显示标签
     *
     * 用于 UI 展示、tooltip、可访问性
     * 例如：'APPROVED' / '已批准' / 'Secret'
     */
    label?: string;
    /**
     * 印章来源类型
     *
     * - 'standard': PDF 标准印章
     * - 'custom': 应用自定义印章
     * - 'image': 图片印章
     */
    source?: 'standard' | 'custom' | 'image';
    /**
     * 预定义外观资源引用
     *
     * 用于企业章/图片章的复用场景
     * 值可以是：asset id / URL / hash key
     *
     * 注意：不直接存储 base64/SVG，保持 Core 纯净
     */
    appearanceRef?: string;
    /** 可选旋转角度（度） */
    rotation?: number;
    /** 可选缩放比例 */
    scale?: number;
}

/** 文本标记（Text Markup）
 *
 * PDF 原生类型：Highlight, Underline, Squiggly, StrikeOut
 */
declare interface TextMarkupPayload {
    kind: 'text-markup';
    /** 文本标记变体 */
    variant: 'highlight' | 'underline' | 'squiggly' | 'strikeout';
    /** User-authored annotation text. */
    text?: string;
    /** Source text covered by the markup geometry. */
    selectedText?: string;
    /** 语义颜色（可选，用于显示优先级）
     *
     * 注意：这是语义提示，不是最终渲染颜色
     * 实际渲染由 AnnotationAppearance 决定
     */
    color?: string;
    /** 透明度（0-1） */
    opacity?: number;
}

export declare interface User {
    id: string;
    name: string;
    avatarUrl?: string;
}

export { }
