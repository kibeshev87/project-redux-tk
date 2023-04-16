import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {TaskStatuses, TaskType} from 'common/api/todolists-api'
import {useAppDispatch} from "common/hooks/useAppDispatch";
import {removeTaskTC, tasksThunks} from "features/todolists-list/tasks.reducer";
import {EditableSpan} from "common/components";

type TaskPropsType = {
    task: TaskType
    todolistId: string
}
export const Task = React.memo((props: TaskPropsType) => {

    const dispatch = useAppDispatch()

    const onClickHandler = useCallback(() =>
        dispatch(removeTaskTC(props.task.id, props.todolistId)
        ), [props.task.id, props.todolistId])

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        let status = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(tasksThunks.updateTask({taskId: props.task.id,
            domainModel: {status},
            todolistId: props.todolistId}))
    }

    const onTitleChangeHandler = (newTitle: string) => {
        dispatch(tasksThunks.updateTask({taskId: props.task.id,
            domainModel: {title: newTitle},
            todolistId: props.todolistId}))
    }

    return <div key={props.task.id} className={props.task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox
            checked={props.task.status === TaskStatuses.Completed}
            color="primary"
            onChange={onChangeHandler}
        />

        <EditableSpan value={props.task.title} onChange={onTitleChangeHandler}/>
        <IconButton onClick={onClickHandler}>
            <Delete/>
        </IconButton>
    </div>
})
