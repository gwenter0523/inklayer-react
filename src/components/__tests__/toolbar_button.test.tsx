/** @jest-environment jsdom */

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Theme } from '@radix-ui/themes'
import { ToolbarButton } from '../toolbar_button'

describe('ToolbarButton', () => {
    it('exposes selected state as an accessible pressed state', () => {
        render(<Theme><ToolbarButton title="矩形" selected icon={<span />} /></Theme>)

        expect(screen.getByRole('button', { name: '矩形' })).toHaveAttribute('aria-pressed', 'true')
    })

    it('does not duplicate the visible tooltip as a native browser title', () => {
        render(<Theme><ToolbarButton title="签名" label="签名" icon={<span />} /></Theme>)

        expect(screen.getByRole('button', { name: '签名' })).not.toHaveAttribute('title')
    })
})
