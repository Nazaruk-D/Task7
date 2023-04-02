import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {Game} from "../enums/GameNames";
import {WS} from "../enums/Ws";

export const startGameHandler = (gameName: Game.Tik_Tak_Toe | Game.Bulls_And_Cows, userName?: string, ws?: Socket<DefaultEventsMap, DefaultEventsMap>, roomNumber?: number) => {
    if (ws && userName) {
        const data = {
            gameId: roomNumber || "new room",
            gameName,
            playerName: userName
        };
        ws.emit(WS.Join_Game, data);
    }
}