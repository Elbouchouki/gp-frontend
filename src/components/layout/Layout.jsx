import React, {useEffect,useState} from 'react'
import './layout.css'
import Sidebar from '../sidebar/Sidebar'
import TopNav from '../topnav/TopNav'
import TopNavMobile from '../topnav/TopNavMobile'
import Routes from '../Routes'
import Login from "../../pages/Login"
// import Maintenance from "../../pages/Maintenance"
import { isMobile } from "react-device-detect";
import { BrowserRouter, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Loader } from 'rsuite'
import ThemeAction from '../../redux/actions/ThemeAction'
import AuthAction from "../../redux/actions/AuthAction"
import Dashboard from "../../pages/mobile/Dashboard"

const Layout = () => {

    const themeReducer = useSelector(state => state.ThemeReducer)
    const authReducer = useSelector(state=>state.AuthReducer)
    const [loading,setLoading]= useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        setLoading(true)
        const themeClass = localStorage.getItem('themeMode', 'theme-mode-light')
        const colorClass = localStorage.getItem('colorMode', 'theme-mode-light')
        const stored_user =JSON.parse(localStorage.getItem('user'))
        const stored_token = localStorage.getItem('token')
        dispatch(AuthAction.setToken(stored_token))
        dispatch(AuthAction.setUser(stored_user))
        dispatch(ThemeAction.setMode(themeClass))
        dispatch(ThemeAction.setColor(colorClass))
        setLoading(false)
    }, [dispatch])
    if (isMobile) {
         (loading ? <Loader backdrop content="Chargement en cours..." vertical /> :
        authReducer?.user?
        <BrowserRouter>
            <Route render={(props) => (
                <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                    <TopNavMobile/>
                        <div className="layout__content-mobile">
                            <Dashboard/>
                        </div>
                </div>
            )}/>
        </BrowserRouter>:<Login/>)
    // // if (isMobile){
    //     return (
    //         <Maintenance/>
    //     )
    }
   
    return(
        
        loading ? <Loader backdrop content="Chargement en cours..." vertical /> :
        authReducer?.user?
        <BrowserRouter>
            <Route render={(props) => (
                <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                    <Sidebar {...props}/>
                    <div className="layout__content">
                        <TopNav/>
                        <div className="layout__content-main">
                            <Routes/>
                        </div>
                    </div>
                </div>
            )}/>
        </BrowserRouter>:<Login/>
    )
}

export default Layout
