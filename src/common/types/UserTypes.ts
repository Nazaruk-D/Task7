
export type UserInfoType = {
    gameId: number
    gameName?: "tikTakToe" | "bullsAndCows"
    userMove?: string
    board?: any
    players?: UserType[]
    bulls?: number
    cows?: number
}

type UserType = {
    name: string
    id: string
}
