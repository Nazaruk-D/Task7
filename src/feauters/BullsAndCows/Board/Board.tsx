import React from "react";
import s from "./Board.module.scss"
import {useFormik} from "formik";
import Button from "../../../common/component/Button/Button";
import {UserInfoType} from "../../../common/types/UserTypes";
import Timer from "../../../common/component/Timer/Timer";
import GameStatus from "../../../common/component/GameStatus/GameStatus";
import {timeIsOver} from "../../../utils/timeIsOver";
import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

type BoardPropsType = {
    onClick: (digits: number[]) => void;
    myMove: boolean
    newGame: boolean,
    preparation: boolean
    preparationGameHandler: (digits: number[]) => void
    onClickNewGameHandler: () => void
    startGameHandler: () => void
    userInfo: UserInfoType | null
    gameStatus: string
    userId: string
    ws: Socket<DefaultEventsMap, DefaultEventsMap>
}

const Board: React.FC<BoardPropsType> = ({
                                         gameStatus,
                                         preparationGameHandler,
                                         onClick,
                                         myMove,
                                         newGame,
                                         preparation,
                                         startGameHandler,
                                         onClickNewGameHandler,
                                         userInfo,
                                         userId,
                                         ws
                                     }) => {

    const formik = useFormik({
        initialValues: {
            digit1: "",
            digit2: "",
            digit3: "",
            digit4: "",
            general: ""
        },
        validate: (values) => {
            const errors: { general?: string } = {}
            if (userInfo) {
                if (!values.digit1 || !values.digit2 || !values.digit3 || !values.digit4) {
                    errors.general = 'Digit Required'
                }
            }
            const digits = [
                values.digit1,
                values.digit2,
                values.digit3,
                values.digit4,
            ]
            if (userInfo) {
                if (new Set(digits).size !== 4) {
                    errors.general = "Numbers must not be repeated";
                }
            }
            return errors
        },
        onSubmit: values => {
            const digits = [+values.digit1, +values.digit2, +values.digit3, +values.digit4]
            if (preparation) {
                preparationGameHandler(digits)
            } else {
                onClick(digits)
            }
            formik.resetForm()
        },
    })

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        const keyCode = e.keyCode || e.which;
        const keyValue = String.fromCharCode(keyCode);
        const regex = /^[0-9]*$/;
        if (!regex.test(keyValue)) {
            e.preventDefault();
            return false;
        }
        formik.setFieldValue(input.name, keyValue);
        const nextInput = input.nextElementSibling as HTMLInputElement | null;
        if (nextInput) {
            nextInput.focus();
        }
        e.preventDefault();
    };

    return (
        <form onSubmit={formik.handleSubmit} className={s.board}>
            <Timer time={60} myMove={!myMove} onTimerEnd={() => timeIsOver(userId, ws!, userInfo!)}/>
            <GameStatus gameStatus={gameStatus}/>
            <div className={s.boardRow}>
                <input
                    placeholder={"digit 1"}
                    name={"digit1"}
                    onKeyDown={handleKeyDown}
                    value={formik.values.digit1}
                    onChange={formik.handleChange}
                    className={s.input}
                    autoComplete={"off"}
                    maxLength={1}
                    onInput={(event: React.FormEvent<HTMLInputElement>) => {
                        const input = event.target as HTMLInputElement;
                        if (input.value.length === 1) {
                            const nextInput = input.nextElementSibling as HTMLInputElement | null;
                            if (nextInput) {
                                nextInput.focus();
                            }
                        }
                    }}
                />
                <input
                    placeholder={"digit 2"}
                    name={"digit2"}
                    value={formik.values.digit2}
                    onChange={formik.handleChange}
                    onKeyDown={handleKeyDown}
                    className={s.input}
                    autoComplete={"off"}
                    maxLength={1}
                    onInput={(event: React.FormEvent<HTMLInputElement>) => {
                        const input = event.target as HTMLInputElement;
                        if (input.value.length === 1) {
                            const nextInput = input.nextElementSibling as HTMLInputElement | null;
                            if (nextInput) {
                                nextInput.focus();
                            }
                        }
                    }}
                />
                <input
                    placeholder={"digit 3"}
                    name={"digit3"}
                    className={s.input}
                    value={formik.values.digit3}
                    onChange={formik.handleChange}
                    onKeyDown={handleKeyDown}
                    autoComplete={"off"}
                    maxLength={1}
                    onInput={(event: React.FormEvent<HTMLInputElement>) => {
                        const input = event.target as HTMLInputElement;
                        if (input.value.length === 1) {
                            const nextInput = input.nextElementSibling as HTMLInputElement | null;
                            if (nextInput) {
                                nextInput.focus();
                            }
                        }
                    }}
                />
                <input
                    placeholder={"digit 4"}
                    name={"digit4"}
                    maxLength={1}
                    autoComplete={"off"}
                    value={formik.values.digit4}
                    onChange={formik.handleChange}
                    onKeyDown={handleKeyDown}
                    className={s.input}
                />
            </div>
            <div className={s.errorBlock}>
                {formik.touched.digit1 && formik.touched.digit2 && formik.touched.digit3 && formik.touched.digit4 && formik.errors.general &&
                    <div style={{color: "red"}}>{formik.errors.general}</div>}
            </div>
            <div className={s.buttonBlock}>
                {preparation && !newGame && <Button>Submit your number</Button>}
                {myMove && !newGame && <Button className={s.sendNumber}>Send numbers</Button>}
                {newGame && <Button onClick={onClickNewGameHandler}>New Game</Button>}
                {!userInfo && <Button onClick={startGameHandler}>Start game</Button>}
            </div>
        </form>
    );
};

export default Board;
