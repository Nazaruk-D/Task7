
export type UserInfoType = {
    gameId: number,
    userMove?: string,
    board?: any
    players?: UserType[]
}

type UserType = {
    name: string,
    id: string
}
