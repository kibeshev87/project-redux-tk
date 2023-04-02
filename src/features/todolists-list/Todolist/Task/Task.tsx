import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from '@mui/material'
import {EditableSpan} from 'components/editableSpan/EditableSpan'
import {Delete} from '@mui/icons-material'
import {TaskStatuses, TaskType} from 'api/todolists-api'
import {useAppDispatch} from "hooks/useAppDispatch";
import {removeTaskTC, updateTaskTC} from "features/todolists-list/tasks.reducer";

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
        dispatch(updateTaskTC(props.task.id, {status}, props.todolistId))

    }

    const onTitleChangeHandler = (newTitle: string) => {
        dispatch(updateTaskTC(props.task.id, {title: newTitle}, props.todolistId))
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
