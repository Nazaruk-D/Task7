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
            <div className={s.statisticsBlock}>
              <div className={s.myMoves}>
                    <p className={s.title}>My moves</p>
                  {myMoves.length > 0 && <div className={s.result}>{myMoves.map((m, i) => <div key={i}>{i}. {m.squares}: bulls: <span className={s.number}>{m.bulls === null ? 0 : m.bulls}</span>,
                      cows: <span className={s.number}>{m.cows === null ? 0 : m.cows}</span></div>).slice(1, myMoves.length + 1)}</div>}
                </div>
                <div className={s.opponentMoves}>
                    <p className={s.title}>Opponents moves</p>
                    {opponentMoves.length > 0 && <div className={s.result}>{opponentMoves.map((m,i) => <div key={i}>{i + 1}. {m.squares}: bulls: <span className={s.number}>{m.bulls === null ? 0 : m.bulls}</span>,
                        cows: <span className={s.number}>{m.cows === null ? 0 : m.cows}</span></div>)}</div>}
                </div>
            </div>
        </div>
    );
};

export default SettingsBullAndCows;