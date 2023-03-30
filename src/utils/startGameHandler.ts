import {Socket} from "socket.io-client";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

export const startGameHandler = (gameName: "tikTakToe" | "bullsAndCows", userName?: string, ws?: Socket<DefaultEventsMap, DefaultEventsMap>, roomNumber?: number) => {
    if (ws && userName) {
        const data = {
            gameId: roomNumber || "new room",
            gameName,
            playerName: userName
        };
        ws.emit('join-game', data);
    }
}