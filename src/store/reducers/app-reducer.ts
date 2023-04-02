import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const slice = createSlice({
    name: "app",
    initialState: {
        userName: "",
        userId: "",
        error: null,
    } as InitialStateType,
    reducers: {
        setUserName(state, action) {
            state.userName = action.payload
        },
        setUserId(state, action) {
            state.userId = action.payload
        }
    },
})

export const appReducer = slice.reducer;
export const {setUserName, setUserId} = slice.actions;

type InitialStateType = {
    userName: string
    userId: "" | string
    error: null | string
}



