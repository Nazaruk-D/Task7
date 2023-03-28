import React, {FC} from 'react';
import s from './Settings.module.scss'
import {FiSettings} from "react-icons/fi";

type SettingsPropsType = {
    onClick: () => void
}

const Settings: FC<SettingsPropsType> = ({onClick}) => {
    return (
        <div className={s.settingsContainer} onClick={onClick}>
            Settings
            <FiSettings />
        </div>
    );
};

export default Settings;