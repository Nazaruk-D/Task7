import React from 'react'
import s from './BackToMainMenu.module.scss'
import { NavLink } from 'react-router-dom'
import {routes} from "../../../routes/routes";
import {MdKeyboardReturn} from "react-icons/md";


export const BackToMainMenu = () => {
    return (
        <NavLink className={s.toPacksList} to={routes.mainPage}>
            <MdKeyboardReturn size={30}/>
            Back to main menu
        </NavLink>
    )
}
