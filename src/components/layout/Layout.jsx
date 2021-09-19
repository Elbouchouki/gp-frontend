import React, {useEffect,useState} from 'react'
import { isMobile } from "react-device-detect";
import './layout.css'
import Sidebar from '../sidebar/Sidebar'
import TopNav from '../topnav/TopNav'
import TopNavMobile from '../topnav/TopNavMobile'
import Routes from '../Routes'
import Login from "../../pages/Login"
import { BrowserRouter, Route } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Loader } from 'rsuite'
import ThemeAction from '../../redux/actions/ThemeAction'
import AuthAction from "../../redux/actions/AuthAction"
import mobile from "../../assets/images/mobile.gif"
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
    // if (isMobile) {
        if (isMobile) {
        
        //  (loading ? <Loader backdrop content="Chargement en cours..." vertical /> :
        // authReducer?.user?
        // <BrowserRouter>
        //     <Route render={(props) => (
        //         <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
        //             <TopNavMobile/>
        //                 <div className="layout__content-mobile">
        //                     <Dashboard/>
        //                 </div>
        //         </div>
        //     )}/>
        // </BrowserRouter>:<Login/>)
        
        
        return(<div   
                    style={{
                        backgroundColor:"#4b52db",
                        height: "100vh",
                        width:"100wh",
                        display: "flex",
                        flexDirection:"column",
                        
                        }}>
                        <div style={{
                            flex: "1 0 auto",
                            display: "flex",
                            flexDirection:"column",
                            justifyContent: "center",
                            alignItems: "center",}}>
                            <img style={{width:"100%",height:"auto"}} src={mobile} alt="mobile" />
                            <div style={{color:"white",fontWeight:"bold",textAlign: "center"}}>La version mobile est en cours de construction.</div>
                            <div style={{color:"white",fontWeight:"300",padding:20,textAlign: "center"}}>Veuillez accéder l'application à l'aide d'un ordinateur ou d'un pc portable.</div>

                        </div>
                        <div style={{color:"white",flexShrink:0,justifyContent: "center",display: "flex",flexDirection:"row"}}>
                            Gestpark © 2021
                        </div>
                    
                </div>)
    }
    return (
        
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
