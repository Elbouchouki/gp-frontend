import React,{useState,useRef} from 'react'
import { TagLock,Member } from '@rsuite/icons';
import { Form,Schema,toaster,Message ,InputGroup,Button ,Panel} from 'rsuite'
import ApiAuth from '../api/ApiAuth';
import smallLogo from '../assets/images/favicon.png'
import logo from '../assets/images/gestpark.svg'
import AuthAction from "../redux/actions/AuthAction"
import {useDispatch } from 'react-redux'

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
    username: StringType().isRequired("Entrez votre nom d'utilisateur."),
    password: StringType().isRequired("Entrez votre mot de passe")
  });
  
const TextField=({ name, label, accepter,value,icon,errorPlacement, ...props })=>{
      return (
        <Form.Group>
            <Form.ControlLabel>{label} </Form.ControlLabel>
            <InputGroup inside>
                <Form.Control name={name} accepter={accepter} errorPlacement={errorPlacement?errorPlacement:"bottomEnd"} {...props} />
                <InputGroup.Addon>
                    {icon}
                </InputGroup.Addon>
             </InputGroup>
        </Form.Group>
      )
  }


const Login = () => {
    const dispatch = useDispatch()
    const formRef = useRef()
    const [formValue,setFormValue]=useState({
        username: '',
        password: '',
        })
    const [formError,setFormError]=useState({})
    const [loading,setLoading]=useState(false)
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
        const auth =await ApiAuth.signin(formValue.username,formValue.password)
        setLoading(false)
        if(!auth){
            toaster.push(
                <Message type="error" showIcon closable>
                  Nom d'utilisateur ou mot de passe est incorrect
                </Message>
              );
            return;
        }
        localStorage.setItem('user',JSON.stringify(auth.user))
        localStorage.setItem('token',auth.token)
        dispatch(AuthAction.setToken(auth.token))
        dispatch(AuthAction.setUser(auth.user))
      }
    
   
    return (
        <div className="layout__login">
            <Panel header={
                    <div style={{display:'flex',flexDirection:"row",justifyContent:"center"}}>
                        <div className="sidebar__logo">
                            <img src={smallLogo} alt="small" /> <img src={logo} alt="gestpark" />
                        </div>
                    </div>
                    } 
                    bordered>
                <Form 
                    ref={formRef}
                    onChange={formValue => handleValueChange(formValue)}
                    onCheck={formError => handleErrorChange(formError)}
                    formValue={formValue}
                    model={model}
                    checkTrigger="blur"
                    >

                    <TextField icon={<Member/>}  name="username" label="Nom d'utilisateur" />
                    <TextField icon={<TagLock/>} name="password" label="Mot de passe" type="password" />
                    
                    <br />
                    <Button style={{width:120,height:40}} loading={loading} appearance="primary" onClick={handleSubmit}>
                        {loading?null:"Se connecter"}
                    </Button>
                </Form>
            </Panel>
        </div>
    )
}

export default Login
