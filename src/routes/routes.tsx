import {createBrowserRouter} from "react-router-dom";
import Login from "../feauters/auth/login/Login";
import Error404 from "../common/component/Error404/Error404";
import TikTakToe from "../feauters/TikTakToe/TikTakToe";
import Menu from "../app/Menu/Menu";
import BullsAndCows from "../feauters/BullsAndCows/BullsAndCows";

export const routes = {
    mainPage: '/',
    login: '/login',
    tikTakToe: '/tik-tak-toe',
    bullsAndCows: '/bulls-and-cows',
}

export const router = createBrowserRouter([
    {
        path: routes.mainPage,
        element: <Menu/>,
        errorElement: <Error404/>
    },
    {
        path: routes.login,
        element: <Login/>
    },
    {
        path: routes.tikTakToe,
        element: <TikTakToe/>
    },
    {
        path: routes.bullsAndCows,
        element: <BullsAndCows/>
    },
])