import React,{useState} from 'react'
import './topnav.css'
import { Link } from 'react-router-dom'
import Dropdown from '../dropdown/Dropdown'
import ThemeMenu from '../thememenu/ThemeMenu'
import user_image from '../../assets/images/user.jpg'
import { Modal,Button,Icon,IconButton,Alert} from 'rsuite'
import user_menu from '../../assets/JsonData/user_menus.json'
import export_menu from '../../assets/JsonData/export.json'
import { DatePickerWeekDate,DatePickerMonthDate,YearSelect } from '../datepickers/DatePickers'

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
    const exportModalopen=(season)=> {
        setSeason(season)
        setShowModal(true);
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
    return (
        <div className='topnav'>
            <div className="topnav__search">
                <input type="text" placeholder='Search here...' />
                <i className='bx bx-search'></i>
            </div>
            <div className="topnav__right">
                <div className="topnav__right-item">

                    <Dropdown
                        key={1}
                        customToggle={() => renderUserToggle(curr_user)}
                        contentData={user_menu}
                        renderItems={(item, index) => renderUserMenu(item, index)}
                        renderFooter={() => 
                            <button className="logout_item">
                                <i className="bx bx-log-out-circle bx-rotate-180"></i>
                                Se Deconnecter
                            </button>
                        }
                    />
                    
                </div>                 
                <div className="topnav__right-item">
                    <Dropdown
                        key={2}
                        customToggle={() =>(

                                            <IconButton  icon={<Icon icon="export"/>} color="green" appearance="primary"  className="topnav__right-user__name">                                       
                                                Export
                                            </IconButton>) 
                                            }
                        contentData={export_menu}
                        renderItems={(item, index) => renderExportMenu(item, index,exportModalopen)}
                    />
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
