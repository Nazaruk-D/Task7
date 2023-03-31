import {AppRootStateType} from "../store";

export const selectorIsInitialized = (state: AppRootStateType) => state.app.initialized;
export const selectorError = (state: AppRootStateType) => state.app.error;
export const selectorStatusApp = (state: AppRootStateType) => state.app.status;
export const selectorNameUser = (state: AppRootStateType)=> state.app.userName;
export const selectorUserId = (state: AppRootStateType)=> state.app.userId;

export const selectorIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;

// export const selectorFetchUsersName = (state: AppRootStateType)=> state.users;


