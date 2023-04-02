import React, {useCallback, useEffect, useState} from 'react';
import s from "./BullsAndCows.module.scss"
import {useNavigate} from "react-router-dom";
import {routes} from "../../routes/routes";
import {BackToMainMenu} from "../../common/component/BackToMainMenu/BackToMainMenu";
import Settings from "../../common/component/Settings/Settings";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {selectorNameUser, selectorUserId} from "../../store/selector/selectorApp";
import io, {Socket} from "socket.io-client";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {UserInfoType, UserType} from "../../common/types/UserTypes";
import Board from "./Board/Board";
import SettingsBullAndCows from "./SettingsBullAndCows/SettingsBullAndCows";
import {useModal} from "../../common/component/SendFormModal/useModal";
import SettingsGame from "../../common/component/SendFormModal/SettingsGame/SettingsGame";
import {startGameHandler} from "../../utils/startGameHandler";
import {setUserId} from "../../store/reducers/app-reducer";
import OpponentName from "../../common/component/OpponentName/OpponentName";
import YourNumber from "../../common/component/YourNumber/YourNumber";
import {Rules} from "../../enums/Rules";
import {Game} from "../../enums/GameNames";
import {Status} from "../../enums/GameStatus";
import {WS} from "../../enums/Ws";

export type HistoryItemType = {
    squares: number[] | null[];
    userMove: string;
    bulls: number | null;
    cows: number | null;
    userMoveId?: string
}

const BullsAndCows = () => {
    const userName = useAppSelector(selectorNameUser)
    const userId = useAppSelector(selectorUserId)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [history, setHistory] = useState<UserInfoType[]>([{squares: Array(4).fill(null), bulls: null, cows: null}]);
    const [myMove, setMyMove] = useState(false);
    const [ws, setWs] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfoType | null>(null)
    const [gameStatus, setGameStatus] = useState<string>(Status.Starting_Value)
    const [newGame, setNewGame] = useState(false)
    const [opponentName, setOpponentName] = useState("")
    const [preparation, setPreparation] = useState(false)
    const [yourNumber, setYourNumber] = useState<number[] | null>(null)
    const {settingsGame, toggleSettingsGame} = useModal()

    const myMoves = history.filter(move => move.userMoveId !== userId);
    const opponentMoves = history.filter(move => move.userMoveId === userId);

    const onClickNewGameHandler = () => {
        setHistory([{board: Array(4).fill(null), bulls: null, cows: null}])
        setUserInfo(null)
        setNewGame(false)
        setYourNumber(null)
        startGameHandler(Game.Bulls_And_Cows, userName, ws!)
    }

    const onChangeHandler = (value: string) => {
        if (value && ws) {
            setHistory([{board: Array(4).fill(null), bulls: null, cows: null}])
            setUserInfo(null)
            setNewGame(false)
            setYourNumber(null)
            startGameHandler(Game.Bulls_And_Cows, userName, ws, Number(value))
        }
    }

    const handleClick = (digits: number[]) => {
        if (ws && userInfo) {
            const data = {
                gameId: userInfo.gameId,
                userMove: userName,
                gameName: userInfo.gameName,
                board: digits,
            }
            ws.emit(WS.Make_Move, data)
        }
    };

    const handleUpdateGameState = useCallback((data: UserInfoType) => {
        const {bulls, cows, board, userMoveId, gameId, gameName, winner, message} = data
        const updatedInfo = {...userInfo, board, userMoveId, gameId, gameName, winner};
        setUserInfo(updatedInfo);
        if (updatedInfo) {
            const newInfo = {board, userMoveId, bulls, cows}
            setHistory(prevHistory => [...prevHistory, newInfo]);
            if (userMoveId !== userId) {
                setMyMove(false)
                setGameStatus(Status.Opponent_Turn)
            } else {
                setMyMove(true)
                setGameStatus(Status.Your_Turn)
            }
        }
        if (updatedInfo.winner) {
            setNewGame(true)
            setMyMove(false)
            if (userMoveId !== userId) {
                message ? setGameStatus(`${Status.Win}, ${message}`) : setGameStatus(`${Status.Win}!`)
            } else {
                setGameStatus(`${Status.Lose}`)
            }
        }
    }, [userInfo, setUserInfo, setHistory, userId]);

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
            ws.on(WS.Start_Game, (data: UserInfoType) => {
                setPreparation(true)
                setUserInfo(data)
                const opponentData = data.players!.find((p: UserType) => p.id !== userId)
                setOpponentName(opponentData!.name)
                setGameStatus(`${Status.Start}, ${Status.Choose_A_Number}`)
            });
            ws.on(WS.Join_Success, (data: UserInfoType) => {
                setGameStatus(`${Status.Successfully_Connect} ${data.gameId}`)
                setUserInfo(data)
            });

            ws.on(WS.Join_Failed, (data: string) => {
                setGameStatus(`${Status.Join_Failed}, ${data}`)
            });
            ws.on(WS.Preparation, () => {
                setMyMove(true)
                setGameStatus(Status.Choose_Number)
            });
            ws.on(WS.Start_Move, (data: UserInfoType) => {
                setUserInfo(data)
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
            ws.on(WS.Check_Number_Result, handleUpdateGameState);
            return () => {
                ws.off(WS.Check_Number_Result, handleUpdateGameState);
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

    const preparationGameHandler = (yourNumber: number[]) => {
        if (ws && userInfo && userName && yourNumber) {
            const data = {
                gameName: userInfo.gameName,
                gameId: userInfo.gameId,
                userMoveId: userInfo.userMoveId,
                playerName: userName,
                number: yourNumber
            };
            ws.emit(WS.Game_Preparation, data)
            setPreparation(false)
            setYourNumber(yourNumber)
        }
    }

    return (
        <div className={s.bullsAndCowsContainer}>
            <BackToMainMenu ws={ws}/>
            <Settings onClick={toggleSettingsGame}/>
            <Board onClick={handleClick}
                   myMove={myMove}
                   newGame={newGame}
                   preparation={preparation}
                   preparationGameHandler={preparationGameHandler}
                   onClickNewGameHandler={onClickNewGameHandler}
                   startGameHandler={() => startGameHandler(Game.Bulls_And_Cows, userName, ws!)}
                   userInfo={userInfo}
                   gameStatus={gameStatus}
                   ws={ws!}
                   userId={userId}
            />
            <SettingsBullAndCows gameStatus={gameStatus}
                                 myMoves={myMoves}
                                 opponentMoves={opponentMoves}
            />
            <OpponentName opponentName={opponentName}/>
            <YourNumber yourNumber={yourNumber}/>
            {settingsGame && <SettingsGame setModalActive={toggleSettingsGame} hide={toggleSettingsGame}
                                           onChangeHandler={onChangeHandler} rules={Rules[Game.Bulls_And_Cows]}/>}
        </div>
    );
};

export default BullsAndCows;