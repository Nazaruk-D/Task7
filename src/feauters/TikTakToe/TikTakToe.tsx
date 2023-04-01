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
import {UserInfoType, UserType} from "../../common/types/UserTypes";
import Board from "./Board/Board";
import SettingsTikTakToe from "./SettingsTikTakToe/SettingsTikTakToe";
import {startGameHandler} from "../../utils/startGameHandler";
import {setUserId} from "../../store/reducers/app-reducer";
import GameStatus from "../../common/component/GameStatus/GameStatus";
import Timer from "../../common/component/Timer/Timer";
import OpponentName from "../../common/component/OpponentName/OpponentName";
import opponentName from "../../common/component/OpponentName/OpponentName";
import {timeIsOver} from "../../utils/timeIsOver";
import {RulesType} from "../../common/types/RulesType";


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
    const [gameStatus, setGameStatus] = useState("You can select a room number in the settings to play with a friend.")
    const [newGame, setNewGame] = useState(false)
    const [opponentName, setOpponentName] = useState("")
    const [myMove, setMyMove] = useState(false);
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
            setHistory([{squares: Array(9).fill(null)}])
            setStepNumber(0)
            setUserInfo(null)
            setNewGame(false)
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
            playerId: data.playerId,
            message: data.message
        };
        setUserInfo(updatedInfo);
        if (updatedInfo.board) {
            setHistory(prevHistory => [...prevHistory, {squares: updatedInfo.board}]);
            setStepNumber(prevStepNumber => prevStepNumber + 1);
            if (data.userMoveId === userId) {
                setXIsNext(!xIsNext);
                setMyMove(true)
                setGameStatus("Your turn")
            } else {
                setMyMove(false)
                setGameStatus("Opponent turn")
            }
        }
        if (updatedInfo.winner) {
            setNewGame(true)
            setMyMove(false)
            if (data.winner === "Draw") {
                setGameStatus(`Draw!`)
            } else if (data.userMoveId !== userId) {
                data.message ? setGameStatus(`You win, ${data.message}`) : setGameStatus(`You win!`)
            } else {
                setGameStatus(`You lose`)
            }
        }
    }, [userInfo, setUserInfo, setHistory, setStepNumber, userId, xIsNext]);

    useEffect(() => {
        if (!ws) {
            // const socket = io('http://localhost:8080');
            const socket = io('wss://task7-9809.onrender.com');
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
                console.log(data)
                setGameStatus(`Join game failed, ${data}`)
            });
            ws.on('start-game', (data: any) => {
                setUserInfo(data)
                const opponentData = data.players.find( (p: UserType) => p.id !== userId)
                setOpponentName(opponentData.name)
                if (data.userMoveId === userId) {
                    setMyMove(true)
                    setGameStatus("Game start, your turn")
                } else {
                    setMyMove(false)
                    setGameStatus('Game start, opponent turn')
                }
            });
            ws.on('game-over-timer', (data: any) => {
                setNewGame(true)
                setMyMove(false)
                if (data.winner.id === userId) {
                    setGameStatus("You won on time")
                } else {
                    setGameStatus("Time is up, you're out of time")
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

    const rules: RulesType = {
        title: "Tic Tac Toe is a two-player game played on a 3x3 square grid.",
        enumRules: [
            "Players take turns placing their symbols (one player places Xs, the other places Os) on empty squares on the grid.",
            "The player who places Xs goes first.",
            "The goal of the game is to get three of your symbols in a row (horizontally, vertically, or diagonally) or to fill all the squares on the grid without getting three in a row.",
            "If a player succeeds in getting three symbols in a row, they win the game.",
            "If all the squares are filled and no player has three in a row, the game is a tie.",
            "The player who first gets three symbols in a row or fills all the squares on the grid is declared the winner."
        ]
    }

    return (
        <div className={s.tikTakToeContainer}>
            <BackToMainMenu ws={ws}/>
            <Settings onClick={toggleSettingsGame}/>
            <Timer time={30} onTimerEnd={() => timeIsOver(userId, ws!, userInfo!)} myMove={!myMove}/>
            <GameStatus gameStatus={gameStatus}/>
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
            <OpponentName opponentName={opponentName}/>
            {settingsGame && <SettingsGame setModalActive={toggleSettingsGame}
                                           hide={toggleSettingsGame}
                                           onChangeHandler={onChangeHandler}
                                            rules={rules}
            />}
        </div>
    );
};

export default TikTakToe;

