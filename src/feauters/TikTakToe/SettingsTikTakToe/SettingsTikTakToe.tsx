import React, {FC} from 'react';
import s from "./SettingsTikTakToe.module.scss"
import {UserInfoType} from "../../../common/types/UserTypes";
import Button from "../../../common/component/Button/Button";

type SettingsTikTakToePropType = {
    gameStatus: string
    newGame: boolean
    userInfo: UserInfoType | null
    onClickNewGameHandler: () => void
    startGameHandler:() => void
}

const SettingsTikTakToe: FC<SettingsTikTakToePropType> = ({gameStatus, newGame, userInfo, startGameHandler, onClickNewGameHandler}) => {
    return (
        <div className={s.settingsTikTakToeContainer}>
            {gameStatus && <div className={s.status}>{gameStatus}</div>}
            <div className={s.buttonBlock}>
                {newGame && <Button onClick={onClickNewGameHandler}>New Game</Button>}
                {!userInfo && <Button onClick={startGameHandler}>Start game</Button>}
            </div>
        </div>
    );
};

export default SettingsTikTakToe;