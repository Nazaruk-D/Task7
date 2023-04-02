import {AppRootStateType} from "../store";

export const selectorNameUser = (state: AppRootStateType)=> state.app.userName;
export const selectorUserId = (state: AppRootStateType)=> state.app.userId;



