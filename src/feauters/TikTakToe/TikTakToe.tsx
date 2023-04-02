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
import {timeIsOver} from "../../utils/timeIsOver";
import {Status} from "../../enums/GameStatus";
import {Game} from "../../enums/GameNames";
import {Rules} from "../../enums/Rules";
import {WS} from "../../enums/Ws";


const TikTakToe = () => {
    const userName = useAppSelector(selectorNameUser)
    const userId = useAppSelector(selectorUserId)
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [history, setHistory] = useState<string[] | any[]>([{squares: Array(9).fill(null)}]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [ws, setWs] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfoType | null>(null)
    const [gameStatus, setGameStatus] = useState<string>(Status.Starting_Value)
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
        startGameHandler(Game.Tik_Tak_Toe, userName, ws!)
    }

    const onChangeHandler = (value: string) => {
        if (value && ws) {
            setHistory([{squares: Array(9).fill(null)}])
            setStepNumber(0)
            setUserInfo(null)
            setNewGame(false)
            startGameHandler(Game.Tik_Tak_Toe, userName, ws, Number(value))
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
                }
                ws.emit(WS.Make_Move, data)
            }
        }
    };

    const handleUpdateGameState = useCallback((data: UserInfoType) => {
        const {board, userMoveId, gameId, gameName, winner, message} = data
        const updatedInfo = {...userInfo, board, userMoveId, gameId, gameName, winner};
        setUserInfo(updatedInfo);
        if (updatedInfo.board) {
            setHistory(prevHistory => [...prevHistory, {squares: board}]);
            setStepNumber(prevStepNumber => prevStepNumber + 1);
            if (userMoveId === userId) {
                setXIsNext(!xIsNext);
                setMyMove(true)
                setGameStatus(Status.Your_Turn)
            } else {
                setMyMove(false)
                setGameStatus(Status.Opponent_Turn)
            }
        }
        if (updatedInfo.winner) {
            setNewGame(true)
            setMyMove(false)
            if (winner === Status.Draw) {
                setGameStatus(Status.Draw)
            } else if (data.userMoveId !== userId) {
                message ? setGameStatus(`${Status.Win}, ${message}`) : setGameStatus(`${Status.Win}!`)
            } else {
                setGameStatus(Status.Lose)
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
            ws.on(WS.Connect, () => {
                console.log('Connected to server');
                if (userName) {
                    ws.emit(WS.Set_Name, userName)
                }
            });
            ws.on(WS.User_ID, (data: string) => {
                dispatch(setUserId(data))
            });
            ws.on(WS.Join_Success, (data: UserInfoType) => {
                setGameStatus(`${Status.Successfully_Connect} ${data.gameId}`)
                setUserInfo(data)
            });

            ws.on(WS.Join_Failed, (data: string) => {
                console.log(data)
                setGameStatus(`${Status.Join_Failed}, ${data}`)
            });
            ws.on(WS.Start_Game, (data: UserInfoType) => {
                setUserInfo(data)
                const opponentData = data.players!.find( (p: UserType) => p.id !== userId)
                setOpponentName(opponentData!.name)
                if (data.userMoveId === userId) {
                    setMyMove(true)
                    setGameStatus(`${Status.Start}, ${Status.Your_Turn}`)
                } else {
                    setMyMove(false)
                    setGameStatus(`${Status.Start}, ${Status.Opponent_Turn}`)
                }
            });
            ws.on(WS.Game_Over_Timer, (data: {winner: UserType}) => {
                setNewGame(true)
                setMyMove(false)
                if (data.winner.id === userId) {
                    setGameStatus(Status.Won_On_Time)
                } else {
                    setGameStatus(Status.Lost_On_Time)
                }
            });
        }
    }, [ws, userName, history, userId]);

    useEffect(() => {
        if (ws) {
            ws.on(WS.Update_State, handleUpdateGameState);
            return () => {
                ws.off(WS.Update_State, handleUpdateGameState);
            }
        }
    }, [handleUpdateGameState, ws]);

    useEffect(() => {
        if (ws) {
            ws.on(WS.Game_Over, handleUpdateGameState);
            return () => {
                ws.off(WS.Game_Over, handleUpdateGameState);
            }
        }
    }, [handleUpdateGameState, ws]);


    useEffect(() => {
        if (!userName) navigate(routes.login)
    }, [userName, navigate])

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
                               startGameHandler={() => startGameHandler(Game.Tik_Tak_Toe, userName, ws!)}
                               onClickNewGameHandler={onClickNewGameHandler}/>
            <OpponentName opponentName={opponentName}/>
            {settingsGame && <SettingsGame setModalActive={toggleSettingsGame}
                                           hide={toggleSettingsGame}
                                           onChangeHandler={onChangeHandler}
                                            rules={Rules[Game.Tik_Tak_Toe]}
            />}
        </div>
    );
};

export default TikTakToe;

