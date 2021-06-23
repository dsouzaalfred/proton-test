import React from 'react';

import classes from './PasswordView.module.css';
import Icon from '../atoms/Icon';
import Labelled from '../atoms/Labelled';
import LabelledIconButton from './LabelledIconButton';
import { Password } from '../models';
import {
    ContainerBlock,
    HeaderBlock,
    ContentBlock,
    ControlsBlock,
    WarningMessageBlock,
} from '../layouts/PasswordViewEditLayout';

interface PasswordViewProps {
    password: Password;
    onEdit: (password: Password) => void;
    duplicateMsg: string;
}

function PasswordView({ password, onEdit, duplicateMsg }: PasswordViewProps) {
    function handleEditClick() {
        onEdit(password);
    }

    return (
        <ContainerBlock>
            <HeaderBlock>{password.name}</HeaderBlock>
            <ContentBlock>
                <Labelled label="description">{password.description || '-'}</Labelled>

                <Labelled label="value">{password.value || '-'}</Labelled>

                <Labelled label="url">{password.url?.join(', ') || '-'}</Labelled>

                <Labelled label="created at">{new Date(password.createdAt).toTimeString() || '-'}</Labelled>

                <Labelled label="last modified at">
                    {(password.lastModifiedAt && new Date(password.lastModifiedAt).toTimeString()) || '-'}
                </Labelled>
            </ContentBlock>
            <ControlsBlock>
                <LabelledIconButton
                    label="Edit"
                    className={classes.edit}
                    onClick={handleEditClick}
                    icon={<Icon size="small" className="fas fa-pen" />}
                />
            </ControlsBlock>
            {duplicateMsg && <WarningMessageBlock duplicateMsg={duplicateMsg} />}
        </ContainerBlock>
    );
}

export default PasswordView;
