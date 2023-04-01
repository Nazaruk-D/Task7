import React, {FC} from 'react';
import s from './Settings.module.scss'
import {FiSettings} from "react-icons/fi";

type SettingsPropsType = {
    onClick: () => void
}

const Settings: FC<SettingsPropsType> = ({onClick}) => {
    return (
        <div className={s.settingsContainer} onClick={onClick}>
            <div className={s.text}>
                Settings
            </div>
            <div className={s.icon}>
                <FiSettings style={{marginLeft:"10px", fontSize: "23px"}}/>
            </div>
        </div>
    );
};

export default Settings;