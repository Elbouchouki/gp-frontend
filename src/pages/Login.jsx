import React,{useState,useRef} from 'react'
import { Form,Schema,FormGroup,ControlLabel,Alert,FormControl,Icon,InputGroup,Button ,Message,Panel} from 'rsuite'
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
        <FormGroup>
            <ControlLabel>{label} </ControlLabel>
            <InputGroup inside>
                <FormControl name={name} accepter={accepter} errorPlacement={errorPlacement?errorPlacement:"bottomEnd"} {...props} />
                <InputGroup.Addon>
                    <Icon icon={icon} />
                </InputGroup.Addon>
             </InputGroup>
        </FormGroup>
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
        console.log(formValue)
    }
    const handleErrorChange=(formError)=>{
        setFormError(formError)
        console.log(formError)
    }
    const handleSubmit= async()=> {
        if (!formRef.current.check()) {
          return;
        }
        setLoading(true)
        const auth =await ApiAuth.signin(formValue.username,formValue.password)
        setLoading(false)
        if(!auth){
            Alert.error("Nom d'utilisateur ou mot de passe est incorrect", 5000)
            return;
        }
        localStorage.setItem('user',auth.user)
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

                    <TextField icon="avatar"  name="username" label="Nom d'utilisateur" />
                    <TextField icon="lock" name="password" label="Mot de passe" type="password" />
                    
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
