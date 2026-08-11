import { ButtonProps, IconButton, Tooltip } from '@radix-ui/themes';
import React, { forwardRef } from 'react';

interface ToolbarButtonProps {
    icon?: React.ReactNode;
    selected?: boolean;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    title?: string;
    label?: React.ReactNode;
    buttonProps?: Partial<ButtonProps>
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(({
    icon,
    selected,
    onClick,
    disabled = false,
    title,
    label,
    buttonProps = {}
}, ref) => {

    const iconButton = <IconButton
        ref={ref}
        color={selected ? undefined : 'gray'}
        variant={selected ? 'soft' : 'outline'}
        style={{
            opacity: disabled ? 0.5 : 1,
            boxShadow: 'none'
        }}
        onClick={onClick}
        disabled={disabled}
        title={title}
        aria-label={title}
        {...buttonProps}
    >
        {icon}
        {label}
    </IconButton>

    return (
        title ?
            <Tooltip content={title}>
                {iconButton}
            </Tooltip>
            : iconButton
    );
});
