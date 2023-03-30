import React, {useEffect, useRef, useState} from 'react';
import s from "./Menu.module.scss"
import {Link, useNavigate} from "react-router-dom";
import {routes} from "../../routes/routes";
import {useAppSelector} from "../../store/store";
import {selectorNameUser} from "../../store/selector/selectorApp";
// // @ts-ignore
// import waves from 'vanta/dist/vanta.waves.min'
// // @ts-ignore
// import * as THREE from 'three'


const Menu = () => {
    const navigate = useNavigate()
    const userName = useAppSelector(selectorNameUser)

    // const [vantaEffect, setVantaEffect] = useState<any>(null);
    // const myRef = useRef<HTMLDivElement>(null);
    //
    // useEffect(() => {
    //     if (myRef.current && !vantaEffect) {
    //         setVantaEffect(
    //             waves({
    //                 el: myRef.current,
    //                 THREE: THREE,
    //                 mouseControls: true,
    //                 touchControls: true,
    //                 gyroControls: false,
    //                 minHeight: 200.0,
    //                 minWidth: 200.0,
    //                 scale: 1.0,
    //                 scaleMobile: 1.0,
    //                 color: 0x374860,
    //             }),
    //         );
    //     }
    //     return () => {
    //         if (vantaEffect) vantaEffect.destroy();
    //     };
    // }, [vantaEffect]);

    useEffect(() => {
        if (!userName) navigate(routes.login)
    }, [userName, navigate])

    return (
        <div className={s.menuContainer}>
            <Link to={routes.tikTakToe} className={s.tikTakToe}>Tik-Tak-Toe game</Link>
            <Link to={routes.bullsAndCows} className={s.bullsAndCows}>Bulls and Cows game</Link>
            {/*<div ref={myRef} className={s.vanta}></div>*/}
        </div>
    );
};

export default Menu;