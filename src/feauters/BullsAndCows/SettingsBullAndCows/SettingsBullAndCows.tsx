import React, {FC} from 'react';
import s from './SettingsBullAndCows.module.scss'
import {HistoryItemType} from "../BullsAndCows";

type SettingsPropsType = {
    gameStatus: string
    myMoves: HistoryItemType[]
    opponentMoves: HistoryItemType[]
}

const SettingsBullAndCows: FC<SettingsPropsType> = ({myMoves,opponentMoves,gameStatus}) => {
    return (
        <div className={s.settingsContainer}>
            <div className={s.gameStatus}>
                {gameStatus && <div>{gameStatus}</div>}
            </div>
            <div className={s.statisticsBlock}>
              <div className={s.myMoves}>
                    My moves!!!
                  {myMoves.length > 0 && <div>{myMoves.map((m, i) => <div key={i}>{i}. {m.squares}: bulls: {m.bulls === null ? 0 : m.bulls},
                        cows: {m.cows === null ? 0 : m.cows}</div>).slice(1, myMoves.length + 1)}</div>}
                </div>
                <div className={s.opponentMoves}>
                    Opponents moves!
                    {opponentMoves.length > 0 && <div>{opponentMoves.map((m,i) => <div key={i}>{i + 1}. {m.squares}: bulls: {m.bulls === null ? 0 : m.bulls},
                        cows: {m.cows === null ? 0 : m.cows}</div>)}</div>}
                </div>
            </div>
        </div>
    );
};

export default SettingsBullAndCows;