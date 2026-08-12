/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'
import React, { forwardRef, type ReactNode } from 'react'
import { AnnotationType } from '../../../const/definitions'
import { AnnotationToolControl } from '../controls'

const mockPainter = {
    can: jest.fn(() => true),
    activate: jest.fn(),
}

let mockCurrentAnnotationType: { type: AnnotationType; style: { color?: string }; styleEditable?: { color?: boolean } } | null = null

type ToolbarButtonMockProps = {
    title?: string
    tooltip?: string
    label?: ReactNode
    onClick?: () => void
    onPointerEnter?: () => void
    onPointerLeave?: () => void
    onFocus?: () => void
    onBlur?: () => void
}

jest.mock('../../../context/use_painter', () => ({
    usePainter: () => ({ painter: mockPainter, requestWrite: undefined }),
}))

jest.mock('../../../context/options_context', () => ({
    useOptionsContext: () => ({ defaultOptions: { colors: ['#ff0000', '#00ff00'] } }),
}))

jest.mock('../../../store', () => ({
    useAnnotationStore: (selector: (state: { currentAnnotationType: typeof mockCurrentAnnotationType }) => unknown) => (
        selector({ currentAnnotationType: mockCurrentAnnotationType })
    ),
}))

jest.mock('@/components/toolbar_button', () => ({
    ToolbarButton: forwardRef<HTMLButtonElement, ToolbarButtonMockProps>(({
        title,
        tooltip,
        label,
        onClick,
        onPointerEnter,
        onPointerLeave,
        onFocus,
        onBlur,
    }, ref) => (
        <button
            ref={ref}
            type="button"
            aria-label={title}
            data-tooltip={tooltip}
            onClick={onClick}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            onFocus={onFocus}
            onBlur={onBlur}
        >
            {label ?? title}
        </button>
    )),
}))

jest.mock('@/components/color_picker', () => ({
    ColorPicker: ({
        trigger,
        open,
        contentRef,
        onContentPointerEnter,
        onContentPointerLeave,
    }: {
        trigger?: ReactNode
        open?: boolean
        contentRef?: React.Ref<HTMLDivElement>
        onContentPointerEnter?: React.PointerEventHandler<HTMLDivElement>
        onContentPointerLeave?: React.PointerEventHandler<HTMLDivElement>
    }) => (
        <div data-color-picker-open={open ? 'true' : 'false'}>
            {trigger}
            <div
                ref={contentRef}
                data-testid="color-palette"
                onPointerEnter={onContentPointerEnter}
                onPointerLeave={onContentPointerLeave}
            />
        </div>
    ),
}))

jest.mock('@/components/zoom_tool', () => ({ ZoomTool: () => null }))
jest.mock('../signature', () => ({ SignatureTool: () => null }))
jest.mock('../stamp', () => ({ StampTool: () => null }))

describe('AnnotationToolControl color hover', () => {
    beforeEach(() => {
        mockCurrentAnnotationType = {
            type: AnnotationType.RECTANGLE,
            style: { color: '#ff0000' },
            styleEditable: { color: true },
        }
        jest.clearAllMocks()
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('opens the selected tool palette on hover and suppresses its tooltip', () => {
        render(<AnnotationToolControl tool="rectangle" label="矩形" colorOnHover />)

        const button = screen.getByRole('button', { name: '矩形' })
        expect(button).toHaveAttribute('data-tooltip', 'none')
        expect(button.closest('[data-color-picker-open]')).toHaveAttribute('data-color-picker-open', 'false')
    })

    it('opens and closes the palette through the selected tool hover lifecycle', () => {
        render(<AnnotationToolControl tool="rectangle" label="矩形" colorOnHover />)

        const button = screen.getByRole('button', { name: '矩形' })
        expect(screen.getByText('矩形').closest('[data-color-picker-open]')).toHaveAttribute('data-color-picker-open', 'false')

        fireEvent.pointerEnter(button)
        expect(screen.getByText('矩形').closest('[data-color-picker-open]')).toHaveAttribute('data-color-picker-open', 'true')

        fireEvent.pointerLeave(button)
        fireEvent.pointerEnter(screen.getByTestId('color-palette'))
        act(() => jest.advanceTimersByTime(120))
        expect(screen.getByText('矩形').closest('[data-color-picker-open]')).toHaveAttribute('data-color-picker-open', 'true')

        fireEvent.pointerLeave(screen.getByTestId('color-palette'))
        act(() => jest.advanceTimersByTime(120))
        expect(screen.getByText('矩形').closest('[data-color-picker-open]')).toHaveAttribute('data-color-picker-open', 'false')
    })

    it('keeps the normal tooltip for an unselected color-capable tool', () => {
        mockCurrentAnnotationType = null
        render(<AnnotationToolControl tool="rectangle" label="矩形" colorOnHover />)

        const button = screen.getByRole('button', { name: '矩形' })
        expect(button).toHaveAttribute('data-tooltip', 'auto')
        fireEvent.pointerEnter(button)
        expect(button.closest('[data-color-picker-open]')).toBeNull()
    })

    it('does not add color behavior to tools without editable colors', () => {
        mockCurrentAnnotationType = {
            type: AnnotationType.NOTE,
            style: {},
            styleEditable: { color: false },
        }
        render(<AnnotationToolControl tool="note" label="批注" colorOnHover />)

        expect(screen.getByRole('button', { name: '批注' })).toHaveAttribute('data-tooltip', 'auto')
    })
})
