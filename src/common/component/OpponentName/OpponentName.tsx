import React, {FC} from 'react';
import s from "./OpponentName.module.scss"

type OpponentNamePropsType = {
    opponentName: string
}

const OpponentName: FC<OpponentNamePropsType> = ({opponentName}) => {
    return (
        <div>
            {opponentName && <div className={s.opponentName}>Your opponent: <span className={s.name}>{opponentName}</span></div>}
        </div>
    )
};

export default OpponentName;