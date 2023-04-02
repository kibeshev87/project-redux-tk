import {todolistsAPI, TodolistType} from 'api/todolists-api'
import {appActions, RequestStatusType} from 'app/app.reducer'
import {handleServerNetworkError} from 'utils/error.utils'
import {AppThunk} from 'app/store';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {

        removeTodolist: (state, action: PayloadAction<{todolistId: string}>) => {
            // return state.filter(tl => tl.id !== action.id) // будет работать, но дока мутабельный метод
            const index = state.findIndex(todo => todo.id === action.payload.todolistId)
            if(index !== -1) state.splice(index, 1)
        },
        addTodolist: (state, action: PayloadAction<{todolist: TodolistType}>) => {
            // return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
            const newTodolist: TodolistDomainType = {...action.payload.todolist, filter: 'all', entityStatus: 'idle'}
            state.unshift(newTodolist)
        },
        changeTodolistTitle: (state, action: PayloadAction<{todolistId: string, title: string}>) => {
            // return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
            const todo = state.find(todo => todo.id === action.payload.todolistId)
            if(todo) {
                todo.title = action.payload.title
            }
        },
        changeTodolistFilter: (state, action: PayloadAction<{todolistId: string, filter: FilterValuesType}>) => {
            // return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
            const todo = state.find(todo => todo.id === action.payload.todolistId)
            if(todo) {
                todo.filter = action.payload.filter
            }
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{todolistId: string, entityStatus: RequestStatusType}>) => {
            // return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
            const todo = state.find(todo => todo.id === action.payload.todolistId)
            if(todo) {
                todo.entityStatus = action.payload.entityStatus
            }
        },
        setTodolists: (state, action: PayloadAction<{todolists: TodolistType[]}>) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        }
    },
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions


// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistsAPI.getTodolists()
            .then((res) => {
                dispatch(todolistsActions.setTodolists({todolists: res.data}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch);
            })
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(appActions.setAppStatus({status: 'loading'}))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(todolistsActions.changeTodolistEntityStatus({todolistId, entityStatus: 'loading'}))
        todolistsAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(todolistsActions.removeTodolist({todolistId}))
                //скажем глобально приложению, что асинхронная операция завершена
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistsAPI.createTodolist(title)
            .then((res) => {
                dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
    }
}
export const changeTodolistTitleTC = (todolistId: string, title: string):AppThunk => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(todolistId, title)
            .then((res) => {
                dispatch(todolistsActions.changeTodolistTitle({todolistId, title}))
            })
    }
}

