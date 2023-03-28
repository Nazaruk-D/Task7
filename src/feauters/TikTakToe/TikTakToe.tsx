import React, {ChangeEvent, useEffect, useState} from "react";
import s from "./TikTakToe.module.scss"
import Board from "./Board/Board";
import io, {Socket} from 'socket.io-client';
import {useAppSelector} from "../../store/store";
import {selectorNameUser} from "../../store/selector/selectorApp";
import {router, routes} from "../../routes/routes";
import {Link, useNavigate} from "react-router-dom";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {useModal} from "../../common/component/SendFormModal/useModal";
import SettingsGame from "../../common/component/SendFormModal/SettingsGame/SettingsGame";
import {FiSettings} from "react-icons/fi";
import {BackToMainMenu} from "../../common/component/BackToMainMenu/BackToMainMenu";
import Settings from "../../common/component/Settings/Settings";

type userInfoType = {
    gameId: number,
    userMove?: string,
    board?: any
    players?: UserType[]
}

type UserType = {
    name: string,
    id: string
}


const TikTakToe = () => {
    const userName = useAppSelector(selectorNameUser)
    const navigate = useNavigate()

    const [history, setHistory] = useState([{squares: Array(9).fill(null)}]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [ws, setWs] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const [userInfo, setUserInfo] = useState<userInfoType | null>(null)
    const [gameStatus, setGameStatus] = useState("")
    const [newGame, setNewGame] = useState(false)

    const current = history[stepNumber];

    const {settingsGame, toggleSettingsGame} = useModal()


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
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }

    const handleClick = (i: number) => {
        if (ws && userInfo && userInfo.userMove === userName) {
            const newHistory = history.slice(0, stepNumber + 1);
            const currentSquares = newHistory[newHistory.length - 1].squares.slice();

            if (winner || currentSquares[i]) {
                return;
            }

            currentSquares[i] = xIsNext ? "X" : "O";
            setHistory(newHistory.concat([{squares: currentSquares}]));
            // setStepNumber(newHistory.length);
            setXIsNext(!xIsNext);
            const data = {
                gameId: userInfo.gameId,
                userMove: userName,
                board: currentSquares
            }
            ws.emit('make-move', data)
        }
    };

    useEffect(() => {
        const socket = io('http://localhost:8080');
        setWs(socket);
        return () => {
            socket.disconnect();
        };
    }, [])


    if (ws && userInfo) {
        if (winner) {
            const data = {
                info: `Winner: ${userInfo.userMove}`,
                gameId: userInfo.gameId
            };
            ws.emit('game-over', data)
        } else if (stepNumber === 9) {
            const data = {
                info: `Draw`,
                gameId: userInfo.gameId
            };
            ws.emit('game-over', data)
        }
    }


    useEffect(() => {
        if (ws) {
            ws.on('connect', () => {
                console.log('Connected to server');
                if (userName) {
                    ws.emit('set-name', userName)
                }
            });

            ws.on('message', (data: any) => {
                console.log('Message received from server:', data);
            });

            ws.on('disconnect', () => {
                console.log('Disconnected from server');
            });

            ws.on('start-game', (data: any) => {
                setUserInfo(data)
                if (data.userMove === userName) {
                    setGameStatus("Game start, your turn")
                } else {
                    setGameStatus('Game start, opponent turn')
                }

            });

            ws.on('join-game-success', (data: any) => {
                setGameStatus(`Successfully connected to the game, room number ${data.gameId}`)
                setUserInfo(data)
            });

            ws.on('join-game-failed', (data: any) => {
                setGameStatus(`Join game failed, ${data.gameId}`)
            });

            ws.on('update-game-state', (data: userInfoType) => {
                const updatedInfo = {...userInfo, board: data.board, userMove: data.userMove, gameId: data.gameId};
                setUserInfo(updatedInfo);
                if (updatedInfo.board) {
                    setHistory(prevHistory => [...prevHistory, {squares: updatedInfo.board}]);
                    setStepNumber(prevStepNumber => prevStepNumber + 1);
                    if (data.userMove === userName) {
                        setXIsNext(!xIsNext);
                        setGameStatus("Your turn")
                    } else {
                        setGameStatus("Opponent turn")
                    }
                }
            });

            ws.on('game-over', (data: any) => {
                setGameStatus(data.info)
                setNewGame(true)
            })
        }
    }, [ws, userName, history]);


    useEffect(() => {
        if (!userName) navigate(routes.login)
    }, [userName, navigate])


    const onClickNewGameHandler = () => {
        setHistory([{squares: Array(9).fill(null)}])
        setStepNumber(0)
        setUserInfo(null)
        setNewGame(false)
        onClickHandler()
    }

    const [gameId, setGameId] = useState<number | undefined>(undefined)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value) {
            setGameId(Number(e.currentTarget.value))
        }
    }

    const onClickHandler = () => {
        if (ws && userName) {
            if (gameId) {
                const data = {
                    gameId,
                    playerName: userName
                };
                ws.emit('join-game', data)
            } else {
                const data = {
                    gameId: "new room",
                    playerName: userName
                };
                ws.emit('join-game', data)
            }
        }
    }


    return (
        <div className={s.tikTakToeContainer}>
            <BackToMainMenu/>
            <Settings onClick={toggleSettingsGame}/>
            <Board squares={current.squares} onClick={handleClick} ws={ws} userName={userName} userInfo={userInfo}/>
            {settingsGame && <SettingsGame setModalActive={toggleSettingsGame} hide={toggleSettingsGame}/>}
            {gameStatus && <div>{gameStatus}</div>}
            {newGame && <button onClick={onClickNewGameHandler}>new Game</button>}
            {!userInfo && <button onClick={onClickHandler}>start game</button>}
            <input type="text" onChange={onChangeHandler} value={gameId}/>
        </div>
    );
};

export default TikTakToe;

