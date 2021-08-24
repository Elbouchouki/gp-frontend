import React,{useState} from 'react'
import './topnav.css'
import { Link,useHistory } from 'react-router-dom'
import ThemeMenu from '../thememenu/ThemeMenu'
import Dropdownn from "../dropdown/Dropdown"
import user_image from '../../assets/images/user.jpg'
import { Modal,Button,Icon,Alert,IconButton,Dropdown} from 'rsuite'
import user_menu from '../../assets/JsonData/user_menus.json'
import export_menu from '../../assets/JsonData/export.json'
import { DatePickerWeekDate,DatePickerMonthDate,YearSelect } from '../datepickers/DatePickers'
import { ExcelExport,ExcelExportColumn, } from '@progress/kendo-react-excel-export';

const curr_user = {
    display_name: 'Elbouchouki',
    role:"admin",
    image: user_image
}

const renderUserToggle = (user) => (
    <div className="topnav__right-user">
         <Icon icon="profile" size="2x" style={{paddingRight:"10px"}} />
        {/* <div className="topnav__right-user__image">
            <img src={user.image} alt="" />
        </div> */}
        
        <div className="topnav__right-user__name">
            {user.display_name}
        </div>
    </div>
)

const renderUserMenu = (item, index) => (
    <Link to={item.route} key={index}>
        <div className="notification-item">
            <i className={item.icon}></i>
            <span>{item.content}</span>
        </div>
    </Link>
)
const renderExportMenu = (item, index,exportModalopen,changeSeason) => (
    <button key={index} className="logout_item" onClick={()=>exportModalopen(item.season)}>
        {item.content}
    </button>
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


const Topnav = () => {
    const history = useHistory()
    const [showModal,setShowModal]=useState(false)
    const [season,setSeason]=useState(null)
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [isSelected,setIsSelected]=useState(false)
    const exportModalClose=()=> {
        setIsSelected(false)
        setShowModal(false);
    }
    const confirmExportModal = () =>{
        setIsSelected(false);
        setShowModal(false);
        Alert.warning('Exportation encours...', 20000)
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
                break
            default:
                history.push(event)
        }
    }
    const exportModalopen=(event)=>{
        setSeason(event)
        setShowModal(true);
    }
    return (
        <div className='topnav'>
            <div className="topnav__search">
                <input type="text" placeholder='Search here...' />
                <i className='bx bx-search'></i>
            </div>
            <div className="topnav__right">
                <div className="topnav__right-item">
                    <Dropdown onSelect={handleDropDown} title="Mon Compte" placement="bottomEnd">
                            <Dropdown.Item panel style={{ padding: 10, width: 200 }} >
                                <p>Connecté en tant que</p>
                                <strong>{curr_user.display_name}</strong>
                            </Dropdown.Item>
                            <Dropdown.Item divider />
                            <Dropdown.Item eventKey="Profile" icon={<Icon icon="user" />}>Profile</Dropdown.Item>
                            <Dropdown.Item eventKey="Support" icon={<Icon icon="support" />}>Support</Dropdown.Item>
                            <Dropdown.Item divider />
                            <Dropdown.Item eventKey="logout" icon={<Icon icon="sign-out" />}>Se Deconnecter</Dropdown.Item>
                    </Dropdown>
                </div> 
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
                </div>  
                <div className="topnav__right-item">
                    <ThemeMenu />
                </div>
            </div>
            <ExportModal confirme={confirmExportModal} isSelected={isSelected} season={season} yearChange={handleYearChange} dateChange={handleIntervalDateChange} show={showModal} close={exportModalClose} />
        </div>
    )
}

export default Topnav

