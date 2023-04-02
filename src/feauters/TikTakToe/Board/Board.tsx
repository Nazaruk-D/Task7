import React, {ChangeEvent, useState} from "react";
import s from "./Board.module.scss"
import Square from "../Square/Square";
import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {UserInfoType} from "../../../common/types/UserTypes";

interface BoardProps {
    squares: (string | null)[];
    onClick: (i: number) => void;
    status?: string
    ws: Socket<DefaultEventsMap, DefaultEventsMap> | null
    userName: string
    userInfo: UserInfoType | null
}

const Board: React.FC<BoardProps> = ({squares, onClick, status, ws, userName, userInfo}) => {
    return (
        <div className={s.board}>
            <div className={s.boardRow}>
                <Square value={squares[0]} onClick={() => onClick(0)}/>
                <Square value={squares[1]} onClick={() => onClick(1)}/>
                <Square value={squares[2]} onClick={() => onClick(2)}/>
            </div>
            <div className={s.boardRow}>
                <Square value={squares[3]} onClick={() => onClick(3)}/>
                <Square value={squares[4]} onClick={() => onClick(4)}/>
                <Square value={squares[5]} onClick={() => onClick(5)}/>
            </div>
            <div className={s.boardRow}>
                <Square value={squares[6]} onClick={() => onClick(6)}/>
                <Square value={squares[7]} onClick={() => onClick(7)}/>
                <Square value={squares[8]} onClick={() => onClick(8)}/>
            </div>
            <div>
                <div>{status}</div>
            </div>
        </div>
    );
};

export default Board;
