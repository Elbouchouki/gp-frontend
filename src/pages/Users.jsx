import React ,{useState,useEffect}from 'react'
import ApiCall from "../api/Api"
import { useSelector } from 'react-redux'
import {Popover,Loader,Icon,Tag,Whisper,IconButton,Dropdown} from "rsuite"
import "../assets/css/users.css"
const Card = ({user,triggerRef,handleSelectMenu}) => {
    const [showPass,setShowPass]=useState(false)
    const handleShowPass = () => {
        setShowPass(!showPass)
    }
    return (
        <div className="col-4">
            <div className="users_card">
                <div className="row" style={{justifyContent:"space-between"}}>
                        <Tag className="users_header" color={user.role_id ===1 ?"red":"yellow"}>
                            {user.role_id ===1 ? <Icon style={{marginRight:5}} icon="certificate" /> : <Icon style={{marginRight:5}} icon="twinkle-star" />}
                            {user.Role?.role_name}
                        </Tag>
                        <div className="row" >
                            <IconButton style={{marginRight:5}} icon={<Icon icon="edit2"  />}/>
                            <IconButton style={{marginRight:5}}icon={<Icon icon="trash" />} color="red" appearance="primary" />
                        </div>
                </div>
                <div className="row users_body">
                    {user.nom + " "+user.prenom}
                </div>
                <div className="row users_items">
                    {user.cin}
                </div>
                <div className="row users_items">
                    {user.mail}
                </div>
                <div className="row users_items" style={{alignItems:"center"}}>
                    {showPass ? user.password : "**********"}{" "}
                    {!showPass?
                        <IconButton className="users_info_button" onClick={handleShowPass} circle size="sm" icon={<Icon icon="eye"  />}/>
                        :
                        <IconButton className="users_info_button" onClick={handleShowPass} circle size="sm"  icon={<Icon icon="eye-slash"  />}/>
                    }
                     

                </div>
            </div>        
        </div>
    )
}

const Users = () => {

    const authReducer = useSelector(state=>state.AuthReducer)
    const user = authReducer.user
    const token = authReducer.token
    const [listUsers,setListUsers]=useState([])
    const [loading,setLoading]=useState(false)
    useEffect(() => {
        async function getUsers(){
            setLoading(true)
            const list = await ApiCall.getUsers(token)
            setListUsers(list)
            console.log(list)
            setLoading(false)
        }
        getUsers()
        return () => {
            setListUsers([])
        }
    }, [token])
    return (
            <div>
                <div className="row" style={{justifyContent:"space-between",margin:10,alignItems:"center"}} > 
                    <h2 className="page-header">Utilisateurs</h2>
                </div>
                <div className="row">
                {
                    loading? <Loader/>:listUsers.users?.map(element=><Card user={element} />)
                }
                    
                {/* <div className="card">
                    ajouter  
                </div>         */}
                    
                </div>
            </div>
    )
}

export default Users
