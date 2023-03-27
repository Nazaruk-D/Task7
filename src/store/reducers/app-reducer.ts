import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RequestStatusType} from "../../enums/RequestStatusType";

//
// export const initializeAppTC = createAsyncThunk(('app/initializeApp'), async (param, {dispatch}) => {
//     try {
//         const res = await authAPI.me()
//         if (res.status === 200) {
//             dispatch(setAppStatusAC({status: 'loading'}))
//             dispatch(setIsLoggedInAC({value: true}));
//             dispatch(setUserName({name: res.data.data.name}));
//             return
//         } else {
//             handleServerAppError(res.data.message[0], dispatch)
//         }
//     } catch (err: any) {
//         if (err.request.status === 401) {
//             return
//         } else {
//             handleServerNetworkError(err, dispatch)
//         }
//     } finally {
//         dispatch(setAppStatusAC({status: 'idle'}))
//     }
// })

const slice = createSlice({
    name: "app",
    initialState: {
        status: 'loading',
        initialized: false,
        userName: "",
        error: null,
    } as InitialStateType,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setUserName(state, action) {
            state.userName = action.payload
        },
        setAppErrorAC(state, action: PayloadAction<{ message: null | string }>) {
            state.error = action.payload.message
        },
    },
    extraReducers: builder => {
        // builder.addCase(initializeAppTC.fulfilled, (state) => {
        //     state.initialized = true
        // })
    }
})

export const appReducer = slice.reducer;
export const {setAppStatusAC, setUserName, setAppErrorAC} = slice.actions;

type InitialStateType = {
    status: RequestStatusType
    initialized: boolean
    userName: string
    error: null | string
}



