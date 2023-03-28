import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import s from "./TikTakToe.module.scss"
import io, {Socket} from 'socket.io-client';
import {useAppSelector} from "../../store/store";
import {selectorNameUser} from "../../store/selector/selectorApp";
import {routes} from "../../routes/routes";
import {useNavigate} from "react-router-dom";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {useModal} from "../../common/component/SendFormModal/useModal";
import SettingsGame from "../../common/component/SendFormModal/SettingsGame/SettingsGame";
import {BackToMainMenu} from "../../common/component/BackToMainMenu/BackToMainMenu";
import Settings from "../../common/component/Settings/Settings";
import {calculateWinner} from "../../utils/calculateWinner-utils";
import {UserInfoType} from "../../common/types/UserTypes";
import Board from "./Board/Board";


const TikTakToe = () => {
    const userName = useAppSelector(selectorNameUser)
    const navigate = useNavigate()

    const [history, setHistory] = useState([{squares: Array(9).fill(null)}]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [ws, setWs] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfoType | null>(null)
    const [gameStatus, setGameStatus] = useState("")
    const [newGame, setNewGame] = useState(false)
    const [lastPlayer, setLastPlayer] = useState<string | null>(null);
    const [gameId, setGameId] = useState<number | "">("")
    const {settingsGame, toggleSettingsGame} = useModal()

    const current = history[stepNumber];

    const winner = calculateWinner(current.squares);

    const onClickNewGameHandler = () => {
        setHistory([{squares: Array(9).fill(null)}])
        setStepNumber(0)
        setUserInfo(null)
        setNewGame(false)
        startGameHandler()
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value) {
            setGameId(Number(e.currentTarget.value))
        }
    }

    const startGameHandler = () => {
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

    const handleClick = (i: number) => {
        if (ws && userInfo && userInfo.userMove === userName) {
            const newHistory = history.slice(0, stepNumber + 1);
            const currentSquares = newHistory[newHistory.length - 1].squares.slice();
            setLastPlayer(userName);
            if (winner || currentSquares[i]) {
                return;
            }
            currentSquares[i] = xIsNext ? "X" : "O";
            setXIsNext(!xIsNext);
            const data = {
                gameId: userInfo.gameId,
                userMove: userName,
                board: currentSquares
            }
            ws.emit('make-move', data)
        }
    };

    const handleUpdateGameState = useCallback((data: UserInfoType) => {
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
    }, [userInfo, setUserInfo, setHistory, setStepNumber, userName, xIsNext]);

    useEffect(() => {
        if(!ws) {
            const socket = io('http://localhost:8080');
            setWs(socket);
        }
        return () => {
            ws?.disconnect();
        };
    }, [])

    useEffect(() => {
        if (ws && userInfo) {
            if (winner) {
                const data = {
                    info: `Winner: ${lastPlayer}`,
                    gameId: userInfo.gameId,
                };
                ws.emit("game-over", data);
            } else if (stepNumber === 9) {
                const data = {
                    info: `Draw`,
                    gameId: userInfo.gameId,
                };
                ws.emit("game-over", data);
            }
        }
    }, [stepNumber, userInfo, winner, ws]);

    useEffect(() => {
        if(ws){
            ws.on('update-game-state', handleUpdateGameState);
            return () => {
                ws.off('update-game-state', handleUpdateGameState);
            }
        }
    }, [handleUpdateGameState, ws]);

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

            ws.on('game-over', (data: any) => {
                setGameStatus(data.info)
                setNewGame(true)
            })
        }
    }, [ws, userName, history]);


    useEffect(() => {
        if (!userName) navigate(routes.login)
    }, [userName, navigate])

    return (
        <div className={s.tikTakToeContainer}>
            <BackToMainMenu/>
            <Settings onClick={toggleSettingsGame}/>
            <Board squares={current.squares} onClick={handleClick} ws={ws} userName={userName} userInfo={userInfo}/>
            {settingsGame && <SettingsGame setModalActive={toggleSettingsGame} hide={toggleSettingsGame}/>}
            {gameStatus && <div>{gameStatus}</div>}
            {newGame && <button onClick={onClickNewGameHandler}>new Game</button>}
            {!userInfo && <button onClick={startGameHandler}>start game</button>}
            <input type="text" onChange={onChangeHandler} value={gameId}/>
        </div>
    );
};

export default TikTakToe;

