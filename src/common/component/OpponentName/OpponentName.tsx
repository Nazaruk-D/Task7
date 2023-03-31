import React, {FC} from 'react';
import s from "./OpponentName.module.scss"

type OpponentNamePropsType = {
    opponentName: string
}

const OpponentName: FC<OpponentNamePropsType> = ({opponentName}) => {
    return (
        <div>
            {opponentName && <div className={s.opponentName}>Your opponent: {opponentName}</div>}
        </div>
    )
};

export default OpponentName;