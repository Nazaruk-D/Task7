import React, {useEffect, useRef, useState} from 'react';
import s from "./Menu.module.scss"
import {Link, useNavigate} from "react-router-dom";
import {routes} from "../../routes/routes";
import {useAppSelector} from "../../store/store";
import {selectorNameUser} from "../../store/selector/selectorApp";



const Menu = () => {
    const navigate = useNavigate()
    const userName = useAppSelector(selectorNameUser)

    useEffect(() => {
        if (!userName) navigate(routes.login)
    }, [userName, navigate])

    return (
        <div className={s.menuContainer}>
            <Link to={routes.tikTakToe} className={s.tikTakToe}>Tik-Tak-Toe game</Link>
            <Link to={routes.bullsAndCows} className={s.bullsAndCows}>Bulls and Cows game</Link>
        </div>
    );
};

export default Menu;