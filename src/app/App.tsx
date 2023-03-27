import React, {useEffect} from 'react';
import s from "./App.module.scss"
import {RouterProvider} from "react-router-dom";
import {router} from "../routes/routes";
import {useAppSelector} from "../store/store";
import io from "socket.io-client";
import {selectorNameUser} from "../store/selector/selectorApp";

function App() {
    // const isInitialized = useAppSelector(selectorIsInitialized)
    //
    // if (!isInitialized) {
    //     return <div style={{position: 'fixed', top: '45%', textAlign: 'center', width: '100%'}}>
    //         <CircularProgress/>
    //     </div>
    // }

    const userName = useAppSelector(selectorNameUser)




    return (
        <div className={s.appContainer}>
            <RouterProvider router={router}/>
        </div>
    );
}

export default App;
