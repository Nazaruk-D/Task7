import React, {useEffect, useState} from "react";
import s from "./TikTakToe.module.scss"
import Board from "./Board/Board";
import io from 'socket.io-client';
import {useAppSelector} from "../../store/store";
import {selectorNameUser} from "../../store/selector/selectorApp";
import {routes} from "../../routes/routes";
import {useNavigate} from "react-router-dom";

const TikTakToe = () => {
    const userName = useAppSelector(selectorNameUser)
    const navigate = useNavigate()

    const [history, setHistory] = useState([{squares: Array(9).fill(null)}]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);

    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    function calculateWinner(squares: (string | null)[]): string | null {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (
                squares[a] &&
                squares[a] === squares[b] &&
                squares[a] === squares[c]
            ) {
                return squares[a];
            }
        }
        return null;
    }

    const handleClick = (i: number) => {
        const newHistory = history.slice(0, stepNumber + 1);
        const currentSquares = newHistory[newHistory.length - 1].squares.slice();
        if (winner || currentSquares[i]) {
            return;
        }
        currentSquares[i] = xIsNext ? "X" : "O";
        setHistory(newHistory.concat([{squares: currentSquares}]));
        setStepNumber(newHistory.length);
        setXIsNext(!xIsNext);
    };

    let status;
    if (winner) {
        status = `Winner: ${winner}`;
    } else if (stepNumber === 9) {
        status = "Draw";
    } else {
        status = `Next player: ${xIsNext ? "X" : "O"}`;
    }


    useEffect(() => {
        const socket = io('http://localhost:8080');

        socket.on('connect', () => {
            console.log('Connected to server');
            if(userName){
                socket.emit('set-name', userName)
            }
        });

        socket.on('message', (data: any) => {
            console.log('Message received from server:', data);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        return () => {
            socket.disconnect();
        };
    }, [userName]);


    useEffect(() => {
        if (!userName) navigate(routes.login)
    }, [userName, navigate])


    return (
        <div className={s.tikTakToeContainer}>
            <Board squares={current.squares} onClick={handleClick} status={status}/>
        </div>
    );
};

export default TikTakToe;

