import React,{useState} from 'react'
import './topnav.css'
import {useHistory } from 'react-router-dom'
import Dropdownn from "../dropdown/Dropdown"
import ThemeMenu from '../thememenu/ThemeMenu'
import SpinnerIcon from '@rsuite/icons/legacy/Spinner'
import { Project , Search,HelpOutline,UserBadge,Exit ,Export,RemindFill} from '@rsuite/icons'
import { Modal,Button,Message,toaster,Dropdown,IconButton,AutoComplete,Whisper, InputGroup,Popover,SelectPicker,DateRangePicker,RadioGroup,Radio} from 'rsuite'
import { DatePickerWeekDate,DatePickerMonthDate,YearSelect} from '../datepickers/DatePickers'
import { ExcelExport,ExcelExportColumn, } from '@progress/kendo-react-excel-export'
import {aggregateBy } from "@progress/kendo-data-query"
import ApiCall from '../../api/Api'
import {useSelector,useDispatch } from 'react-redux'
import AuthAction from "../../redux/actions/AuthAction"
import moment from "moment"
import groupArray from 'group-array'
import {getVille,monthFullSwitch} from "../../helper/helper"

const VilleSelect = ({items,handleUpdate,handleChange}) =>{
    return <SelectPicker
    block
    placeholder="Ville*"
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
            <SpinnerIcon pulse style={{ fontSize: '2em' }} /> Chargement en cours...
          </p>
        )
      }
      return menu
    }}
  />
}

const DatePickerFreeDate = ({ handleDateChange }) => {
    return (
      <DateRangePicker
        isoWeek
        cleanable={false}
        block
        style={{marginBottom: 10}}
        onChange={(value) => {
          handleDateChange(value)
        }}
        placeholder="Date Libre"
        ranges={[
          {
            label: "Ce Mois",
            value: [
              moment().startOf("month").toDate(),
              moment().endOf("month").toDate(),
            ],
          },
          {
            label: "Cette Semaine",
            value: [
              moment().startOf("week").toDate(),
              moment().endOf("week").toDate(),
            ],
          },
          {
            label: "Cette Année",
            value: [
              moment().startOf("year").toDate(),
              moment().endOf("year").toDate(),
            ],
          },
        ]}
        format="dd/MM/yyyy"
        locale={{
          sunday: "Dim",
          monday: "Lun",
          tuesday: "Mar",
          wednesday: "Mer",
          thursday: "Jeu",
          friday: "Ven",
          saturday: "Sam",
          ok: "OK",
          today: "Aujourd'hui",
          yesterday: "Hier",
          last7Days: "Last 7 days",
        }}
      />
    )
  }


  const HourPicker = ({active, handleHourChange }) => {
    return (
      <DateRangePicker
        isoWeek
        disabled={active}
        block
        style={{marginBottom: 10}}
        onChange={(value) => {
          handleHourChange(value)
        }}
        placeholder="Heure*"
        ranges={[]}
        format="HH:mm"
        locale={{
          sunday: "Dim",
          monday: "Lun",
          tuesday: "Mar",
          wednesday: "Mer",
          thursday: "Jeu",
          friday: "Ven",
          saturday: "Sam",
          ok: "OK",
          today: "Aujourd'hui",
          yesterday: "Hier",
          last7Days: "Last 7 days",
        }}
      />
    )
  }


