import { ButtonProps, IconButton, Tooltip } from '@radix-ui/themes';
import React, { forwardRef, useEffect, useState } from 'react';

interface ToolbarButtonProps {
    icon?: React.ReactNode;
    selected?: boolean;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    title?: string;
    label?: React.ReactNode;
    tooltip?: 'auto' | 'none';
    tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
    buttonProps?: Partial<ButtonProps>
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(({
    icon,
    selected,
    onClick,
    disabled = false,
    title,
    label,
    tooltip = 'auto',
    tooltipSide = 'bottom',
    className,
    buttonProps = {}
}, ref) => {
    const [tooltipOpen, setTooltipOpen] = useState(false)

    useEffect(() => {
        if (!title || tooltip === 'none' || typeof window === 'undefined') return
        const close = () => setTooltipOpen(false)
        window.addEventListener('inklayer:close-toolbar-tooltips', close)
        window.addEventListener('scroll', close, true)
        return () => {
            window.removeEventListener('inklayer:close-toolbar-tooltips', close)
            window.removeEventListener('scroll', close, true)
        }
    }, [title, tooltip])

    useEffect(() => {
        if (selected === undefined || typeof window === 'undefined') return
        window.dispatchEvent(new Event('inklayer:close-toolbar-tooltips'))
    }, [selected])

    const closeTooltips = () => {
        setTooltipOpen(false)
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('inklayer:close-toolbar-tooltips'))
    }

    const iconButton = <IconButton
        ref={ref}
        className={className}
        color={selected ? undefined : 'gray'}
        variant={selected ? 'soft' : 'outline'}
        style={{
            opacity: disabled ? 0.5 : 1,
            boxShadow: 'none'
        }}
        onClick={onClick}
        disabled={disabled}
        aria-label={title}
        aria-pressed={selected === undefined ? undefined : selected}
        data-inklayer-toolbar-button="true"
        data-selected={selected ? 'true' : 'false'}
        {...buttonProps}
        onPointerDown={closeTooltips}
    >
        {icon}
        {label}
    </IconButton>

    return (
        title && tooltip !== 'none' ?
            <Tooltip content={title} side={tooltipSide} open={tooltipOpen} onOpenChange={setTooltipOpen}>
                {iconButton}
            </Tooltip>
            : iconButton
    );
});
