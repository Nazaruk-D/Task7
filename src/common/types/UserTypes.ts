
export type UserInfoType = {
    gameId: number
    gameName?: "tikTakToe" | "bullsAndCows"
    userMove?: string
    board?: any
    players?: UserType[]
    bulls?: number
    cows?: number
    winner?: string
}

type UserType = {
    name: string
    id: string
}
