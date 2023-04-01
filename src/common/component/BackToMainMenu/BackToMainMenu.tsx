import React, {FC} from 'react'
import s from './BackToMainMenu.module.scss'
import {NavLink} from 'react-router-dom'
import {routes} from "../../../routes/routes";
import {MdKeyboardReturn} from "react-icons/md";
import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

type BackToMainMenuPropsType = {
    ws: Socket<DefaultEventsMap, DefaultEventsMap> | null
}

export const BackToMainMenu: FC<BackToMainMenuPropsType> = ({ws}) => {
    const onClickHandler = () => {
        if (ws) {
            ws.disconnect();
        }
    }

    return (
        <NavLink className={s.toPacksList} to={routes.mainPage} onClick={onClickHandler}>
            <div>
                <MdKeyboardReturn size={30} style={{marginRight: "10px"}}/>
            </div>
            <div className={s.text}>
                Back to main menu
            </div>
        </NavLink>
    )
}
