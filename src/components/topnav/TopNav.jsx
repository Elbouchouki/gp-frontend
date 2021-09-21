import React,{useState} from 'react'
import './topnav.css'
import {useHistory } from 'react-router-dom'
import Dropdownn from "../dropdown/Dropdown"
import ThemeMenu from '../thememenu/ThemeMenu'
import { Modal,Button,Icon,Alert,IconButton,Dropdown,AutoComplete, InputGroup,SelectPicker} from 'rsuite'
import { DatePickerWeekDate,DatePickerMonthDate,YearSelect ,DatePickerFreeDate} from '../datepickers/DatePickers'
import { ExcelExport,ExcelExportColumn, } from '@progress/kendo-react-excel-export';
import {aggregateBy } from "@progress/kendo-data-query";
import ApiCall from '../../api/Api'
import {useSelector,useDispatch } from 'react-redux'
import AuthAction from "../../redux/actions/AuthAction"
import moment from "moment";
import {getVille,monthFullSwitch} from "../../helper/helper"

const VilleSelect = ({items,handleUpdate,handleChange}) =>{
    return <SelectPicker
    block
    placeholder="Villes"
    data={items.filter(item => item.active === true)}
    style={{
        marginBottom: 10
    }}
    onOpen={handleUpdate}
    onChange={handleChange}
    searchable={false}
    renderMenu={menu => {
      if (items.length === 0) {
        return (
          <p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
            <Icon icon="spinner" spin /> Chargement en cours...
          </p>
        );
      }
      return menu;
    }}
  />
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
const ExportModal = ({isSelected,show,close,confirme,dateChange,yearChange,season,listVilles,handleVilleChange,handleVilleUpdate}) =>(
    
    <Modal size="xs" backdrop="static"  show={show} onHide={close}>
        <Modal.Header>
            <Modal.Title>
                Exportation vers excel
            </Modal.Title>
        </Modal.Header>
            <Modal.Body>
                <VilleSelect items={listVilles} handleChange={handleVilleChange} handleUpdate={handleVilleUpdate}/>
                <div>
                    {
                    season === 'week'?
                    <DatePickerWeekDate active={season} handleDateChange={dateChange} />
                    :season ==="month"?
                    <DatePickerMonthDate active={season} handleDateChange={dateChange} />
                    :season ==="year"?
                    <YearSelect handleChange={yearChange} />
                    :
                    <DatePickerFreeDate handleDateChange={dateChange} />
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
        value:"tickets",
        icon: "ticket"
    },{
        label:"Tickets Illisibles",
        value:"tickets",
        icon: "ticket"
    },{
        label:"Tickets Perdus",
        value:"tickets",
        icon: "ticket"
    },{
        label:"Recharges Abonnée(s)",
        value:"abonnés",
        icon: "credit-card"
    },{
        label:"Nouveaux Abonnée(s)",
        value:"abonnés",
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
    const token = authReducer.token
    const [exporter,setExporter] =useState(null)
    const search = React.createRef();
    const [showExportModal,setShowExportModal]=useState(false)
    const [showLogoutModal,setShowLogoutModal]=useState(false)
    const [season,setSeason]=useState(null)
    const [ville,setVille]=useState(null)
    const [listVilles,setListVilles]=useState([])
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [isSelected,setIsSelected]=useState(false)
    const [excelData,setExcelData]=useState(null)
    const handleVilleUpdate=async()=> {
        if (listVilles.length === 0) {
            const villes  = await ApiCall.getVilles(token)
            setListVilles(villes)
            return;
        }
    }
    const handleVilleChange=(value)=>{
        setVille(value)
     }
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
        Alert.info('Exportation encours...', 30000)
        Alert.warning("L'exportation prend du temps", 30000)
        const datesReq = await ApiCall.getDates(token,fromDate,toDate)
        const dateList = await datesReq?.result.map(element => element.date)
        var exData = [];
        if(ville){
            for(const element in dateList){
                var data = await  ApiCall.getExcelData(token,ville,dateList[element])
                exData.push(data?.result[0])
                let result = await element;
            }
        }else{
            for(const element in dateList){
                var data = await  ApiCall.getExcelDataAll(token,dateList[element])
                exData.push(data?.result[0])
                let result = await element;
            }
        }
        var excelFiltred = await exData?.map((ligne)=>({
                date:ligne.date_j,
                cm:(ligne.ticket_normal+ligne.ticket_illisible+ligne.ticket_perdu),
                abonne:ligne.recharge_abonne+ligne.nouveau_abonne+ligne.recharge_abonne_oncf,
                taj:ligne.total_an,
                total:ligne.total
            })
        )
        await setExcelData(excelFiltred)
        setVille(null)
        if(exporter){
            Alert.close()
            Alert.success('Telechargement ...', 5000)
            const options = exporter.workbookOptions();
            const rows = options.sheets[0].rows;
            options.sheets[0].frozenRows = 2;
            const interval = season==="month"?"MOIS "+monthFullSwitch(moment(toDate).month()+1)+" "+moment(fromDate).year():`DU ${moment(fromDate).format("DD/MM/YYYY")} AU ${moment(toDate).format("DD/MM/YYYY")}`
            const headerRow = {
                height: 70,
                cells: [
                  {
                    value: `REPORTING DES CA JOURNALIERES ${!ville?"DE TOUS LES PARKING":"DU PARKING DE "+getVille(ville)} EN DH/HT ${interval}`,
                    fontSize: 16,
                    colSpan: 5,
                    wrap:true,
                    textAlign:"center",
                    verticalAlign:"center"
                  },
                ],
              };
              rows.unshift(headerRow);
            try {
                exporter.save(options);
            } catch (error) {
                Alert.close()
                Alert.error('Erreur', 5000)
            }
            setExcelData(null)
            return
        }
        Alert.close()
        Alert.error('Exportation echoué', 5000)
    }
    
    const handleIntervalDateChange = async(value) => {
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
                            <Dropdown.Item disabled eventKey="year">Annuel (En maintenance)</Dropdown.Item>     
                            <Dropdown.Item eventKey="custom">Libre</Dropdown.Item>        
                    </Dropdown>
                </div>:null}  
                <div className="topnav__right-item">
                    <ThemeMenu />
                </div>
            </div>


            <ExcelExport
                data={excelData}
                fileName={`Reporting-${!ville?"Tous":getVille(ville)}-${moment(fromDate).format("DD/MM/YYYY")}-${moment(toDate).format("DD/MM/YYYY")}.xlsx`}
                ref={setExporter}
                filterable={true}
                creator="Elbouchouki"

            >   
                <ExcelExportColumn field="date" title="Date" width={120} 
                footer={()=>"Totals"}/>
                <ExcelExportColumn field="cm" title="CM (P)" width={120} 
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "cm",
                          aggregate: "sum",
                        },
                      ]);
                    return `${tol.cm.sum}`;
                }}/>
                <ExcelExportColumn field="abonne" title="AB" width={120} 
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "abonne",
                          aggregate: "sum",
                        },
                      ]);
                    return `${tol.abonne.sum}`;
                }}/>
                <ExcelExportColumn field="taj" title="T A JUSTIFER" width={120}
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "taj",
                          aggregate: "sum",
                        },
                      ]);
                    return `${tol.taj.sum}`;
                }}/>
                <ExcelExportColumn field="total" title="Total" width={120} 
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "total",
                          aggregate: "sum",
                        },
                      ]);
                    return `${tol.total.sum}`;
                }}/>
            </ExcelExport>

           
            <ExportModal confirme={confirmExportModal} isSelected={isSelected} season={season} yearChange={handleYearChange} dateChange={handleIntervalDateChange} show={showExportModal} close={exportModalClose} listVilles={listVilles} handleVilleChange={handleVilleChange} handleVilleUpdate={handleVilleUpdate}/>
            <LogoutModal handleLogout={handleLogout} show={showLogoutModal} close={logoutModalClose}/>
        </div>
    )
}

export default Topnav

