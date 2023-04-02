import {AppRootStateType} from "app/store";

export const appSelectIsInitialized = (state: AppRootStateType) => state.app.isInitialized
export const appSelectStatus = (state: AppRootStateType) => state.app.status
export const selectError = (state: AppRootStateType) => state.app.error