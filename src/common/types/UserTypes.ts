
export type UserInfoType = {
    gameId: number
    gameName?: "tikTakToe" | "bullsAndCows"
    userMove?: string
    board?: any
    players?: UserType[]
    bulls?: string
    cows?: string
}

type UserType = {
    name: string
    id: string
}
