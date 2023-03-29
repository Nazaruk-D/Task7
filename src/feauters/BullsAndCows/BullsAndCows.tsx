import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
import s from "./BullsAndCows.module.scss"
import {Link, useNavigate} from "react-router-dom";
import {routes} from "../../routes/routes";
import {BackToMainMenu} from "../../common/component/BackToMainMenu/BackToMainMenu";
import Settings from "../../common/component/Settings/Settings";
import SettingsGame from "../../common/component/SendFormModal/SettingsGame/SettingsGame";
import {useAppSelector} from "../../store/store";
import {selectorNameUser} from "../../store/selector/selectorApp";
import io, {Socket} from "socket.io-client";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {UserInfoType} from "../../common/types/UserTypes";
import {useModal} from "../../common/component/SendFormModal/useModal";
import {calculateWinner} from "../../utils/calculateWinner-utils";
import Board from "./Board/Board";

type HistoryItemType = {
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
    const [gameId, setGameId] = useState<number | "">("")
    const [result, setResult] = useState("")
    const [result2, setResult2] = useState("")
    const [preparation, setPreparation] = useState(false)
    const [yourNumber, setYourNumber] = useState<number[] | null>(null)
    const {settingsGame, toggleSettingsGame} = useModal()
    // const [myMoves, setMyMoves] = useState<number[][]>([])
    // const [opponentMoves, setOpponentMoves] = useState<number[][]>([])


    const myMoves = history.filter(move => move.userMove === userName);
    const opponentMoves = history.filter(move => move.userMove !== userName);
    console.log(history)
    const current = history[stepNumber];


    const onClickNewGameHandler = () => {
        setHistory([{squares: Array(4).fill(null), userMove: "", bulls: null, cows: null}])
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


    const handleClick = (digits: number[]) => {
        // console.log("POPAL V HANDLE")
        // console.log(userInfo)
        // console.log(userInfo!.userMove)
        // console.log(userName)
        if (ws && userInfo) {
            const newHistory = history.slice(0, stepNumber + 1);
            setLastPlayer(userName);
            const data = {
                gameId: userInfo.gameId,
                userMove: userName,
                gameName: userInfo.gameName,
                board: digits
            }
            console.log("MAKEMOVE:", data)
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
                setGameStatus("Your try")
            } else {
                setResult2(updatedInfo.board)
                setMyMove(true)
                setGameStatus('Opponent try')
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
                // if (data.userMove === userName) {
                // setMyMove(true)

                setGameStatus("Game start, Choose a number according to the rules of the game")
                // } else {
                // setMyMove(false)
                // setGameStatus('Game start, opponent write a number for you')
                // }
            });

            ws.on('game-preparation', (data: any) => {
                // setUserInfo(data)
                console.log("PREPARATION: ", data)
                // if (data.userMove === userName) {
                //     console.log("Preparing I")
                // setMyMove(true)
                setMyMove(true)
                setGameStatus("Choose your number")
                // } else {
                //     console.log("Preparing Yeee")
                // setMyMove(false)
                // setGameStatus('Game start, opponent turn')
                // }
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

            // ws.on('check-number-result', (data: any) => {
            //     console.log('check-number-result ', data)
            // });

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

    const startGameHandler = () => {
        if (ws && userName) {
            if (gameId) {
                const data = {
                    gameName: "bullsAndCows",
                    gameId,
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

    return (
        <div className={s.bullsAndCowsContainer}>
            <BackToMainMenu/>
            <Settings onClick={toggleSettingsGame}/>
            {yourNumber && <div>Your number: {yourNumber}</div>}
            <Board squares={current.squares}
                   onClick={handleClick}
                   userInfo={userInfo}
                   myMove={myMove}
                   newGame={newGame}
                   preparation={preparation}
                   preparationGameHandler={preparationGameHandler}
            />
            {gameStatus && <div>{gameStatus}</div>}
            {settingsGame && <SettingsGame setModalActive={toggleSettingsGame} hide={toggleSettingsGame}/>}
            {newGame && <button type="submit" onClick={onClickNewGameHandler}>new Game</button>}
            {!userInfo && <button type="submit" onClick={startGameHandler}>start game</button>}
            {myMoves.length > 0 && <div>
                My moves!!!
                <div>{myMoves.map(m => <div>{m.squares}: bulls: {m.bulls === null ? 0 : m.bulls}, cows: {m.cows === null ? 0 : m.cows}</div>)}</div>
            </div>}
            {opponentMoves.length > 1 && <div>
                Opponents moves!
                <div>{opponentMoves.map(m => <div>{m.squares}: bulls: {m.bulls === null ? 0 : m.bulls}, cows: {m.cows === null ? 0 : m.cows}</div>)}</div>
            </div>}
        </div>
    );
};

export default BullsAndCows;