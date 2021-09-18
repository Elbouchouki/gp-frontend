import React from 'react'
import { useSelector } from 'react-redux'
import { Link  } from 'react-router-dom'
import './sidebar.css'
import smallLogo from '../../assets/images/favicon.png'
import logo from '../../assets/images/gestpark.svg'
import sidebar_items from '../../assets/JsonData/sidebar_routes.json'
const SidebarItem = props => {
    const active = props.active ? 'active' : ''
    return (
        <div className="sidebar__item">
            <div className={`sidebar__item-inner ${active}`}>
                <i className={props.icon}></i>
                <span>
                    {props.title}
                </span>
            </div>
        </div>
    )
}

const Sidebar = props => {
    const authReducer = useSelector(state=>state.AuthReducer)
    const permissions = authReducer.user.permissions
    const activeItem = sidebar_items.findIndex(item => item.route === props.location.pathname)
    return (
        <div className='sidebar'>
            <div className="sidebar__logo">
                <img src={smallLogo} alt="small" /> <img src={logo} alt="gestpark" />
            </div>
            <div className="sideContent">
                {
                    sidebar_items.map((item, index) => {
                        if (permissions.some((element) => element.name === item.role ||  item.role === undefined)){
                            
                            return <Link to={item.route} key={index}>
                                        <SidebarItem
                                            title={item.display_name}
                                            icon={item.icon}
                                            active={index === activeItem}
                                        />
                                    </Link>
                        }
                        console.log(item)
                        return null  
                    })
                }
            </div>
            <div className="stickyFooter">
                <a href="https://www.linkedin.com/in/elbouchouki-ahmed/" rel="noreferrer" target="_blank" className="copieRight">{"GestPark © "+new Date().getFullYear().toString()}</a>
            </div>
        </div>
    )
}

export default Sidebar
