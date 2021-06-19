import React from 'react';
import Icon from '../atoms/Icon';

import ListItem from '../atoms/ListItem';
import classes from './PasswordListItem.module.css';

interface PasswordListItemProps {
    name: string;
    disabled: boolean;
    onClick: () => void;
    vulnerable: boolean;
    isSelected: boolean;
}

function PasswordListItem({ name, vulnerable, ...rest }: PasswordListItemProps) {
    return (
        <>
            {name ? (
                <ListItem clickable className={classes.listItem} {...rest}>
                    {name}
                    {vulnerable && <Icon size="small" className="fas fa-exclamation-triangle" />}
                </ListItem>
            ) : null}
        </>
    );
}

export default React.memo(PasswordListItem);
