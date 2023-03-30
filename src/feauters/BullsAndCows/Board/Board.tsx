import React from "react";
import s from "./Board.module.scss"
import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {useFormik} from "formik";

interface BoardProps {
    squares: (number | null)[];
    onClick: (digits: number[]) => void;
    status?: string
    userInfo: any
    myMove: boolean
    newGame: any,
    preparation: any
    preparationGameHandler: (digits: number[]) => void
}

const Board: React.FC<BoardProps> = ({preparationGameHandler, onClick, myMove, newGame, preparation}) => {

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
            if (!values.digit1 || !values.digit2 || !values.digit3 || !values.digit4) {
                errors.general = 'Digit Required'
            }
            const digits = [
                values.digit1,
                values.digit2,
                values.digit3,
                values.digit4,
            ]

            if (new Set(digits).size !== 4) {
                errors.general = "Numbers must not be repeated";
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

            // const data = {
            //     gameId: userInfo.gameId,
            //     gameName: userInfo.gameName,
            //     userMove: userName,
            //     board: newArr
            // }
            // if(ws){
            //     console.log(data)
            //     // ws.emit('make-move', data)
            // }
            // console.log(values)
            formik.resetForm()
        },
    })

    return (
        <form onSubmit={formik.handleSubmit} className={s.board}>
            <div className={s.boardRow}>
                <input
                    placeholder="digit1"
                    name={"digit1"}
                    value={formik.values.digit1}
                    onChange={formik.handleChange}
                    className={s.input}
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
                    placeholder="digit2"
                    name={"digit2"}
                    value={formik.values.digit2}
                    onChange={formik.handleChange}
                    className={s.input}
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
                    placeholder="digit3"
                    name={"digit3"}
                    className={s.input}
                    value={formik.values.digit3}
                    onChange={formik.handleChange}
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
                    placeholder="digit4"
                    name={"digit4"}
                    value={formik.values.digit4}
                    onChange={formik.handleChange}
                    className={s.input}
                />
            </div>
            {formik.touched.digit1 && formik.touched.digit2 && formik.touched.digit3 && formik.touched.digit4 && formik.errors.general &&
                <div style={{color: "red"}}>{formik.errors.general}</div>}
            {/*<button type="submit">Отправить</button>*/}
            {preparation && <button type="submit">Submit your number</button>}
            {myMove && !newGame && <button type="submit">send numbers</button>}
        </form>
    );
};

export default Board;
