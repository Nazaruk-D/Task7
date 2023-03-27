import React from 'react';
import s from "./Header.module.scss"
import {useAppDispatch, useAppSelector} from "../../../store/store";
import {useNavigate} from "react-router-dom";
import {routes} from "../../../routes/routes";
import {selectorIsLoggedIn, selectorNameUser, selectorStatusApp} from "../../../store/selector/selectorApp";

const Header = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const isLoggedIn = useAppSelector(selectorIsLoggedIn)
    const status = useAppSelector(selectorStatusApp)
    const userName = useAppSelector(selectorNameUser)

    function onLogoutClickHandler() {
        // dispatch(logoutTC())
    }

    function onLoginClickHandler() {
        navigate(routes.login)
    }

    const onClickHandler = () => {
        navigate(routes.mainPage)
    }

    return (
        <div className={s.headerContainer}>
            <div onClick={onClickHandler}>
                Task #6
            </div>
            <div>
                {userName && <div style={{marginRight:"40px", fontWeight: 600}}>{userName}</div> }
                {isLoggedIn
                    ? <button color="inherit" onClick={onLogoutClickHandler}>Logout</button>
                    : <button color="inherit" onClick={onLoginClickHandler}>Login</button>
                }
            </div>
        </div>
    );
};

export default Header;