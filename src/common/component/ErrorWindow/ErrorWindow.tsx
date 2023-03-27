import React, {useEffect, useState} from 'react';
import s from "./ErrorWindow.module.scss"
import {useAppDispatch, useAppSelector} from "../../../store/store";
import {selectorError} from "../../../store/selector/selectorApp";
import {setAppErrorAC} from "../../../store/reducers/app-reducer";

const ErrorWindow = () => {
    const dispatch = useAppDispatch()
    const error = useAppSelector(selectorError)
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (error) {
            setMessage(error)
            const timer = setTimeout(() => {
                dispatch(setAppErrorAC({message: null}))
                setMessage("")
            }, 3000)
            return () => clearTimeout(timer);
        }
    }, [error, dispatch])

    return (
        <div className={error ? s.errorActive : s.error}>
            {message}
        </div>
    );
};

export default ErrorWindow;