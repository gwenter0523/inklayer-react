export interface MatchSnippet {
    matchIndex: number
    charIndex: number
    snippet: string
}

export interface PageMatch {
    pageNumber: number
    countTotal: number
    matches: MatchSnippet[]
}

export interface KeywordResult {
    query: string
    countTotal: number
    pageMatches: PageMatch[]
}

export interface User {
    id: string
    name: string
    avatarUrl?: string
}


export type PdfScale = 'auto' | 'page-actual' | 'page-fit' | 'page-width' | string

export interface PdfJsOptions {
    /** Base URL for packed CMap assets used by embedded CID fonts. */
    cMapUrl?: string
    /** Whether the CMap assets use the packed binary format. */
    cMapPacked?: boolean
    /** Base URL for standard PDF font assets. */
    standardFontDataUrl?: string
    /** Allow PDF.js to fall back to system fonts when an embedded font is unavailable. */
    useSystemFonts?: boolean
}

export interface PdfBaseProps {
    /**
     * 主题模式
     * @default 'auto'
     */
    appearance?: "auto" | "dark" | "light"
    /**
     * 主题色
     * @default: 'violet'
     */
    theme?:
        | 'ruby'
        | 'indigo'
        | 'gray'
        | 'gold'
        | 'bronze'
        | 'brown'
        | 'yellow'
        | 'amber'
        | 'orange'
        | 'tomato'
        | 'red'
        | 'crimson'
        | 'pink'
        | 'plum'
        | 'purple'
        | 'violet'
        | 'iris'
        | 'blue'
        | 'cyan'
        | 'teal'
        | 'jade'
        | 'green'
        | 'grass'
        | 'lime'
        | 'mint'
        | 'sky'
        | undefined
    /**
     * 页面标题
     */
    title?: React.ReactNode
    /**
     * PDF 文件地址，支持字符串 URL 或 URL 对象
     * @example "https://example.com/doc.pdf"
     */
    url?: string | URL

    /**
     * PDF 数据 - 直接传入二进制数据，优先级高于 url
     * 支持 base64 字符串、ArrayBuffer、TypedArray 等格式
     */
    data?: string | number[] | ArrayBuffer | Uint8Array | Uint16Array | Uint32Array

    /**
     * 语言区域，用于国际化
     * @default 'zh-CN'
     */
    locale?: 'zh-CN' | 'en-US'

    /**
     * 默认选项，用于初始化 PDF 阅读器 缩放
     * @default 'auto'
     */
    initialScale?: PdfScale
    /**
     * pdf viewer 容器的样式
     * @default { width: '100vw', height: '100vh' }
     */
    layoutStyle?: React.CSSProperties

    /**
     * 是否开启流式加载模式, auto 为自动判断
     * @default auto
     */
    enableRange?: boolean | 'auto'

    /** PDF.js document asset options for CMaps and standard fonts. */
    pdfjsOptions?: PdfJsOptions

}