const LogoutModal = ({handleLogout,show,close})=>(
        <Modal backdrop="static" open={show} onClose={close} size="xs">
            <Modal.Body>
            <RemindFill
                color='#ffb300'
                style={{
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
const ExportModal = ({isSelected,hourType,setHourType,show,close,confirme,dateChange,handleHourChange,yearChange,season,listVilles,handleVilleChange,handleVilleUpdate}) =>(
    
    <Modal size="xs" backdrop="static"  open={show} onClose={close}>
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
                    <HourPicker active={isSelected?false:true} handleHourChange={handleHourChange}/>
                    <RadioGroup onChange={setHourType} value={hourType} disabled={isSelected?false:true} name="radioList" inline appearance="picker" defaultValue="A">
                      <span style={{padding: '8px 2px 8px 10px',display: 'inline-block',verticalAlign: 'middle'}}>
                        Type d'heure: </span>
                      <Radio value="C">Continue</Radio>
                      <Radio value="P">Périodique</Radio>
                    </RadioGroup>
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
        label:"Tickets",
        value:"tickets",
        icon: "ticket"
    },{
        label:"Abonnée(s)",
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
  ]
  
const Topnav = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const authReducer = useSelector(state=>state.AuthReducer)
    const user = authReducer.user
    const token = authReducer.token
    const [exporter,setExporter] =useState(null)
    const search = React.createRef()
    const [showExportModal,setShowExportModal]=useState(false)
    const [showLogoutModal,setShowLogoutModal]=useState(false)
    const [season,setSeason]=useState(null)
    const [ville,setVille]=useState(null)
    const [searchValue, setSearchValue] = React.useState('');
    const [listVilles,setListVilles]=useState([])
    const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [fromHour, setFromHour] = useState(null)
    const [toHour, setToHour] = useState(null)
    const [isHourSelected,setIsHourSelected]=useState(false)
    const [hourType,setHourType]=useState('C')
    const [isSelected,setIsSelected]=useState(false)
    const [excelData,setExcelData]=useState(null)
    const handleVilleUpdate=async()=> {
        if (listVilles.length === 0) {
            const villes  = await ApiCall.getVilles(token)
            setListVilles(villes)
            return
        }
    }
    const handleVilleChange=(value)=>{
        setVille(value)
     }
    const exportModalClose=()=> {
        setIsSelected(false)
        setIsHourSelected(false)

        setShowExportModal(false)
    }
    const logoutModalClose=()=> {
        setShowLogoutModal(false)
    }
    const exportModalopen=(event)=>{
        setVille(null)
        setSeason(event)
        setShowExportModal(true)
    }
    const logoutModalopen=()=>{
        setShowLogoutModal(true)
    }
    const confirmExportModal = async () =>{
        setIsSelected(false)
        setShowExportModal(false)
        toaster.push(
            <Message type="warning" showIcon closable>
              Exportation encours...     
            </Message>
          )
        const data = await  ApiCall.getExcelData(token,season,ville,fromDate,toDate,fromHour,toHour,isHourSelected,hourType)
        var excelFiltred = []
        const groupedData = groupArray(data.result,'date',"etats",'article_id')
        Object.keys(groupedData).forEach(dateKey =>  
            {
            const nbr_cm = (groupedData[dateKey]['confirmé']?.[1]?.[0]?.nbr||0)+(groupedData[dateKey]['confirmé']?.[2]?.[0]?.nbr||0)+(groupedData[dateKey]['confirmé']?.[3]?.[0]?.nbr||0)
            const cm = (groupedData[dateKey]['confirmé']?.[1]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[2]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[3]?.[0]?.montant||0)
            const abonne = (groupedData[dateKey]['confirmé']?.[6]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[7]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[8]?.[0]?.montant||0)
            const nbr_taj = (groupedData[dateKey]['annulé']?.[1]?.[0]?.nbr||0)+(groupedData[dateKey]['annulé']?.[2]?.[0]?.nbr||0)+(groupedData[dateKey]['annulé']?.[3]?.[0]?.nbr||0)
            const taj = (groupedData[dateKey]['annulé']?.[1]?.[0]?.montant||0)+(groupedData[dateKey]['annulé']?.[2]?.[0]?.montant||0)+(groupedData[dateKey]['annulé']?.[3]?.[0]?.montant||0)+(groupedData[dateKey]['annulé']?.[6]?.[0]?.montant||0)+(groupedData[dateKey]['annulé']?.[7]?.[0]?.montant||0)+(groupedData[dateKey]['annulé']?.[8]?.[0]?.montant||0)
            const total = (groupedData[dateKey]['confirmé']?.[1]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[2]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[3]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[6]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[7]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[8]?.[0]?.montant||0)
            excelFiltred.push({
                date:dateKey,
                nbr_cm:nbr_cm,
                cm:cm,
                abonne:abonne,
                nbr_taj:nbr_taj,
                taj:taj,
                total:total
            })
        })
        await setExcelData(excelFiltred)
        setIsHourSelected(false)
        if(exporter){
             toaster.clear()
             toaster.push(
                <Message type="success" showIcon closable>
                  Telechargement ...   
                </Message>
              )
            const options = exporter.workbookOptions()
            const rows = options.sheets[0].rows
            let rowIndex = 0
            let lastDay = 0
            options.sheets[0].frozenRows = 2
            const type = hourType === "C"?"Continue":"Périodique"
            const interval = season==="month"?isHourSelected?"MOIS "+monthFullSwitch(moment(toDate).month()+1)+" "+moment(fromDate).year()+`${"| "+moment(fromHour).format("HH:mm")+" --> "+moment(toHour).format("HH:mm")+" "+type}`:"MOIS "+monthFullSwitch(moment(toDate).month()+1)+" "+moment(fromDate).year():isHourSelected?`DU ${moment(fromDate).format("DD/MM/YYYY")} AU ${moment(toDate).format("DD/MM/YYYY")} | ${+" "+moment(fromHour).format("HH:mm")+" --> "+moment(toHour).format("HH:mm")+" "+type}`:`DU ${moment(fromDate).format("DD/MM/YYYY")} AU ${moment(toDate).format("DD/MM/YYYY")}`
            const headerRow = {
                height: 70,
                cells: [
                  {
                    value: `REPORTING DES CAS JOURNALIERES ${!ville?"DE TOUS LES PARKING":"DU PARKING DE "+getVille(ville)} EN DH/TTC ${interval}`,
                    fontSize: 16,
                    colSpan: 7,
                    wrap:true,
                    textAlign:"center",
                    verticalAlign:"center"
                  },
                ],
              }
              rows[0].cells.push({background: "#7a7a7a",
                                colSpan: 1,
                                color: "#fff",
                                firstCell: false,
                                rowSpan: 1,
                                value: "Change"})
              rows.forEach((row) => {
                if (row.type === "data") {
                    let thisDay = parseFloat(row.cells[6].value)
                    if(rowIndex === 0){
                        row.cells.push({value: "", background: "#000"})
                        lastDay=thisDay
                      }else{
                        let value = ((thisDay-lastDay)/lastDay).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })
                        let background = ((thisDay-lastDay)/lastDay*100)<0?"#ff6e6e":"#3ec215"
                        row.cells.push({value: value, background: background})
                        lastDay=thisDay
                      }
                      rowIndex++
                }
              })
              rows.unshift(headerRow)
            try {
              exporter.save(options)
            } catch (error) {
                 toaster.clear()
                 toaster.push(
                    <Message type="error" showIcon closable>
                      Erreur  
                    </Message>
                  )
            }
            setExcelData(null)
            return
        }
         toaster.clear()
         toaster.push(
            <Message type="error" showIcon closable>
              Exportation echoué  
            </Message>
          )
    }
    const renderMenu = ({ onClose, left, top, className }, ref) => {
        return (
          <Popover ref={ref} className={className} style={{ left, top }} full>
            <Dropdown.Menu onSelect={exportModalopen}>
                <Dropdown.Item eventKey="week">Hebdomadaire</Dropdown.Item>
                <Dropdown.Item eventKey="month">Mensuel</Dropdown.Item>
                <Dropdown.Item eventKey="year">Annuel</Dropdown.Item>     
                <Dropdown.Item eventKey="free">Libre</Dropdown.Item>
            </Dropdown.Menu>
          </Popover>
        )
      }
    const handleIntervalDateChange = async(value) => {
        setIsSelected(true)
        setFromDate(value[0])
        setToDate(value[1])
    }
    const handleHourChange = async(value) => {
        setIsHourSelected(true)
        setFromHour(value[0])
        setToHour(value[1])
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
        history.push(item)
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
                    <AutoComplete ref={search} value={searchValue} onChange={setSearchValue} data={searchTypes} onSelect={handleSearch}
                    placeholder="Recherche"
                    renderItem={item => {
                        return (
                          <div>
                            {/* <Icon icon={item.icon} style={{marginRight: 10}}/>  */}
                            <Project style={{marginRight: 10}} />
                            <strong>{item.label}</strong>
                          </div>
                        )
                      }}
                    />
                    <InputGroup.Addon>
                        <Search/>
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
                            <Dropdown.Item eventKey="Profile" icon={<UserBadge/>}>Profile</Dropdown.Item>
                            <Dropdown.Item eventKey="Support" icon={<HelpOutline />}>Support</Dropdown.Item>
                            <Dropdown.Item divider />
                            <Dropdown.Item eventKey="logout" icon={<Exit />}>Se Deconnecter</Dropdown.Item>
                    </Dropdown>
                </div> 
                {user.permissions.some((element) => element.name === "export_excel")
                ?
                <div className="topnav__right-item">
                    <Whisper placement="bottomStart" trigger="click" speaker={renderMenu}>
                        <IconButton color="green" appearance="primary" icon={<Export style={{
                            color:"white",
                            backgroundColor:"green"
                        }} />} placement="left">
                            Exporter
                        </IconButton>
                    </Whisper>
                    {/* <Dropdown
                    title="Exporter"
                        onSelect={exportModalopen}
                        icon={<Export  style={{
                                                fontSize:"1.5em"
                                            }}/>}
                        
                        placement="bottomEnd"
                        >
                            <Dropdown.Item eventKey="week">Hebdomadaire</Dropdown.Item>
                            <Dropdown.Item eventKey="month">Mensuel</Dropdown.Item>
                            <Dropdown.Item eventKey="year">Annuel</Dropdown.Item>     
                            <Dropdown.Item eventKey="custom">Libre</Dropdown.Item>        
                    </Dropdown> */}
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
                creator="GestPark"

            >   
                <ExcelExportColumn field="date" title="Date" width={120} 
                footer={()=>"Totals"}/>
                <ExcelExportColumn field="nbr_cm"
                title="nbrT"
                width={60} 
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "nbr_cm",
                          aggregate: "sum",
                        },
                      ])
                    return `${tol.nbr_cm?.sum===undefined?0:tol.nbr_cm?.sum}`
                }}/>
                <ExcelExportColumn field="cm"
                title="CM (P)"
                width={120} 
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "cm",
                          aggregate: "sum",
                        },
                      ])
                    return `${tol.cm?.sum===undefined?0:tol.cm?.sum}`
                }}/>
                <ExcelExportColumn field="abonne" 
                title="AB" 
                width={120} 
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "abonne",
                          aggregate: "sum",
                        },
                      ])
                    return `${tol.abonne?.sum===undefined?0:tol.abonne?.sum}`
                }}/>
                <ExcelExportColumn field="nbr_taj" 
                title="nbrT" 
                width={60}
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "nbr_taj",
                          aggregate: "sum",
                        },
                      ])
                    return `${tol.nbr_taj?.sum===undefined?0:tol.nbr_taj?.sum}`
                }}/>
                <ExcelExportColumn field="taj" 
                title="T A JUSTIFER" 
                width={120}
                // cellOptions={{
                //     background: "#ff6e6e",
                // }}
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "taj",
                          aggregate: "sum",
                        },
                      ])
                    return `${tol.taj?.sum===undefined?0:tol.taj?.sum}`
                }}/>
                <ExcelExportColumn field="total"
                title="Total"
                width={120} 
                // cellOptions={{
                //     background: "#3ec215",
                // }}
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "total",
                          aggregate: "sum",
                        },
                      ])
                    return `${tol.total?.sum===undefined?0:tol.total?.sum}`
                }}/>
            </ExcelExport>
            <ExportModal setHourType={setHourType} hourType={hourType} handleHourChange={handleHourChange} confirme={confirmExportModal} isSelected={isSelected} season={season} yearChange={handleYearChange} dateChange={handleIntervalDateChange} show={showExportModal} close={exportModalClose} listVilles={listVilles} handleVilleChange={handleVilleChange} handleVilleUpdate={handleVilleUpdate}/>
            <LogoutModal handleLogout={handleLogout} show={showLogoutModal} close={logoutModalClose}/>
        </div>
    )
}

export default Topnav

