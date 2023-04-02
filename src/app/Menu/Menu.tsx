import React, {useEffect} from 'react';
import s from "./Menu.module.scss"
import {useNavigate} from "react-router-dom";
import {routes} from "../../routes/routes";
import {useAppSelector} from "../../store/store";
import {selectorNameUser} from "../../store/selector/selectorApp";
import Button from "../../common/component/Button/Button";


const Menu = () => {
    const navigate = useNavigate()
    const userName = useAppSelector(selectorNameUser)

    useEffect(() => {
        if (!userName) navigate(routes.login)
    }, [userName, navigate])

    return (
        <div className={s.menuContainer}>
            <Button className={s.tikTakToe} onClick={() => navigate(routes.tikTakToe)}>Tik-Tak-Toe game</Button>
            <Button className={s.bullsAndCows} onClick={() => navigate(routes.bullsAndCows)}>Bulls and Cows game</Button>
        </div>
    );
};

export default Menu;