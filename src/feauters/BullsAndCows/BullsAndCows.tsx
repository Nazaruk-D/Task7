import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
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
import Timer from "../../common/component/Timer/Timer";
import OpponentName from "../../common/component/OpponentName/OpponentName";

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

    const [history, setHistory] = useState<HistoryItemType[]>([{
        squares: Array(4).fill(null),
        userMove: "",
        bulls: null,
        cows: null
    }]);
    const [myMove, setMyMove] = useState(false);
    const [ws, setWs] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfoType | null>(null)
    const [gameStatus, setGameStatus] = useState("You can select a room number in the settings to play with a friend.")
    const [newGame, setNewGame] = useState(false)
    const [opponentName, setOpponentName] = useState("")
    const [preparation, setPreparation] = useState(false)
    const [yourNumber, setYourNumber] = useState<number[] | null>(null)
    const {settingsGame, toggleSettingsGame} = useModal()

    const myMoves = history.filter(move => move.userMoveId !== userId);
    const opponentMoves = history.filter(move => move.userMoveId === userId);

    const onClickNewGameHandler = () => {
        setHistory([{squares: Array(4).fill(null), userMove: "", bulls: null, cows: null}])
        setUserInfo(null)
        setNewGame(false)
        setYourNumber(null)
        startGameHandler("bullsAndCows", userName, ws!)
    }

    const onChangeHandler = (value: string) => {
        if (value && ws) {
            setHistory([{squares: Array(4).fill(null), userMove: "", bulls: null, cows: null}])
            setUserInfo(null)
            setNewGame(false)
            setYourNumber(null)
            startGameHandler("bullsAndCows", userName, ws, Number(value))
        }
    }

    const handleClick = (digits: number[]) => {
        if (ws && userInfo) {
            const data = {
                gameId: userInfo.gameId,
                userMove: userName,
                gameName: userInfo.gameName,
                board: digits,
                playerId: userInfo.playerId
            }
            ws.emit('make-move', data)
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
        const {bulls, cows} = data
        setUserInfo(updatedInfo);
        if (updatedInfo) {
            const newInfo: any = {
                squares: updatedInfo.board,
                userMoveId: data.userMoveId || "",
                bulls: bulls || null,
                cows: cows || null
            }
            setHistory(prevHistory => [...prevHistory, newInfo]);
            if (data.userMoveId !== userId) {
                setMyMove(false)
                setGameStatus("Opponent try")
            } else {
                setMyMove(true)
                setGameStatus('Your try')
            }
        }
        if (updatedInfo.winner) {
            setNewGame(true)
            setMyMove(false)
            if (data.userMoveId !== userId) {
                data.message ? setGameStatus(`You win, ${data.message}`) : setGameStatus(`You win!`)
            } else {
                setGameStatus(`You lose`)
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
            ws.on('start-game', (data: any) => {
                setPreparation(true)
                setUserInfo(data)
                const opponentData = data.players.find( (p: UserType) => p.id !== userId)
                setOpponentName(opponentData.name)
                setGameStatus("Game start, Choose a number according to the rules of the game")
            });
            ws.on('join-game-success', (data: any) => {
                setGameStatus(`Successfully connected to the game, room number ${data.gameId}`)
                setUserInfo(data)
            });

            ws.on('join-game-failed', (data: any) => {
                setGameStatus(`Join game failed, ${data}`)
            });
            ws.on('game-preparation', (data: any) => {
                setMyMove(true)
                setGameStatus("Choose your number")
            });
            ws.on('start-game-move', (data: any) => {
                setUserInfo(data)
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
            ws.on('check-number-result', handleUpdateGameState);
            return () => {
                ws.off('check-number-result', handleUpdateGameState);
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

    const preparationGameHandler = (yourNumber: number[]) => {
        if (ws && userInfo && userName && yourNumber) {
            const data = {
                gameName: userInfo.gameName,
                gameId: userInfo.gameId,
                userMoveId: userInfo.userMoveId,
                playerName: userName,
                number: yourNumber
            };
            ws.emit('game-preparation', data)
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
                   startGameHandler={() => startGameHandler("bullsAndCows", userName, ws!)}
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
            {yourNumber && <div className={s.yourNumber}>Your number: {yourNumber}</div>}
            {settingsGame && <SettingsGame setModalActive={toggleSettingsGame} hide={toggleSettingsGame} onChangeHandler={onChangeHandler}/>}
        </div>
    );
};

export default BullsAndCows;