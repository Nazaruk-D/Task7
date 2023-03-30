import React, {FC} from 'react';
import {UserInfoType} from "../../../common/types/UserTypes";

type SettingsTikTakToePropType = {
    gameStatus: string
    newGame: boolean
    userInfo: UserInfoType | null
    onClickNewGameHandler: () => void
    startGameHandler:() => void
}

const SettingsTikTakToe: FC<SettingsTikTakToePropType> = ({gameStatus, newGame, userInfo, startGameHandler, onClickNewGameHandler}) => {
    return (
        <div>
            {gameStatus && <div>{gameStatus}</div>}
            {newGame && <button onClick={onClickNewGameHandler}>new Game</button>}
            {!userInfo && <button onClick={startGameHandler}>start game</button>}
        </div>
    );
};

export default SettingsTikTakToe;