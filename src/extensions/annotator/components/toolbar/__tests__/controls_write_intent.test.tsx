/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AnnotationToolControl } from '../controls'

const mockPainter = {
    can: jest.fn(() => false),
    activate: jest.fn(),
}
const mockRequestWrite = jest.fn()

jest.mock('../../../context/use_painter', () => ({
    usePainter: () => ({ painter: mockPainter, requestWrite: mockRequestWrite }),
}))

jest.mock('../../../context/options_context', () => ({
    useOptionsContext: () => ({ defaultOptions: { colors: ['#ff0000'] } }),
}))

jest.mock('../../../store', () => ({
    useAnnotationStore: (selector: (state: { currentAnnotationType: null }) => unknown) => selector({ currentAnnotationType: null }),
}))

jest.mock('@/components/toolbar_button', () => ({
    ToolbarButton: ({ disabled, label, title, onClick }: { disabled?: boolean; label?: React.ReactNode; title?: string; onClick?: () => void }) => (
        <button type="button" disabled={disabled} title={title} onClick={onClick}>{label ?? title}</button>
    ),
}))

jest.mock('@/components/zoom_tool', () => ({ ZoomTool: () => null }))
jest.mock('@/components/color_picker', () => ({ ColorPicker: () => null }))
jest.mock('../signature', () => ({ SignatureTool: () => null }))
jest.mock('../stamp', () => ({ StampTool: () => null }))

describe('AnnotationToolControl write intent', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockPainter.can.mockReturnValue(false)
        mockRequestWrite.mockResolvedValue(true)
    })

    it('keeps a non-writer tool available and activates it after writer approval', async () => {
        render(<AnnotationToolControl tool="rectangle" label="矩形" />)

        const button = screen.getByRole('button', { name: '矩形' })
        expect(button).toBeEnabled()

        fireEvent.click(button)

        await waitFor(() => expect(mockRequestWrite).toHaveBeenCalledWith({ kind: 'tool', tool: 'rectangle' }))
        await waitFor(() => expect(mockPainter.activate).toHaveBeenCalledTimes(1))
    })

    it('does not activate a tool when writer approval fails', async () => {
        mockRequestWrite.mockResolvedValue(false)
        render(<AnnotationToolControl tool="rectangle" label="矩形" />)

        fireEvent.click(screen.getByRole('button', { name: '矩形' }))

        await waitFor(() => expect(mockRequestWrite).toHaveBeenCalledTimes(1))
        expect(mockPainter.activate).not.toHaveBeenCalled()
    })
})
