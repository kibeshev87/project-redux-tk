import {ResultCode, todolistsAPI, TodolistType, updateTodoTitleArgType} from 'common/api/todolists-api'
import {appActions, RequestStatusType} from 'app/app.reducer'
import {AppThunk} from 'app/store';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
const initialState: Array<TodolistDomainType> = []

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, string>(
    'todolists/removeTodolist', async (todolistId, thunkApi) => {
        const {dispatch, rejectWithValue} = thunkApi
        try {
            //изменим глобальный статус приложения, чтобы вверху полоса побежала
            dispatch(appActions.setAppStatus({status: 'loading'}))
            //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
            dispatch(todolistsActions.changeTodolistEntityStatus({todolistId, entityStatus: 'loading'}))
            const res = await todolistsAPI.deleteTodolist(todolistId)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return ({todolistId})
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })
// export const removeTodolistTC = (todolistId: string): AppThunk => {
//     return (dispatch) => {
//         dispatch(appActions.setAppStatus({status: 'loading'}))
//         //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
//         dispatch(todolistsActions.changeTodolistEntityStatus({todolistId, entityStatus: 'loading'}))
//         todolistsAPI.deleteTodolist(todolistId)
//             .then((res) => {
//                 dispatch(todolistsActions.removeTodolist({todolistId}))
//                 //скажем глобально приложению, что асинхронная операция завершена
//                 dispatch(appActions.setAppStatus({status: 'succeeded'}))
//             })
//     }
// }

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, any>(
    'todolists/fetchTodolists', async (arg, thunkApi) => {
        const {dispatch, rejectWithValue} = thunkApi
        try {
            dispatch(appActions.setAppStatus({status: 'loading'}))
            const res = await todolistsAPI.getTodolists()
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return ({todolists: res.data})
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })
// export const fetchTodolistsTC = (): AppThunk => {
//     return (dispatch) => {
//         dispatch(appActions.setAppStatus({status: 'loading'}))
//         todolistsAPI.getTodolists()
//             .then((res) => {
//                 dispatch(todolistsActions.setTodolists({todolists: res.data}))
//                 dispatch(appActions.setAppStatus({status: 'succeeded'}))
//             })
//             .catch(error => {
//                 handleServerNetworkError(error, dispatch);
//             })
//     }
// }

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
    'todolists/addTodolist', async (title, thunkApi) => {
        const {dispatch, rejectWithValue} = thunkApi
        try {
            dispatch(appActions.setAppStatus({status: 'loading'}))
            const res = await todolistsAPI.createTodolist(title)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return ({todolist: res.data.data.item})
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    })
// export const addTodolistTC = (title: string): AppThunk => {
//     return (dispatch) => {
//         dispatch(appActions.setAppStatus({status: 'loading'}))
//         todolistsAPI.createTodolist(title)
//             .then((res) => {
//                 dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}))
//                 dispatch(appActions.setAppStatus({status: 'succeeded'}))
//             })
//     }
// }

const changeTodolistTitle = createAppAsyncThunk<updateTodoTitleArgType, updateTodoTitleArgType>(
    'todolists/changeTodolistTitle', async (arg, thunkApi) => {
        const {dispatch, rejectWithValue} = thunkApi
        try {
            dispatch(appActions.setAppStatus({status: 'loading'}))
            const res = await todolistsAPI.updateTodolist(arg.todolistId, arg.title)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return arg
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }

    })
// export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => {
//     return (dispatch) => {
//         todolistsAPI.updateTodolist(todolistId, title)
//             .then((res) => {
//                 dispatch(todolistsActions.changeTodolistTitle({todolistId, title}))
//             })
//     }
// }


const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {

        // removeTodolist: (state, action: PayloadAction<{ todolistId: string }>) => {
        //     // return state.filter(tl => tl.id !== action.id) // будет работать, но дока мутабельный метод
        //     const index = state.findIndex(todo => todo.id === action.payload.todolistId)
        //     if (index !== -1) state.splice(index, 1)
        // },
        // addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
        //     // return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        //     // const newTodolist: TodolistDomainType = {...action.payload.todolist, filter: 'all', entityStatus: 'idle'}
        //     state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        // },
        // changeTodolistTitle: (state, action: PayloadAction<{ todolistId: string, title: string }>) => {
        //     // return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        //     const todo = state.find(todo => todo.id === action.payload.todolistId)
        //     if (todo) {
        //         todo.title = action.payload.title
        //     }
        // },
        changeTodolistFilter: (state, action: PayloadAction<{ todolistId: string, filter: FilterValuesType }>) => {
            // return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
            const todo = state.find(todo => todo.id === action.payload.todolistId)
            if (todo) {
                todo.filter = action.payload.filter
            }
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) => {
            // return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
            const todo = state.find(todo => todo.id === action.payload.todolistId)
            if (todo) {
                todo.entityStatus = action.payload.entityStatus
            }
        },
        // setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
        //     return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        // }
    },
    extraReducers: builder => {
        builder
            .addCase(removeTodolist.fulfilled, (state, action) => {
                const index = state.findIndex(todo => todo.id === action.payload.todolistId)
                if (index !== -1) state.splice(index, 1)
            })
            .addCase(fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
            })
            .addCase(addTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action) => {
                const todo = state.find(todo => todo.id === action.payload.todolistId)
                if (todo) {
                    todo.title = action.payload.title
                }
            })
    }
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = {removeTodolist, fetchTodolists, addTodolist, changeTodolistTitle}


// thunks




