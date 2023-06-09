import React, {useCallback, useEffect} from 'react'
import './App.css'
import {TodolistsList} from 'features/todolists-list/TodolistsList'
import {ErrorSnackbar} from 'common/components/errorSnackbar/ErrorSnackbar'
import {useSelector} from 'react-redux'
import {initializeAppTC} from 'app/app.reducer'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import {Login} from 'features/auth/Login'
import {logoutTC} from 'features/auth/auth.reducer'
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from '@mui/material';
import {Menu} from '@mui/icons-material'
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {useAppDispatch} from "common/hooks/useAppDispatch";
import {appSelectIsInitialized, appSelectStatus} from "app/app.selectors";

type PropsType = {
    demo?: boolean
}

function App({demo = false}: PropsType) {
    const status = useSelector(appSelectStatus)
    const isInitialized = useSelector(appSelectIsInitialized)
    const isLoggedIn = useSelector(selectIsLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const logoutHandler = useCallback(() => {
        dispatch(logoutTC())
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <BrowserRouter>
            <div className="App">
                <ErrorSnackbar/>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            News
                        </Typography>
                        {isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path={'/'} element={<TodolistsList />}/>
                        <Route path={'/login'} element={<Login/>}/>
                        <Route path={'404'} element={<h1> 404: Page not found </h1>}/>
                        <Route path={'*'} element={ <Navigate to={'404'}/> } />
                    </Routes>
                </Container>
            </div>
        </BrowserRouter>
    )
}

export default App
