import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {UserInfoType} from "../common/types/UserTypes";
import {WS} from "../enums/Ws";

export const timeIsOver = (userId: string, ws?: Socket<DefaultEventsMap, DefaultEventsMap>, userInfo?: UserInfoType) => {
    if (userId && userInfo && ws) {
        const {gameId, gameName} = userInfo
        const data = {
            gameId,
            gameName,
            userId
        }
        console.log(data)
        ws.emit(WS.Game_Over_Timer, data);
    }
}
