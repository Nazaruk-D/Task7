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

const BullsAndCows = () => {

    const userName = useAppSelector(selectorNameUser)
    const navigate = useNavigate()

    const [history, setHistory] = useState([{squares: Array(4).fill(null)}]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [myMove, setMyMove] = useState(true);
    const [ws, setWs] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfoType | null>(null)
    const [gameStatus, setGameStatus] = useState("You can select a room number in the settings to play with a friend.")
    const [newGame, setNewGame] = useState(false)
    const [lastPlayer, setLastPlayer] = useState<string | null>(null);
    const [gameId, setGameId] = useState<number | "">("")
    const [result, setResult] = useState("")
    const [result2, setResult2] = useState("")
    const [preparation, setPreparation] = useState(false)
    const {settingsGame, toggleSettingsGame} = useModal()

    const current = history[stepNumber];


    // useEffect(() => {
    //     const countResult = () => {
    //
    //     }
    //     setResult()
    // }, [history])

    const winner = calculateWinner(current.squares);

    const onClickNewGameHandler = () => {
        setHistory([{squares: Array(4).fill(null)}])
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
        if (ws && userInfo && userInfo.userMove === userName) {
            const newHistory = history.slice(0, stepNumber + 1);
            console.log("history: ", history)
            console.log("newHistory: ", newHistory)
            setLastPlayer(userName);
            // if (winner || currentSquares[i]) {
            if (winner) {
                return;
            }
            // currentSquares[i] = xIsNext ? "X" : "O";
            // console.log("currentSquares: ", currentSquares)
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
        setUserInfo(updatedInfo);
        if (updatedInfo.board) {
            setHistory(prevHistory => [...prevHistory, {squares: updatedInfo.board}]);
            setStepNumber(prevStepNumber => prevStepNumber + 1);
            if (data.userMove === userName) {
                setResult(updatedInfo.board)
                setXIsNext(!xIsNext);
                setMyMove(true)
                setGameStatus("Your turn")
            } else {
                setResult2(updatedInfo.board)
                setMyMove(false)
                setGameStatus("Opponent turn")
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
        if (ws && userInfo && winner) {
            // if (winner) {
            const data = {
                info: `Winner: ${lastPlayer}`,
                gameName: userInfo.gameName,
                gameId: userInfo.gameId,
            };
            ws.emit("game-over", data);
        }
    }, [stepNumber, userInfo, winner, ws]);

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

    const preparationGameHandler = () => {
        if (ws && userInfo && userName) {
            const data = {
                gameName: userInfo.gameName,
                gameId: userInfo.gameId,
                userMove: userInfo.userMove,
                playerName: userName,
                number: [1, 2, 3, 4]
            };
            ws.emit('game-preparation', data)
            setPreparation(false)
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
            <Board squares={current.squares} onClick={handleClick} ws={ws} userName={userName} userInfo={userInfo}/>
            {gameStatus && <div>{gameStatus}</div>}
            {newGame && <button onClick={onClickNewGameHandler}>new Game</button>}
            {/*{preparation*/}
            {/*    ? <button onClick={preparationGameHandler}>Preparation</button>*/}
            {/*    : <button onClick={startGameHandler}>start game</button>*/}
            {/*}*/}
            {preparation && <button onClick={preparationGameHandler}>Preparation</button>}
            {!userInfo && <button onClick={startGameHandler}>start game</button>}
            {gameStatus === "Your try" && <button onClick={() => console.log("Yeap")}>send numbers</button>}

            {/*{!userInfo && <button onClick={startGameHandler}>start game</button>}*/}
            {/*<input type="text" onChange={onChangeHandler} value={gameId}/>*/}
            {settingsGame && <SettingsGame setModalActive={toggleSettingsGame} hide={toggleSettingsGame}/>}
            {result && <div>{history.map((h, i) => myMove
                ? <div key={i}> My move: {h.squares}</div>
                : <div key={i}> Your move: {h.squares}</div>
            )}</div>}
            {/*{result2 && <div>{history.map((h, i) => <div key={i}> Move: {h.squares}</div>)}</div>}*/}
        </div>
    );
};

export default BullsAndCows;