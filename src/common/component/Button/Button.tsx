import React from 'react';
import s from './Button.module.scss';

type Props = {
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
};

const Button = ({ onClick, disabled = false, className = '', children }: Props) => {
    return (
        <button className={`${s.button} ${className}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;