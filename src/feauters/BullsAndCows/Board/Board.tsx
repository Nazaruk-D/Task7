import React from "react";
import s from "./Board.module.scss"
import {useFormik} from "formik";
import Button from "../../../common/component/Button/Button";
import {UserInfoType} from "../../../common/types/UserTypes";

interface BoardProps {
    onClick: (digits: number[]) => void;
    myMove: boolean
    newGame: any,
    preparation: any
    yourNumber: number[] | null
    preparationGameHandler: (digits: number[]) => void
    onClickNewGameHandler: () => void
    startGameHandler: () => void
    userInfo: UserInfoType | null
    opponent: string
}

const Board: React.FC<BoardProps> = ({preparationGameHandler, onClick, myMove, newGame, preparation, yourNumber, opponent, startGameHandler, onClickNewGameHandler, userInfo}) => {

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
            formik.resetForm()
        },
    })

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const input = e.target as HTMLInputElement;
        if (+e.key >= 0 && +e.key <= 9) {
            formik.setFieldValue(input.name, e.key);
            const nextInput = input.nextElementSibling as HTMLInputElement | null;
            if (nextInput) {
                nextInput.focus();
            }
            e.preventDefault();
        }
    };

    return (
        <form onSubmit={formik.handleSubmit} className={s.board}>
            <div className={s.infoBlock}>
                <div>Your opponent: {opponent}</div>
                {yourNumber && <div className={s.yourNumber}>Your number: {yourNumber}</div>}
            </div>
            <div className={s.boardRow}>
                <input
                    placeholder="digit1"
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
                    placeholder="digit2"
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
                    placeholder="digit3"
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
                    placeholder="digit4"
                    name={"digit4"}
                    maxLength={1}
                    autoComplete={"off"}
                    value={formik.values.digit4}
                    onChange={formik.handleChange}
                    onKeyDown={handleKeyDown}
                    className={s.input}
                />
            </div>
            {formik.touched.digit1 && formik.touched.digit2 && formik.touched.digit3 && formik.touched.digit4 && formik.errors.general &&
                <div style={{color: "red"}}>{formik.errors.general}</div>}
            <div className={s.buttonBlock}>
                {preparation && <Button>Submit your number</Button>}
                {myMove && !newGame && <Button>send numbers</Button>}
                {newGame && <Button onClick={onClickNewGameHandler}>New Game</Button>}
                {!userInfo&& <Button onClick={startGameHandler}>Start game</Button>}
            </div>
        </form>
    );
};

export default Board;
