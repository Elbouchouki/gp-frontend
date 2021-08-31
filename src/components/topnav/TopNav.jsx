import React,{useState,createRef} from 'react'
import './topnav.css'
import {useHistory } from 'react-router-dom'
import ThemeMenu from '../thememenu/ThemeMenu'
import Dropdownn from "../dropdown/Dropdown"
import user_image from '../../assets/images/user.jpg'
import { Modal,Button,Icon,Alert,IconButton,Dropdown,AutoComplete, InputGroup} from 'rsuite'
import { DatePickerWeekDate,DatePickerMonthDate,YearSelect } from '../datepickers/DatePickers'
import { ExcelExport,ExcelExportColumn, } from '@progress/kendo-react-excel-export';
import ApiCall from '../../api/Api'
import {useSelector,useDispatch } from 'react-redux'
import AuthAction from "../../redux/actions/AuthAction"


const curr_user = {
    display_name: 'Elbouchouki',
    role:"admin",
    image: user_image
}
const LogoutModal = ({handleLogout,show,close})=>(
        <Modal backdrop="static" show={show} onHide={close} size="xs">
            <Modal.Body>
            <Icon
                icon="remind"
                style={{
                color: '#ffb300',
                fontSize: 24
                }}
            />
            {'  '}
                Voulez-vous vraiment vous déconnecter ?
            </Modal.Body>
            <Modal.Footer>
            <Button onClick={()=>handleLogout()} color="red" appearance="primary">
                Se déconnecter
            </Button>
            <Button onClick={close} appearance="subtle">
                Annuler
            </Button>
            </Modal.Footer>
        </Modal>
    )
const ExportModal = ({isSelected,show,close,confirme,dateChange,yearChange,season}) =>(
    <Modal size="xs" backdrop="static"  show={show} onHide={close}>
        <Modal.Header>
            <Modal.Title>
                Exportation vers excel
            </Modal.Title>
        </Modal.Header>
            <Modal.Body>
                <div>
                    {
                    season === 'week'?
                    <DatePickerWeekDate active={season} handleDateChange={dateChange} />
                    :season ==="month"?
                    <DatePickerMonthDate active={season} handleDateChange={dateChange} />
                    :
                    <YearSelect handleChange={yearChange} />
                    }
                </div>
            </Modal.Body>
        <Modal.Footer>
            <Button color="green" disabled={isSelected?false:true} onClick={confirme} appearance="primary">
                Exporter
            </Button>
            <Button onClick={close} color="red" appearance="subtle">
                Annuler
            </Button>
        </Modal.Footer>
    </Modal>
)
const searchTypes = [
    {
        label:"Tickets Normaux",
        value:"tickets-normals",
        icon: "ticket"
    },{
        label:"Tickets Illisibles",
        value:"tickets-illisible",
        icon: "ticket"
    },{
        label:"Tickets Perdus",
        value:"tickets-perdus",
        icon: "ticket"
    },{
        label:"Recharges Abonnée(s)",
        value:"recharges-abonnés",
        icon: "credit-card"
    },{
        label:"Entrée(s) Abonnée(s)",
        value:"entreés-abonnés",
        icon: "car"
    },{
        label:"Mouvements",
        value:"mouvements",
        icon: "bullseye"
    },{
        label: "Annulations",
        value: "annulations",
        icon: "window-close-o"
    }
  ];

