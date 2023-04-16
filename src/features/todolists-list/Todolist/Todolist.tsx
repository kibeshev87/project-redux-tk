import React, {useEffect} from 'react'
import {Task} from './Task/Task'
import {TaskStatuses} from 'common/api/todolists-api'
import {
    changeTodolistTitleTC,
    removeTodolistTC,
    TodolistDomainType,
    todolistsActions
} from 'features/todolists-list/todolists.reducer'
import {tasksThunks} from 'features/todolists-list/tasks.reducer'
import {useAppDispatch} from 'common/hooks/useAppDispatch';
import {Button, IconButton} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {useSelector} from "react-redux";
import {selectTasks} from "features/todolists-list/tasks.selectors";
import {AddItemForm, EditableSpan} from "common/components";

type TodolistPropsType = {
    todolist: TodolistDomainType
}

export const Todolist = (props: TodolistPropsType) => {

    useEffect(() => {
        dispatch(tasksThunks.fetchTasks(props.todolist.id))
    }, [])

    const dispatch = useAppDispatch()
    const tasksAll = useSelector(selectTasks)

    let tasks = tasksAll[props.todolist.id]

    if (props.todolist.filter === 'active') {
        tasks = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todolist.filter === 'completed') {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed)
    }


    const addTask = (title: string) => {
        dispatch(tasksThunks.addTask({title, todolistId: props.todolist.id}))
    }

    const removeTodolist = () => {
        dispatch(removeTodolistTC(props.todolist.id))
    }

    const changeTodolistTitle = (title: string) => {
        dispatch(changeTodolistTitleTC(props.todolist.id, title))
    }

    const onAllClickHandler = () => {
        dispatch(todolistsActions.changeTodolistFilter({filter: 'all', todolistId: props.todolist.id}))
    }

    const onActiveClickHandler = () => {
        dispatch(todolistsActions.changeTodolistFilter({filter: 'active', todolistId: props.todolist.id}))
    }

    const onCompletedClickHandler = () => {
        dispatch(todolistsActions.changeTodolistFilter({filter: 'completed', todolistId: props.todolist.id}))
    }

    return <div>
        <h3><EditableSpan value={props.todolist.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasks.map(t => <Task key={t.id} task={t} todolistId={props.todolist.id}
                />)
            }
        </div>

        <div style={{paddingTop: '10px'}}>
            <Button variant={props.todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={props.todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
}


