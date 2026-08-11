/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import type { PdfAnnotatorChromeProps, PdfAnnotatorToolName } from '../types/annotator'

describe('PdfAnnotator chrome contract', () => {
    it('exposes a finite tool projection and SDK-owned control slots', () => {
        const ToolControl = ({ tool, presentation = 'toolbar-icon' }: { tool: PdfAnnotatorToolName; presentation?: 'toolbar-icon' | 'menu-item' }) => (
            <button type="button" data-tool={tool} data-presentation={presentation}>{tool}</button>
        )
        const ColorControl = () => <button type="button">Color</button>
        const AuthorLabelsControl = () => <button type="button">Authors</button>
        const PageZoomControl = () => <div>Page and zoom</div>
        const Chrome = (props: PdfAnnotatorChromeProps) => (
            <div>
                <props.ToolControl tool="rectangle" />
                <props.ToolControl tool="stamp" presentation="menu-item" />
                <props.ColorControl />
                <props.AuthorLabelsControl />
                <props.PageZoomControl />
            </div>
        )

        render(
            <Chrome
                activeTool="rectangle"
                canCreate
                ToolControl={ToolControl}
                ColorControl={ColorControl}
                AuthorLabelsControl={AuthorLabelsControl}
                PageZoomControl={PageZoomControl}
                panels={{
                    navigation: { open: false, toggle: () => undefined },
                    search: { open: false, available: true, toggle: () => undefined },
                    annotations: { open: false, toggle: () => undefined },
                }}
                actions={{
                    save: () => undefined,
                    getAnnotations: () => [],
                    exportToExcel: () => undefined,
                    exportToPdf: () => undefined,
                }}
            />
        )

        expect(screen.getByRole('button', { name: 'rectangle' })).toHaveAttribute('data-tool', 'rectangle')
        expect(screen.getByRole('button', { name: 'stamp' })).toHaveAttribute('data-presentation', 'menu-item')
        expect(screen.getByText('Page and zoom')).toBeInTheDocument()
    })
})
