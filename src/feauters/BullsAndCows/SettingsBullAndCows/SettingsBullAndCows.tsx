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
    startGameHandler: () => void
    userInfo: UserInfoType | null
}

const SettingsBullAndCows: FC<SettingsPropsType> = ({myMoves,opponentMoves,newGame,onClickNewGameHandler,startGameHandler,gameStatus, userInfo}) => {
    return (
        <div className={s.settingsContainer}>
            <div className={s.gameStatus}>
                {gameStatus && <div>{gameStatus}</div>}
            </div>
            <div className={s.buttonBlock}>
                {newGame && <button onClick={onClickNewGameHandler}>new Game</button>}
                {!userInfo && <button onClick={startGameHandler}>start game</button>}
            </div>
            <div className={s.statisticsBlock}>
              <div className={s.myMoves}>
                    My moves!!!
                  {myMoves.length > 0 && <div>{myMoves.map((m, i) => <div key={i}>{m.squares}: bulls: {m.bulls === null ? 0 : m.bulls},
                        cows: {m.cows === null ? 0 : m.cows}</div>).slice(1, myMoves.length + 1)}</div>}
                </div>
                <div className={s.opponentMoves}>
                    Opponents moves!
                    {opponentMoves.length > 0 && <div>{opponentMoves.map((m,i) => <div key={i}>{m.squares}: bulls: {m.bulls === null ? 0 : m.bulls},
                        cows: {m.cows === null ? 0 : m.cows}</div>)}</div>}
                </div>
            </div>
        </div>
    );
};

export default SettingsBullAndCows;