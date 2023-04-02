import React, {FC} from 'react';
import s from "./GameStatus.module.scss"


type GameStatusPropsType = {
    gameStatus: string
}

const GameStatus: FC<GameStatusPropsType> = ({gameStatus}) => {
    return (
        <div className={s.gameStatus}>
            {gameStatus}
        </div>
    );
};

export default GameStatus;