import {AxiosError} from "axios";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


// export const loginTC = createAsyncThunk<undefined, LoginDataType, { rejectValue: { errors: Array<string>, fieldErrors?: Array<any> } }>(('auth/login'), async (param: LoginDataType, thunkAPI) => {
//     thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
//     try {
//         const res = await authAPI.login(param)
//         if (res.statusCode === 200 || res.statusCode === 201) {
//             thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
//             thunkAPI.dispatch(setUserName({name: res.data.name}));
//             return
//         } else {
//             handleServerAppError(res.message, thunkAPI.dispatch)
//             return thunkAPI.rejectWithValue({errors: ["error"], fieldErrors: []})
//         }
//     } catch (err: any) {
//         const error: AxiosError = err.response.data
//         handleServerNetworkError(error, thunkAPI.dispatch)
//         return thunkAPI.rejectWithValue({errors: [error.message], fieldErrors: undefined})
//     } finally {
//         thunkAPI.dispatch(setAppStatusAC({status: 'idle'}))
//     }
// })
//
// export const logoutTC = createAsyncThunk(('auth/logout'), async (param, thunkAPI) => {
//     thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
//     try {
//         const res = await authAPI.logout()
//         if (res.statusCode === 200) {
//             thunkAPI.dispatch(setIsisRegisteredAC({value: false}))
//             thunkAPI.dispatch(clearMessages())
//             thunkAPI.dispatch(setUserName({name: ""}))
//             thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
//             return
//         } else {
//             handleServerAppError(res, thunkAPI.dispatch)
//             return thunkAPI.rejectWithValue({})
//         }
//     } catch (err: any) {
//         handleServerNetworkError(err, thunkAPI.dispatch)
//         return thunkAPI.rejectWithValue({})
//     }
// })


const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false,
        isRegistered: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        },
        setIsisRegisteredAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isRegistered = action.payload.value
        },
    },
    extraReducers: builder => {
        // builder.addCase(logoutTC.fulfilled, (state) => {
        //     state.isLoggedIn = false
        // })
        // builder.addCase(loginTC.fulfilled, (state) => {
        //     state.isLoggedIn = true
        // })
    }
})

export const authReducer = slice.reducer;
export const {setIsLoggedInAC, setIsisRegisteredAC} = slice.actions;