const Topnav = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const authReducer = useSelector(state=>state.AuthReducer)
    const user = authReducer.user
    const [exporter,setExporter] =useState(null)
    const search = React.createRef();
    const [showExportModal,setShowExportModal]=useState(false)
    const [showLogoutModal,setShowLogoutModal]=useState(false)
    const [season,setSeason]=useState(null)
    const [listVilles,setListVilles]=useState([1,2])
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [isSelected,setIsSelected]=useState(false)
    const [excelData,setExcelData]=useState(null)
    const exportModalClose=()=> {
        setIsSelected(false)
        setShowExportModal(false);
    }
    const logoutModalClose=()=> {
        setShowLogoutModal(false);
    }
    const exportModalopen=(event)=>{
        setSeason(event)
        setShowExportModal(true);
    }
    const logoutModalopen=()=>{
        setShowLogoutModal(true);
    }
    const confirmExportModal = async () =>{
        setIsSelected(false);
        setShowExportModal(false);
        Alert.warning('Exportation encours...', 20000)
        const exData = await ApiCall.getExcelData(listVilles,fromDate,toDate)
        setExcelData(exData)
        // exporter.save();

        // if(exporter){
        //     Alert.close()
        //     Alert.success('Telechargement ...', 5000)
        //     exporter.save();
        //     return
        // }
        // Alert.close()
        // Alert.error('Exportation echoué', 5000)
        
    }
    const handleIntervalDateChange = (value) => {
        setIsSelected(true)
        setFromDate(value[0])
        setToDate(value[1])
    }
    const handleYearChange = (year) =>{
        setIsSelected(true)
        setFromDate(new Date(year,0,1))
        setToDate(new Date(year,11,31))
    }
    const handleDropDown=(event)=>{
        switch(event){
            case "logout":
                logoutModalopen()
                break
            default:
                history.push(event)
        }
    }
    const handleSearch =(item)=>{
        search.current.setState({
            value:""
        })
        history.push(item.value)
    }
    const handleLogout=()=>{
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        dispatch(AuthAction.setToken(null))
        dispatch(AuthAction.setUser(null))
    }
    return (
        <div className='topnav'>
                <InputGroup inside style={{width: 250,marginBottom: 10}}>
                    <AutoComplete ref={search} data={searchTypes} onSelect={handleSearch}
                    placeholder="Recherche"
                    renderItem={item => {
                        return (
                          <div>
                            <Icon icon={item.icon} style={{marginRight: 10}}/> <strong>{item.label}</strong>
                          </div>
                        );
                      }}
                    />
                    <InputGroup.Addon>
                        <Icon icon="search" />
                    </InputGroup.Addon>
                </InputGroup>
            <div className="topnav__right">
                <div className="topnav__right-item">
                    <Dropdown onSelect={handleDropDown} title="Mon Compte" placement="bottomEnd">
                            <Dropdown.Item panel style={{ padding: 10, width: 200 }} >
                                <p>Connecté en tant que</p>
                                <strong>{user.username}</strong>
                            </Dropdown.Item>
                            <Dropdown.Item divider />
                            <Dropdown.Item eventKey="Profile" icon={<Icon icon="user" />}>Profile</Dropdown.Item>
                            <Dropdown.Item eventKey="Support" icon={<Icon icon="support" />}>Support</Dropdown.Item>
                            <Dropdown.Item divider />
                            <Dropdown.Item eventKey="logout" icon={<Icon icon="sign-out" />}>Se Deconnecter</Dropdown.Item>
                    </Dropdown>
                </div> 
                {user.permissions.some((element) => element.name === "export_excel")
                ?
                <div className="topnav__right-item">
                    <Dropdown
                        onSelect={exportModalopen}
                        renderTitle={()=>{
                            return(
                                <IconButton  icon={<Icon icon="export"/>}  placement="left" color="green" appearance="primary"  className="topnav__right-user__name">
                                    Export
                                </IconButton>
                            )
                        }}
                        placement="bottomEnd"
                        >
                            <Dropdown.Item eventKey="week">Hebdomadaire</Dropdown.Item>
                            <Dropdown.Item eventKey="month">Mensuel</Dropdown.Item>
                            <Dropdown.Item eventKey="year">Annuel</Dropdown.Item>          
                    </Dropdown>
                </div>:null}  
                <div className="topnav__right-item">
                    <ThemeMenu />
                </div>
            </div>


            <ExcelExport
                data={excelData}
                fileName="excel.xlsx"
                ref={setExporter}
            >
                <ExcelExportColumn field="t_n.count" title="Tickets Normaux" width={350}/>
                <ExcelExportColumn field="t_i.count" title="Tickets Illisible" width={350}/>
                {/* <ExcelExportColumn field="Category.CategoryName" width={350}/> */}
            </ExcelExport>

           
            <ExportModal confirme={confirmExportModal} isSelected={isSelected} season={season} yearChange={handleYearChange} dateChange={handleIntervalDateChange} show={showExportModal} close={exportModalClose} />
            <LogoutModal handleLogout={handleLogout} show={showLogoutModal} close={logoutModalClose}/>
        </div>
    )
}

export default Topnav

