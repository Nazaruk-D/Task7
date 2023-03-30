import React, {FC} from 'react';
import s from './SettingsBullAndCows.module.scss'
import {UserInfoType} from "../../../common/types/UserTypes";
import {HistoryItemType} from "../BullsAndCows";

type SettingsPropsType = {
    gameStatus: string
    newGame: boolean
    myMoves: HistoryItemType[]
    opponentMoves: HistoryItemType[]
    onClickNewGameHandler: () => void
    startGameHandler:() => void
    userInfo: UserInfoType | null
}

const SettingsBullAndCows: FC<SettingsPropsType> = ({myMoves,opponentMoves,newGame,onClickNewGameHandler,startGameHandler,gameStatus, userInfo}) => {
    return (
        <div className={s.settingsContainer}>
            <div className={s.gameStatus}>
                {gameStatus && <div>{gameStatus}</div>}
            </div>
            <div className={s.buttonBlock}>
                {newGame && <button type="submit" onClick={onClickNewGameHandler}>new Game</button>}
                {!userInfo && <button type="submit" onClick={startGameHandler}>start game</button>}
            </div>
            <div className={s.statisticsBlock}>
                {myMoves.length > 0 && <div className={s.myMoves}>
                    My moves!!!
                    <div>{myMoves.map((m, i) => <div key={i}>{m.squares}: bulls: {m.bulls === null ? 0 : m.bulls},
                        cows: {m.cows === null ? 0 : m.cows}</div>)}</div>
                </div>}
                {opponentMoves.length > 1 && <div className={s.opponentMoves}>
                    Opponents moves!
                    <div>{opponentMoves.map((m,i) => <div key={i}>{m.squares}: bulls: {m.bulls === null ? 0 : m.bulls},
                        cows: {m.cows === null ? 0 : m.cows}</div>).slice(1, opponentMoves.length + 1)}</div>
                </div>}
            </div>
        </div>
    );
};

export default SettingsBullAndCows;