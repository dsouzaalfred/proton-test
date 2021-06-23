import React from 'react';
import classes from './PasswordViewEditLayout.module.css';

interface BlockProps {
    children?: React.ReactNode;
}
interface WarningMessageBlockProps {
    duplicateMsg: string;
}

export const ContainerBlock = ({ children }: BlockProps) => {
    return <div className={classes.container}>{children}</div>;
};

export const HeaderBlock = ({ children }: BlockProps) => {
    return <h2 className={classes.title}>{children}</h2>;
};

export const ContentBlock = ({ children }: BlockProps) => {
    return <div className={classes.content}>{children}</div>;
};

export const ControlsBlock = ({ children }: BlockProps) => {
    return <div className={classes.controls}>{children}</div>;
};

export const WarningMessageBlock = ({ duplicateMsg }: WarningMessageBlockProps) => {
    return <p className={classes.duplicate}>{duplicateMsg}</p>;
};
