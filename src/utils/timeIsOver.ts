import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {UserInfoType} from "../common/types/UserTypes";

export const timeIsOver = (userId: string, ws?: Socket<DefaultEventsMap, DefaultEventsMap>, userInfo?: UserInfoType) => {
    if (userInfo && ws) {
        const {gameId, gameName} = userInfo
        const data = {
            gameId,
            gameName,
            userId
        }
        ws.emit('game-over-timer', data);
    }
}
