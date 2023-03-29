
export type UserInfoType = {
    gameId: number
    gameName?: "tikTakToe" | "bullsAndCows"
    userMove?: string
    board?: any
    players?: UserType[]
}

type UserType = {
    name: string
    id: string
}
