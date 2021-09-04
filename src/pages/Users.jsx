import React ,{useState,useEffect,useRef}from 'react'
import ApiCall from "../api/Api"
import { useSelector } from 'react-redux'
import {ControlLabel,Schema,Loader,Icon,Tag,HelpBlock,FormControl,FormGroup,SelectPicker ,ButtonToolbar,IconButton,Form,Modal,Button,Alert} from "rsuite"
import "../assets/css/users.css"

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
    mail: StringType().isRequired("Entrez une adress mail").isEmail("Entrez un prenom valide"),
    cin: StringType().isRequired("Entrez un cin"),
    password: StringType().isRequired("Entrez un mot de passe").minLength(4,"le mot de passe doit contient au moins 4 lettre ou ciffres"),
    nom: StringType().isRequired("Entrez un nom valide").containsLetterOnly("Le nom doit contient que des lettres"),
    prenom: StringType().isRequired("Entrez un prenom valide").containsLetterOnly("Le prenom doit contient que des lettres")
  });

const DeleteModal = ({show,close,user,update,token})=>{

    const handleDeleteUser = async ()=>{
        const currUser = await ApiCall.deleteUsers(token,user.username)
        if (currUser && currUser !== undefined){
            update()
            close()
            Alert.success('Utilisateur supprimé !', 20000)
            return
        }
        Alert.warning('Une erreur à éte survenue.', 20000)
        return
    }
    return(
        <Modal backdrop={true} show={show} onHide={close} size="xs">
            <Modal.Body>
            <Icon
                icon="warning"
                style={{
                color: '#FF2E2E',
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


const UpdateModal = ({show,close,user,update,token})=>{
    const formRef = useRef()
    const [roles,setRoles]=useState([
        {
            "label": "Admin",
            "value": "1",
          },
          {
            "label": "Financer",
            "value": "2",
          },
          {
            "label": "Normal",
            "value": "3",
          },
    ])
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
        // const auth =await ApiAuth.signin(formValue.username,formValue.password)
        setLoading(false)
      }
    return(
        <Modal backdrop={true} show={show} onHide={close} size="xs">
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
                    <FormGroup >
                        <ControlLabel>Username</ControlLabel>
                        <FormControl disabled name="username"/ >    
                    </FormGroup>
                    <FormGroup >
                        <ControlLabel>CIN</ControlLabel>
                        <FormControl name="cin" />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Nom</ControlLabel>
                        <FormControl name="nom" />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Prenom</ControlLabel>
                        <FormControl name="prenom" />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Role</ControlLabel>
                        <SelectPicker searchable={false} data={roles} block />
                    </FormGroup>
                    
                    <FormGroup>
                        <ControlLabel>E-mail</ControlLabel>
                        <FormControl name="mail" />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Mot de passe</ControlLabel>
                        <FormControl name="password" />
                    </FormGroup>
                    <FormGroup>
                        <ButtonToolbar>
                            <Button appearance="primary">Modifier</Button>
                            <Button appearance="default">Annuler</Button>
                        </ButtonToolbar>
                    </FormGroup>
                    
                </Form>
            </Modal.Body>
        </Modal>
    )
}








const Card = ({user,update}) => {
    const authReducer = useSelector(state=>state.AuthReducer)
    const token = authReducer.token
    const permissions = authReducer.user.permissions
    const currUsername = authReducer.user.username
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
    const handleUpdateUser = async ()=>{
       
    }
    return (
        <div className="col-4">
            <div className="users_card">
                <div className="row" style={{justifyContent:"space-between"}}>
                        <Tag className="users_header" color={user.role_id ===1 ?"cyan":"yellow"}>
                            {user.role_id ===1 ? <Icon style={{marginRight:5}} icon="certificate" /> : <Icon style={{marginRight:5}} icon="twinkle-star" />}
                            {user.Role?.role_name}{currUsername===user.username?<Icon style={{marginLeft:7}} icon="id-card" />:null}
                        </Tag>
                        <div className="row" >
                            {permissions.some((element) => element.name ==="update_users")?
                            <IconButton onClick={()=>updateModalOpen()} style={{marginRight:5}} icon={<Icon icon="edit2"  />}/>
                            :null}
                            {permissions.some((element) => element.name ==="delete_users")?
                            <IconButton  onClick={()=>deleteModalOpen()} style={{marginRight:5}}icon={<Icon icon="trash" />} color="red" appearance="primary" disabled={currUsername===user.username}/>
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
                        <IconButton className="users_info_button" onClick={handleShowPass} circle size="sm" icon={<Icon icon="eye"  />}/>
                        :
                        <IconButton className="users_info_button" onClick={handleShowPass} circle size="sm"  icon={<Icon icon="eye-slash"  />} />
                    }
                </div>
            </div>  
            <DeleteModal token={token} update={update}  user={user} show={showDeleteModal} close={deleteModalClose}/>
            <UpdateModal token={token} update={update}  user={user} show={showUpdateModal} close={updateModalClose}/>

        </div>
    )
}

const Users = () => {

    const authReducer = useSelector(state=>state.AuthReducer)
    const user = authReducer.user
    const token = authReducer.token
    const [listUsers,setListUsers]=useState([])
    const [toggleUpdate,setToggleUpdate]=useState(false)
    const [loading,setLoading]=useState(false)
    const updateUsers =()=>{
        setToggleUpdate(!toggleUpdate)
    }
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
    }, [token,toggleUpdate])
    return (
            <div>
                <div className="row" style={{justifyContent:"space-between",margin:10,alignItems:"center"}} > 
                    <h2 className="page-header">Utilisateurs</h2>
                </div>
                <div className="row">
                {
                    loading? <div className="col-12 row"  style={{marginTop:100,justifyContent:"center"}}><Loader content="Chargement d'utilisateurs en cours"/></div>:listUsers.users?.map(element=><Card update={updateUsers} user={element} />)
                }
                    
                {/* <div className="card">
                    ajouter  
                </div>         */}
                    
                </div>
            </div>
    )
}

export default Users
