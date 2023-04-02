import {Game} from "../../enums/GameNames";

export type UserInfoType = {
    gameName?: Game.Tik_Tak_Toe | Game.Bulls_And_Cows
    gameId?: number
    players?: UserType[]
    userMoveId?: string
    board?: number[]
    bulls?: number | null
    cows?: number | null
    winner?: string
    message?: string
    squares?: number[] | null[];
}

export type UserType = {
    name: string
    id: string
}
