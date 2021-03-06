import React ,{useState,useEffect,useRef}from 'react'
import ApiCall from "../api/Api"
import { useSelector } from 'react-redux'
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import { Shield,CharacterAuthorize ,Plus,Visible,EyeClose,Edit,RemindFill,Trash} from '@rsuite/icons';
import TagIcon from '@rsuite/icons/Tag';
import {Form,Schema,Loader ,Tag,SelectPicker,IconButton ,ButtonToolbar, Button,Modal,toaster,Notification} from "rsuite"
import "../assets/css/users.css"


const openNotification=(funcName,desc)=> {
    toaster.push(<Notification
    type={funcName}
    header={funcName}
    
    duration={3000}
    
    >
        <p>{desc}</p>
    </Notification>,{placement:"topEnd"})
    
  }


const DeleteModal = ({show,close,user,update,token})=>{

    const handleDeleteUser = async ()=>{
        const currUser = await ApiCall.deleteUsers(token,user.username)
        if (currUser && currUser !== undefined){
            update()
            close()
            openNotification("success",'Utilisateur supprimé !')
            return
        }
        openNotification("warning",'Une erreur à éte survenue.')
        return
    }
    return(
        <Modal backdrop={true} open={show} onClose={close} size="xs">
            <Modal.Body>
            <RemindFill
                color= '#FF2E2E'
                style={{
                fontSize: 24,
                padding:5
                }}
            />
            {'  '}
                Etre-vous sure que vous voulez Supprimer {user.nom+" "+user.prenom} ?
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={()=>handleDeleteUser()} color="red" appearance="primary">
                Supprimer
            </Button>
            <Button onClick={close} appearance="subtle">
                Annuler
            </Button>
            </Modal.Footer>
        </Modal>
    )
}


