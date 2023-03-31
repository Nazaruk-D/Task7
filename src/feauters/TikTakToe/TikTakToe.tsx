import React, {useCallback, useEffect, useState} from "react";
import s from "./TikTakToe.module.scss"
import io, {Socket} from 'socket.io-client';
import {useAppDispatch, useAppSelector} from "../../store/store";
import {selectorNameUser, selectorUserId} from "../../store/selector/selectorApp";
import {routes} from "../../routes/routes";
import {useNavigate} from "react-router-dom";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {useModal} from "../../common/component/SendFormModal/useModal";
import SettingsGame from "../../common/component/SendFormModal/SettingsGame/SettingsGame";
import {BackToMainMenu} from "../../common/component/BackToMainMenu/BackToMainMenu";
import Settings from "../../common/component/Settings/Settings";
import {UserInfoType} from "../../common/types/UserTypes";
import Board from "./Board/Board";
import SettingsTikTakToe from "./SettingsTikTakToe/SettingsTikTakToe";
import {startGameHandler} from "../../utils/startGameHandler";
import {setUserId} from "../../store/reducers/app-reducer";


const TikTakToe = () => {
    const userName = useAppSelector(selectorNameUser)
    const userId = useAppSelector(selectorUserId)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [history, setHistory] = useState([{squares: Array(9).fill(null)}]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [ws, setWs] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfoType | null>(null)
    const [gameStatus, setGameStatus] = useState("")
    const [newGame, setNewGame] = useState(false)
    const {settingsGame, toggleSettingsGame} = useModal()

    const current = history[stepNumber];

    const onClickNewGameHandler = () => {
        setHistory([{squares: Array(9).fill(null)}])
        setStepNumber(0)
        setUserInfo(null)
        setNewGame(false)
        startGameHandler("tikTakToe", userName, ws!)
    }

    const onChangeHandler = (value: string) => {
        if (value && ws) {
            startGameHandler("tikTakToe", userName, ws, Number(value))
        }
    }

    const handleClick = (i: number) => {
        if (ws && userInfo && userInfo.userMoveId === userId && !newGame) {
            const newHistory = history.slice(0, stepNumber + 1);
            const currentSquares = newHistory[newHistory.length - 1].squares.slice();
            if (!currentSquares[i]) {
                currentSquares[i] = xIsNext ? "X" : "O";
                setXIsNext(!xIsNext);
                const data = {
                    gameId: userInfo.gameId,
                    gameName: userInfo.gameName,
                    userMove: userName,
                    board: currentSquares,
                    stepNumber: stepNumber,
                    playerId: userInfo.playerId
                }
                ws.emit('make-move', data)
            }
        }
    };

    const handleUpdateGameState = useCallback((data: UserInfoType) => {
        const updatedInfo = {
            ...userInfo,
            board: data.board,
            userMoveId: data.userMoveId,
            gameId: data.gameId,
            gameName: data.gameName,
            winner: data.winner,
            playerId: data.playerId
        };
        setUserInfo(updatedInfo);
        if (updatedInfo.board) {
            setHistory(prevHistory => [...prevHistory, {squares: updatedInfo.board}]);
            setStepNumber(prevStepNumber => prevStepNumber + 1);
            if (data.userMoveId === userId) {
                setXIsNext(!xIsNext);
                setGameStatus("Your turn")
            } else {
                setGameStatus("Opponent turn")
            }
        }
        if (updatedInfo.winner) {
            setNewGame(true)
            if (data.winner === "Draw") {
                setGameStatus(`Draw!`)
            } else if (data.userMoveId !== userId) {
                setGameStatus(`You win!`)
            } else {
                setGameStatus(`You lose`)
            }
        }
    }, [userInfo, setUserInfo, setHistory, setStepNumber, userId, xIsNext]);

    useEffect(() => {
        if (!ws) {
            const socket = io('http://localhost:8080');
            // const socket = io('wss://task7-9809.onrender.com');
            setWs(socket);
        }
        return () => {
            ws?.disconnect();
        };
    }, [])


    useEffect(() => {
        if (ws) {
            ws.on('connect', () => {
                console.log('Connected to server');
                if (userName) {
                    ws.emit('set-name', userName)
                }
            });
            ws.on('user-id', (data: string) => {
                dispatch(setUserId(data))
            });
            ws.on('message', (data: any) => {
                console.log('Message received from server:', data);
            });
            ws.on('disconnect', () => {
                console.log('Disconnected from server');
            });
            ws.on('join-game-success', (data: any) => {
                setGameStatus(`Successfully connected to the game, room number ${data.gameId}`)
                setUserInfo(data)
            });

            ws.on('join-game-failed', (data: any) => {
                setGameStatus(`Join game failed, ${data.gameId}`)
            });
            ws.on('start-game', (data: any) => {
                setUserInfo(data)
                if (data.userMoveId === userId) {
                    setGameStatus("Game start, your turn")
                } else {
                    setGameStatus('Game start, opponent turn')
                }
            });
        }
    }, [ws, userName, history, userId]);

    useEffect(() => {
        if (ws) {
            ws.on('update-game-state', handleUpdateGameState);
            return () => {
                ws.off('update-game-state', handleUpdateGameState);
            }
        }
    }, [handleUpdateGameState, ws]);

    useEffect(() => {
        if (ws) {
            ws.on('game-over', handleUpdateGameState);
            return () => {
                ws.off('game-over', handleUpdateGameState);
            }
        }
    }, [handleUpdateGameState, ws]);

    useEffect(() => {
        if (!userName) navigate(routes.login)
    }, [userName, navigate])

    return (
        <div className={s.tikTakToeContainer}>
            <BackToMainMenu/>
            <Settings onClick={toggleSettingsGame}/>
            <Board squares={current.squares}
                   onClick={handleClick}
                   ws={ws}
                   userName={userName}
                   userInfo={userInfo}
            />
            <SettingsTikTakToe newGame={newGame}
                               userInfo={userInfo}
                               gameStatus={gameStatus}
                               startGameHandler={() => startGameHandler("tikTakToe", userName, ws!)}
                               onClickNewGameHandler={onClickNewGameHandler}/>
            {settingsGame && <SettingsGame setModalActive={toggleSettingsGame}
                                           hide={toggleSettingsGame}
                                           onChangeHandler={onChangeHandler}/>}
        </div>
    );
};

export default TikTakToe;

