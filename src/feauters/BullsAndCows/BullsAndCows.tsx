import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import s from "./BullsAndCows.module.scss"
import {useNavigate} from "react-router-dom";
import {routes} from "../../routes/routes";
import {BackToMainMenu} from "../../common/component/BackToMainMenu/BackToMainMenu";
import Settings from "../../common/component/Settings/Settings";
import {useAppSelector} from "../../store/store";
import {selectorNameUser} from "../../store/selector/selectorApp";
import io, {Socket} from "socket.io-client";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {UserInfoType} from "../../common/types/UserTypes";
import Board from "./Board/Board";
import SettingsBullAndCows from "./SettingsBullAndCows/SettingsBullAndCows";
import {useModal} from "../../common/component/SendFormModal/useModal";
import SettingsGame from "../../common/component/SendFormModal/SettingsGame/SettingsGame";

export type HistoryItemType = {
    squares: number[] | null[];
    userMove: string;
    bulls: number | null;
    cows: number | null;
}

const BullsAndCows = () => {

    const userName = useAppSelector(selectorNameUser)
    const navigate = useNavigate()

    const [history, setHistory] = useState<HistoryItemType[]>([{
        squares: Array(4).fill(null),
        userMove: "",
        bulls: null,
        cows: null
    }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [myMove, setMyMove] = useState(false);
    const [ws, setWs] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfoType | null>(null)
    const [gameStatus, setGameStatus] = useState("You can select a room number in the settings to play with a friend.")
    const [newGame, setNewGame] = useState(false)
    const [lastPlayer, setLastPlayer] = useState<string | null>(null);
    const [result, setResult] = useState("")
    const [result2, setResult2] = useState("")
    const [preparation, setPreparation] = useState(false)
    const [yourNumber, setYourNumber] = useState<number[] | null>(null)


    const myMoves = history.filter(move => move.userMove === userName);
    const opponentMoves = history.filter(move => move.userMove !== userName);
    const current = history[stepNumber];


    const onClickNewGameHandler = () => {
        setHistory([{squares: Array(4).fill(null), userMove: "", bulls: null, cows: null}])
        setStepNumber(0)
        setUserInfo(null)
        setNewGame(false)
        startGameHandler()
        setYourNumber(null)
    }


    const handleClick = (digits: number[]) => {
        if (ws && userInfo) {
            setLastPlayer(userName);
            const data = {
                gameId: userInfo.gameId,
                userMove: userName,
                gameName: userInfo.gameName,
                board: digits
            }
            ws.emit('make-move', data)
        }
    };

    const handleUpdateGameState = useCallback((data: UserInfoType) => {
        const updatedInfo = {
            ...userInfo,
            board: data.board,
            userMove: data.userMove,
            gameId: data.gameId,
            gameName: data.gameName
        };
        const {bulls, cows} = data
        setUserInfo(updatedInfo);
        if (updatedInfo) {
            console.log("userMove: ", data.userMove)
            const newInfo: HistoryItemType = {
                squares: updatedInfo.board,
                userMove: data.userMove || "",
                bulls: bulls || null,
                cows: cows || null
            }
            setHistory(prevHistory => [...prevHistory, newInfo]);
            setStepNumber(prevStepNumber => prevStepNumber + 1);
            if (data.userMove === userName) {
                setResult(updatedInfo.board)
                setXIsNext(!xIsNext);
                setMyMove(false)
                setGameStatus("Opponent try")
            } else {
                setResult2(updatedInfo.board)
                setMyMove(true)
                setGameStatus('Your try')
            }
        }
    }, [userInfo, setUserInfo, setHistory, setStepNumber, userName]);

    useEffect(() => {
        if (!ws) {
            const socket = io('http://localhost:8080');
            setWs(socket);
        }
        return () => {
            ws?.disconnect();
        };
    }, [])

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
                console.log("STAAART GAME DATA: ", data)
                setPreparation(true)
                setUserInfo(data)
                setGameStatus("Game start, Choose a number according to the rules of the game")
            });

            ws.on('game-preparation', (data: any) => {
                console.log("PREPARATION: ", data)
                setMyMove(true)
                setGameStatus("Choose your number")
            });

            ws.on('start-game-move', (data: any) => {
                console.log("S ETOGO MY NACHINAEM ", data)
                setUserInfo(data)
                if (data.userMove === userName) {
                    setMyMove(true)
                    setGameStatus("Your try")
                } else {
                    setMyMove(false)
                    setGameStatus('Opponent try')
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
                setGameStatus(`Winner ${data.userMove}`)
                setNewGame(true)
            })
        }
    }, [ws, userName, history]);

    useEffect(() => {
        if (!userName) navigate(routes.login)
    }, [userName, navigate])

    const preparationGameHandler = (yourNumber: number[]) => {
        if (ws && userInfo && userName && yourNumber) {
            const data = {
                gameName: userInfo.gameName,
                gameId: userInfo.gameId,
                userMove: userInfo.userMove,
                playerName: userName,
                number: yourNumber
            };
            ws.emit('game-preparation', data)
            setPreparation(false)
            setYourNumber(yourNumber)
            console.log("setYourNumber: ", yourNumber)
        }
    }

    const startGameHandler = (roomNumber?: number) => {
        if (ws && userName) {
            if (roomNumber) {
                const data = {
                    gameName: "bullsAndCows",
                    gameId: roomNumber,
                    playerName: userName
                };
                ws.emit('join-game', data)
            } else {
                const data = {
                    gameName: "bullsAndCows",
                    gameId: "new room",
                    playerName: userName
                };
                ws.emit('join-game', data)
            }
        }
    }
    const {settingsGame, toggleSettingsGame} = useModal()

    const onChangeHandler = (value: string) => {
        if (value) {
            startGameHandler(Number(value))
        }
    }

    return (
        <div className={s.bullsAndCowsContainer}>
            <BackToMainMenu/>
            <Settings onClick={toggleSettingsGame}/>
            <Board onClick={handleClick}
                   myMove={myMove}
                   newGame={newGame}
                   preparation={preparation}
                   yourNumber={yourNumber}
                   preparationGameHandler={preparationGameHandler}
            />
            <SettingsBullAndCows gameStatus={gameStatus}
                                 newGame={newGame}
                                 myMoves={myMoves}
                                 opponentMoves={opponentMoves}
                                 onClickNewGameHandler={onClickNewGameHandler}
                                 startGameHandler={startGameHandler}
                                 userInfo={userInfo}
            />
            {settingsGame && <SettingsGame setModalActive={toggleSettingsGame} hide={toggleSettingsGame} onChangeHandler={onChangeHandler}/>}
        </div>
    );
};

export default BullsAndCows;