import {createBrowserRouter} from "react-router-dom";
import Login from "../feauters/auth/login/Login";
import Error404 from "../common/component/Error404/Error404";
import TikTakToe from "../feauters/TikTakToe/TikTakToe";

export const routes = {
    mainPage: '/',
    login: '/login',
}

export const router = createBrowserRouter([
    {
        path: routes.mainPage,
        element: <TikTakToe/>,
        errorElement: <Error404/>
    },
    {
        path: routes.login,
        element: <Login/>
    },
])