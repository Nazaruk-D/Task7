import React from 'react';
import s from "./App.module.scss"
import {RouterProvider} from "react-router-dom";
import {router} from "../routes/routes";


function App() {
    return (
        <div className={s.appContainer}>
            <RouterProvider router={router}/>
        </div>
    );
}

export default App;
