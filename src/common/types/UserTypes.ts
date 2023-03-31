
export type UserInfoType = {
    gameId: number
    gameName?: "tikTakToe" | "bullsAndCows"
    userMoveId?: string
    board?: any
    players?: UserType[]
    bulls?: number
    cows?: number
    winner?: string
    playerId: any
}

type UserType = {
    name: string
    id: string
}
