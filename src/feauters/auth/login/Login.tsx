import React, {useEffect} from 'react';
import {useAppSelector} from "../../../store/store";
import LoginForm from "./LoginForm/LoginForm";
import {selectorIsLoggedIn, selectorNameUser} from "../../../store/selector/selectorApp";
import {useNavigate} from "react-router-dom";
import {routes} from "../../../routes/routes";
import ErrorWindow from "../../../common/component/ErrorWindow/ErrorWindow";
import Header from "../../../common/component/Header/Header";


const Login = () => {
    const navigate = useNavigate()
    const userName = useAppSelector(selectorNameUser)

    useEffect(() => {
        if (userName) navigate(routes.mainPage)
    }, [userName, navigate])

    return (
        <>
            <Header/>
            <LoginForm/>
            <ErrorWindow/>
        </>
    );
};

export default Login;