const UpdateModal = ({roles,show,close,user,update,token,currUser,model})=>{
    const formRef = useRef()
    const [loading,setLoading]=useState(false)
    const [formValue,setFormValue]=useState({
        username: user.username,
        cin: user.cin,
        nom: user.nom,
        prenom: user.prenom,
        phone: user.phone,
        mail: user.mail,
        password: user.password,
        role_id: user.role_id
        })
    const [formError,setFormError]=useState({})
    const handleValueChange=(formValue)=>{
        setFormValue(formValue)
    }
    const handleErrorChange=(formError)=>{
        setFormError(formError)
    }
    const handleSubmit= async()=> {
        if (!formRef.current.check()) {
          return;
        }
        setLoading(true)
        const response =await ApiCall.updateUsers(token,formValue)
        if(!response){
            setLoading(false)
            openNotification("warning",'Une erreur à éte survenue.')
            return
        }
        setLoading(false)
        openNotification("success","L'utilisateur à étè modifié.")
        update()
        close()
      }
    return(
        <Modal backdrop={true} open={show} onClose={close} size="xs">
            <Modal.Header>
                <Modal.Title>Modification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                fluid
                ref={formRef}
                onChange={formValue => handleValueChange(formValue)}
                onCheck={formError => handleErrorChange(formError)}
                formValue={formValue}
                model={model}
                checkTrigger="blur"
                >
                    <Form.Group >
                        <Form.ControlLabel>Nom d'utilisateur</Form.ControlLabel>
                        <Form.Control disabled={currUser.username===user.username} name="username"/ >    
                    </Form.Group>
                    <Form.Group >
                        <Form.ControlLabel>CIN</Form.ControlLabel>
                        <Form.Control name="cin" />
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>Nom</Form.ControlLabel>
                        <Form.Control name="nom" />
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>Prenom</Form.ControlLabel>
                        <Form.Control name="prenom" />
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>Role</Form.ControlLabel>
                        <Form.Control
                            name="role_id"
                            accepter={SelectPicker}
                            data={roles}
                            searchable={false}
                            valueKey="id"
                            labelKey="role_name"
                            cleanable={false}
                            disabled={currUser.username===user.username}
                            renderMenu={menu => {
                            if (roles.length === 0) {
                                return (
                                <p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
                                    <SpinnerIcon pulse style={{ fontSize: '2em' }} /> Chargement en cours...
                                </p>
                                );
                            }
                            return menu;
                            }}
                        />
                    </Form.Group>              
                    <Form.Group>
                        <Form.ControlLabel>E-mail</Form.ControlLabel>
                        <Form.Control name="mail" />
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>Mot de passe</Form.ControlLabel>
                        <Form.Control name="password" />
                    </Form.Group>
                    <Form.Group>
                        <ButtonToolbar>
                            <Button loading={loading} onClick={handleSubmit} appearance="primary">Modifier</Button>
                            <Button onClick={close} appearance="default">Annuler</Button>
                        </ButtonToolbar>
                    </Form.Group>
                    
                </Form>
            </Modal.Body>
        </Modal>
    )
}
const AddModal = ({roles,show,close,user,update,token,listUsers})=>{
    const formRef = useRef()
    const [loading,setLoading]=useState(false)
    const [formValue,setFormValue]=useState({
        username: '',
        cin: '',
        nom: '',
        prenom: '',
        phone: '',
        mail:'',
        password: '',
        role_id: 0,
        })
    const [formError,setFormError]=useState({})
    const { StringType, NumberType } = Schema.Types;
    const checkEmail =(email)=>{
        return !listUsers.some(user => user.mail === email)
    }
    const checkUsername =(username)=>{
        return !listUsers.some(user => user.username === username)
    }
    const checkCIN =(cin)=>{
        return !listUsers.some(user => user.cin === cin)
    }
    const model = Schema.Model({
        mail: StringType().isRequired("Entrez une adress mail").isEmail("Entrez un prenom valide").addRule((value,data)=>{return checkEmail(value)},"Adress mail existe."),
        cin: StringType().isRequired("Entrez un cin").addRule((value,data)=>{return checkCIN(value)},"CIN existe."),
        password: StringType().isRequired("Entrez un mot de passe").minLength(4,"Le mot de passe doit contient au moins 4 lettre ou ciffres"),
        nom: StringType().isRequired("Entrez un nom valide").containsLetterOnly("Le nom doit contient que des lettres"),
        prenom: StringType().isRequired("Entrez un prenom valide").containsLetterOnly("Le prenom doit contient que des lettres"),
        username:StringType().isRequired("Entrez un nom d'utilisateur").minLength(4,"Le nom d'utilisateur doit contient au moins 4 lettre").addRule((value,data)=>{return checkUsername(value)},"Nom d'utilisateur existe.")
    });
    const handleValueChange=(formValue)=>{
        setFormValue(formValue)
    }
    const handleErrorChange=(formError)=>{
        setFormError(formError)
    }
    const handleSubmit= async()=> {
        if (!formRef.current.check()) {
          return;
        }
        setLoading(true)
        const response =await ApiCall.addUsers(token,formValue)
        if(!response){
            setLoading(false)
            openNotification("warning",'Une erreur à éte survenue.')
            return
        }
        setLoading(false)
        openNotification("success","L'utilisateur à étè ajouté.")
        update()
        close()
      }
    return(
        <Modal backdrop={true} open={show} onClose={close} size="xs">
            <Modal.Header>
                <Modal.Title>Nouveau utilisateur</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form 
                fluid
                ref={formRef}
                onChange={formValue => handleValueChange(formValue)}
                onCheck={formError => handleErrorChange(formError)}
                formValue={formValue}
                model={model}
                checkTrigger="blur"
                >
                    <Form.Group >
                        <Form.ControlLabel>Nom d'utilisateur</Form.ControlLabel>
                        <Form.Control name="username"/ >    
                    </Form.Group>
                    <Form.Group >
                        <Form.ControlLabel>CIN</Form.ControlLabel>
                        <Form.Control name="cin" />
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>Nom</Form.ControlLabel>
                        <Form.Control name="nom" />
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>Prenom</Form.ControlLabel>
                        <Form.Control name="prenom" />
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>Role</Form.ControlLabel>
                        <Form.Control
                            name="role_id"
                            accepter={SelectPicker}
                            data={roles}
                            searchable={false}
                            valueKey="id"
                            labelKey="role_name"
                            cleanable={false}
                            renderMenu={menu => {
                            if (roles.length === 0) {
                                return (
                                <p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
                                    <SpinnerIcon pulse style={{ fontSize: '2em' }} /> Chargement en cours...
                                </p>
                                );
                            }
                            return menu;
                            }}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>E-mail</Form.ControlLabel>
                        <Form.Control name="mail" />
                    </Form.Group>
                    <Form.Group>
                        <Form.ControlLabel>Mot de passe</Form.ControlLabel>
                        <Form.Control name="password" />
                    </Form.Group>
                    <Form.Group>
                        <ButtonToolbar>
                            <Button loading={loading} onClick={handleSubmit} appearance="primary">Ajouter</Button>
                            <Button onClick={close} appearance="default">Annuler</Button>
                        </ButtonToolbar>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
const Card = ({roles,user,update,listUsers}) => {
    const authReducer = useSelector(state=>state.AuthReducer)
    const token = authReducer.token
    const permissions = authReducer.user.permissions
    const currUser = authReducer.user
    const [showPass,setShowPass]=useState(false)
    const [showDeleteModal,setShowDeleteModal]=useState(false)
    const [showUpdateModal,setShowUpdateModal]=useState(false)
    const handleShowPass = () => {
        setShowPass(!showPass)
    }
    const deleteModalOpen=()=>{
        setShowDeleteModal(true);
    }
    const deleteModalClose=()=> {
        setShowDeleteModal(false);
    }
    const updateModalOpen=()=>{
        setShowUpdateModal(true);
    }
    const updateModalClose=()=> {
        setShowUpdateModal(false);
    }
    const { StringType, NumberType } = Schema.Types;
    const checkEmail =(email)=>{
        if (email===user.mail) return true
        return !listUsers.some(user => user.mail === email)
    }
    const checkUsername =(username)=>{
        if (username===user.username) return true
        return !listUsers.some(user => user.username === username)
    }
    const checkCIN =(cin)=>{
        if (cin===user.cin) return true
        return !listUsers.some(user => user.cin === cin)
    }
    const model = Schema.Model({
        mail: StringType().isRequired("Entrez une adress mail").isEmail("Entrez un prenom valide").addRule((value,data)=>{return checkEmail(value)},"Adress mail existe."),
        cin: StringType().isRequired("Entrez un cin").addRule((value,data)=>{return checkCIN(value)},"CIN existe."),
        password: StringType().isRequired("Entrez un mot de passe").minLength(4,"Le mot de passe doit contient au moins 4 lettre ou ciffres"),
        nom: StringType().isRequired("Entrez un nom valide").containsLetterOnly("Le nom doit contient que des lettres"),
        prenom: StringType().isRequired("Entrez un prenom valide").containsLetterOnly("Le prenom doit contient que des lettres"),
        username:StringType().isRequired("Entrez un nom d'utilisateur").minLength(4,"Le nom d'utilisateur doit contient au moins 4 lettre").addRule((value,data)=>{return checkUsername(value)},"Nom d'utilisateur existe.")
    });
    return (
        <div className="col-4">
            <div className="users_card">
                <div className="row" style={{justifyContent:"space-between"}}>
                        <Tag className="users_header" color={user.role_id ===1 ?"cyan":"yellow"}>
                            {user.role_id ===1 ? <Shield style={{marginRight:5}}/> : <TagIcon style={{marginRight:5}} />}
                            {user.Role?.role_name}{currUser.username===user.username?<CharacterAuthorize style={{marginLeft:7}}/>:null}
                        </Tag>
                        <div className="row" >
                            {permissions.some((element) => element.name ==="update_users")?
                            <IconButton onClick={()=>updateModalOpen()} style={{marginRight:5}} icon={<Edit/>}/>
                            :null}
                            {permissions.some((element) => element.name ==="delete_users")?
                            <IconButton  onClick={()=>deleteModalOpen()} style={{marginRight:5}}icon={<Trash/>} color="red" appearance="primary" disabled={currUser.username===user.username}/>
                            :null}
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
                        <IconButton className="users_info_button" onClick={handleShowPass} circle size="sm" icon={<Visible/>}/>
                        :
                        <IconButton className="users_info_button" onClick={handleShowPass} circle size="sm"  icon={<EyeClose />} />
                    }
                </div>
            </div>  
            <DeleteModal token={token} update={update}  user={user} show={showDeleteModal} close={deleteModalClose}/>
            <UpdateModal roles={roles} model={model} token={token} currUser={currUser} update={update}  user={user} show={showUpdateModal} close={updateModalClose}/>

        </div>
    )
}
const Users = () => {
    const authReducer = useSelector(state=>state.AuthReducer)
    const user = authReducer.user
    const token = authReducer.token
    const [listUsers,setListUsers]=useState([])
    const [roles,setRoles]=useState([])
    const [toggleUpdate,setToggleUpdate]=useState(false)
    const [loading,setLoading]=useState(false)
    const [showAddModal,setShowAddModal]=useState(false)
    const addModalOpen=()=>{
        setShowAddModal(true);
    }
    const addModalClose=()=> {
        setShowAddModal(false);
    }
    const updateUsers =()=>{
        setToggleUpdate(!toggleUpdate)
    }
    useEffect(() => {
        async function getUsers(){
            setLoading(true)
            const list = await ApiCall.getUsers(token)
            setListUsers(list)
            setLoading(false)
        }
        async function getRoles(){
            const roleList  = await ApiCall.getRoles(token)
            setRoles(roleList.role)
            return;
        }
        getUsers()
        getRoles()
        return () => {
            setListUsers([])
            setRoles([])
        }
    }, [token,toggleUpdate])
    return (
            <div>
                <div className="row" style={{justifyContent:"space-between",margin:10,alignItems:"center"}} > 
                    <h2 className="page-header">Utilisateurs</h2>
                </div>
                <div className="row">
                {
                    loading? <div className="col-12 row"  style={{marginTop:100,justifyContent:"center"}}><Loader content="Chargement d'utilisateurs en cours"/></div>:listUsers.users?.map(element=><Card listUsers={listUsers?.users} roles={roles}update={updateUsers} user={element} />)
                }
                    {loading?null:<IconButton className="users_shadow" onClick={addModalOpen}  style={{margin:30,width: 100,height: 100}} icon={<Plus style={{fontSize:30}}/>} /> }
                </div>
            <AddModal roles={roles} token={token} listUsers={listUsers?.users} update={updateUsers}  user={user} show={showAddModal} close={addModalClose}/>
            </div>
    )
}
export default Users
