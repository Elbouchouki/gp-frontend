import React,{useState,useRef} from 'react'
import './topnav.css'
import {useHistory ,Link} from 'react-router-dom'
import Dropdownn from "../dropdown/Dropdown"
import ThemeMenu from '../thememenu/ThemeMenu'
import SpinnerIcon from '@rsuite/icons/legacy/Spinner'
import { Project , Search,HelpOutline,UserBadge,Exit ,Export,RemindFill,Gear,Menu } from '@rsuite/icons'
import { Modal,Button,Message,toaster,Dropdown,IconButton,AutoComplete,Whisper, InputGroup,Popover,SelectPicker,Tag,RadioGroup,Radio} from 'rsuite'
import { DatePickerWeekDate,DatePickerMonthDate,YearSelect,DatePickerFreeDate,HourPicker} from '../datepickers/DatePickers'
import { ExcelExport,ExcelExportColumn, } from '@progress/kendo-react-excel-export'
import {aggregateBy } from "@progress/kendo-data-query"
import ApiCall from '../../api/Api'
import {useSelector,useDispatch } from 'react-redux'
import { isMobile } from "react-device-detect";
import AuthAction from "../../redux/actions/AuthAction"
import moment from "moment"
import groupArray from 'group-array'
import {getVille,monthFullSwitch} from "../../helper/helper"
import smallLogo from '../../assets/images/favicon.png'
import logo from '../../assets/images/gestpark.svg'
import sidebar_items from '../../assets/JsonData/sidebar_routes.json'


const VilleSelect = ({items,handleUpdate,handleChange}) =>{
    return <SelectPicker
    block
    placeholder="Ville"
    data={items?.filter(item => item.active === true)}
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
const ExportModal = ({year,isSelected,hourType,setHourType,show,close,confirme,dateChange,handleHourChange,ville,yearChange,season,listVilles,handleVilleChange,handleVilleUpdate}) =>(
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
                    season === "oncf" ?null:<DatePickerFreeDate handleDateChange={dateChange} />
                    }
                    {season === "oncf" ?<YearSelect handleChange={yearChange}/>:<HourPicker active={isSelected?false:true} handleHourChange={handleHourChange}/>}
                    {season === "oncf" ?null:<RadioGroup onChange={setHourType} value={hourType} disabled={isSelected?false:true} name="radioList" inline appearance="picker" defaultValue="A">
                      <span style={{padding: '8px 2px 8px 10px',display: 'inline-block',verticalAlign: 'middle'}}>
                        Type d'heure: </span>
                      <Radio value="C">Continue</Radio>
                      <Radio value="P">Périodique</Radio>
                    </RadioGroup>}
                </div>
            </Modal.Body>
        <Modal.Footer>
            <Button color="green" disabled={season === "oncf" ?year?ville===null?true:false:true:isSelected?false:true} onClick={confirme} appearance="primary">
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
  const clickOutsideRef = (content_ref, toggle_ref) => {
    document.addEventListener('mousedown', (e) => {
        // user click toggle
        if (toggle_ref.current && toggle_ref.current.contains(e.target)) {
            content_ref.current.classList.toggle('active')
        } else {
            // user click outside toggle and content
            if (content_ref.current && !content_ref.current.contains(e.target)) {
                content_ref.current.classList.remove('active')
            }
        }
    })
}
const Topnav = props => {
    const history = useHistory()
    const dispatch = useDispatch()
    const authReducer = useSelector(state=>state.AuthReducer)
    const user = authReducer.user
    const permissions = authReducer.user.permissions
    const activeItem = sidebar_items.findIndex(item => item.route === props.location.pathname)
    const token = authReducer.token
    const [exporter,setExporter] =useState(null)
    const [oncf,setOncf] =useState(null)
    const [year,setYear] =useState(null)
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
    const nav_ref = useRef(null)
    const nav_toggle_ref = useRef(null)
    clickOutsideRef(nav_ref, nav_toggle_ref)
    const setActiveNav = () => nav_ref.current.classList.add('active')
    const closeNav = () => nav_ref.current.classList.remove('active')
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
        var excelFiltred = []
        if(season === "oncf"){
          
          const oncfData = await  ApiCall.getOncfData(token,ville,year);
          const oncfDataGrouped = groupArray(oncfData.result,'mois',"etats",'article_id')
          Object.keys(oncfDataGrouped).forEach(moisKey =>  
            {
            const nbr_abos = (oncfDataGrouped[moisKey]['confirmé']?.[6]?.[0]?.nbr||0)+(oncfDataGrouped[moisKey]['confirmé']?.[7]?.[0]?.nbr||0)+(oncfDataGrouped[moisKey]['confirmé']?.[8]?.[0]?.nbr||0)
            const cumul = (oncfDataGrouped[moisKey]['confirmé']?.[1]?.[0]?.montant||0)+(oncfDataGrouped[moisKey]['confirmé']?.[2]?.[0]?.montant||0)+(oncfDataGrouped[moisKey]['confirmé']?.[3]?.[0]?.montant||0+oncfDataGrouped[moisKey]['confirmé']?.[6]?.[0]?.montant||0)+(oncfDataGrouped[moisKey]['confirmé']?.[7]?.[0]?.montant||0)+(oncfDataGrouped[moisKey]['confirmé']?.[8]?.[0]?.montant||0)
            const abos = (oncfDataGrouped[moisKey]['confirmé']?.[6]?.[0]?.montant||0)+(oncfDataGrouped[moisKey]['confirmé']?.[7]?.[0]?.montant||0)+(oncfDataGrouped[moisKey]['confirmé']?.[8]?.[0]?.montant||0)
            excelFiltred.push({
                mois:"Cumul recette "+monthFullSwitch(parseInt(moisKey)),
                cumul:cumul,
                abos:(abos*100/cumul).toFixed(2),
                abo:abos,
                nbr_abos:nbr_abos,
            })
        })
        await setExcelData(excelFiltred)
        console.log(excelFiltred)
        }else{
          const data = await  ApiCall.getExcelData(token,season,ville,fromDate,toDate,fromHour,toHour,isHourSelected,hourType)
          const groupedData = groupArray(data.result,'date',"etats",'article_id')
          Object.keys(groupedData).forEach(dateKey =>  
              {
              const nbr_cm = (groupedData[dateKey]['confirmé']?.[1]?.[0]?.nbr||0)+(groupedData[dateKey]['confirmé']?.[2]?.[0]?.nbr||0)+(groupedData[dateKey]['confirmé']?.[3]?.[0]?.nbr||0)
              const cm = (groupedData[dateKey]['confirmé']?.[1]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[2]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[3]?.[0]?.montant||0)
              const n_abonne = parseInt(groupedData[dateKey]['confirmé']?.[6]?.[0]?.nbr||0)
              const r_abonne = parseInt(groupedData[dateKey]['confirmé']?.[7]?.[0]?.nbr||0)
              const rr_abonne = parseInt(groupedData[dateKey]['confirmé']?.[8]?.[0]?.nbr||0)
              const abonne = (groupedData[dateKey]['confirmé']?.[6]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[7]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[8]?.[0]?.montant||0)
              const nbr_taj = (groupedData[dateKey]['annulé']?.[1]?.[0]?.nbr||0)+(groupedData[dateKey]['annulé']?.[2]?.[0]?.nbr||0)+(groupedData[dateKey]['annulé']?.[3]?.[0]?.nbr||0)
              const taj = (groupedData[dateKey]['annulé']?.[1]?.[0]?.montant||0)+(groupedData[dateKey]['annulé']?.[2]?.[0]?.montant||0)+(groupedData[dateKey]['annulé']?.[3]?.[0]?.montant||0)+(groupedData[dateKey]['annulé']?.[6]?.[0]?.montant||0)+(groupedData[dateKey]['annulé']?.[7]?.[0]?.montant||0)+(groupedData[dateKey]['annulé']?.[8]?.[0]?.montant||0)
              const total = (groupedData[dateKey]['confirmé']?.[1]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[2]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[3]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[6]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[7]?.[0]?.montant||0)+(groupedData[dateKey]['confirmé']?.[8]?.[0]?.montant||0)
              excelFiltred.push({
                  date:dateKey,
                  nbr_cm:nbr_cm,
                  cm:cm,
                  n_abonne:n_abonne,
                  r_abonne:r_abonne,
                  rr_abonne:rr_abonne,
                  abonne:abonne,
                  nbr_taj:nbr_taj,
                  taj:taj,
                  total:total
              })
          })
          console.log(excelFiltred)
          await setExcelData(excelFiltred)
        }
        setIsHourSelected(false)
        if(season!=="oncf"&&exporter){
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
            options.sheets[0].frozenRows = 3
            const type = hourType === "C"?"Continue":"Périodique"
            const interval = season==="month"?isHourSelected?"MOIS "+monthFullSwitch(moment(toDate).month()+1)+" "+moment(fromDate).year()+`${"| "+moment(fromHour).format("HH:mm")+" --> "+moment(toHour).format("HH:mm")+" "+type}`:"MOIS "+monthFullSwitch(moment(toDate).month()+1)+" "+moment(fromDate).year():isHourSelected?`DU ${moment(fromDate).format("DD/MM/YYYY")} AU ${moment(toDate).format("DD/MM/YYYY")} | ${+" "+moment(fromHour).format("HH:mm")+" --> "+moment(toHour).format("HH:mm")+" "+type}`:`DU ${moment(fromDate).format("DD/MM/YYYY")} AU ${moment(toDate).format("DD/MM/YYYY")}`
            const headerRow = {
                height: 40,
                cells: [
                  {
                    value: `REPORTING DES CAS JOURNALIERES ${!ville?"DE TOUS LES PARKING":"DU PARKING DE "+getVille(ville)} EN DH/TTC ${interval}`,
                    fontSize: 14,
                    colSpan: 10,
                    wrap:true,
                    textAlign:"center",
                    verticalAlign:"center",
                    bold:true
                  },
                ],
              }
              const borderStyle = {
                color: "black",
                size: "1",
              }
              const emptyRow={
                "value": "",
                "colSpan": 1,
                "firstCell": false,
                "rowSpan": 1,
                textAlign:"center",
                verticalAlign:"center"
            }
            const subHeaderRow = {
                cells: [
                  emptyRow,
                  {
                      "background": "#7a7a7a",
                      "color": "#fff",
                      "value": "Tickets",
                      "colSpan": 2,
                      "firstCell": false,
                      "rowSpan": 1,
                      textAlign:"center",
                      verticalAlign:"center",
                      borderBottom:borderStyle,
                      borderLeft:borderStyle,
                      borderRight:borderStyle,
                      borderTop:borderStyle,
                  },
                  {
                      "background": "#7a7a7a",
                      "color": "#fff",
                      "value": "Tickets à justifiés",
                      "colSpan": 2,
                      "firstCell": false,
                      "rowSpan": 1,
                      textAlign:"center",
                      verticalAlign:"center",
                      borderBottom:borderStyle,
                      borderLeft:borderStyle,
                      borderRight:borderStyle,
                      borderTop:borderStyle,
                  },
                  {
                    "background": "#7a7a7a",
                    "color": "#fff",
                    "value": "Abonnements",
                    "colSpan": 4,
                    "firstCell": false,
                    "rowSpan": 1,
                    textAlign:"center",
                    verticalAlign:"center",
                    borderBottom:borderStyle,
                    borderLeft:borderStyle,
                    borderRight:borderStyle,
                    borderTop:borderStyle,
                },
                  emptyRow,
                  emptyRow
                ]
            }
              rows[0].cells.push({background: "#7a7a7a",
                                colSpan: 1,
                                color: "#fff",
                                firstCell: false,
                                value: "Change",
                                textAlign:"center",
                                verticalAlign:"center"})
              rows.forEach((row) => {
                row.cells.forEach(cell=>{
                  cell["borderBottom"]=borderStyle
                  cell["borderLeft"]=borderStyle
                  cell["borderRight"]=borderStyle
                  cell["borderTop"]=borderStyle
                })
                if (row.type === "data") {
                    let thisDay = parseFloat(row.cells[9].value)
                    if(rowIndex === 0){
                        row.cells.push({value: "", background: "#000"})
                        lastDay=thisDay
                      }else{
                        let value = ((thisDay-lastDay)/lastDay).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })
                        let background = ((thisDay-lastDay)/lastDay*100)<0?"#ed6065":"#48cc79"
                        row.cells.push({value: value, background: background})
                        lastDay=thisDay
                      }
                      rowIndex++
                }
              })
              rows.unshift(subHeaderRow)
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
        if(season ==="oncf"&&oncf){
          toaster.clear()
             toaster.push(
                <Message type="success" showIcon closable>
                  Telechargement ...   
                </Message>
              )
            const options = oncf.workbookOptions()
            const rows = options.sheets[0].rows
            options.sheets[0].frozenRows = 2
            const headerRow = {
                height: 70,
                cells: [
                  {
                    value: `REPORTING ANNEE ${year+" DU PARKING DE "+getVille(ville)}`,
                    fontSize: 16,
                    colSpan: 4,
                    wrap:true,
                    textAlign:"center",
                    verticalAlign:"center"
                  },
                ],
              }
              rows.unshift(headerRow)
            try {
              oncf.save(options)
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
                <Dropdown.Item eventKey="oncf">{"Recettes "}<Tag>DEV</Tag></Dropdown.Item>
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
      if(season ==="oncf"){
        setYear(year)
        return
      }
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
    const SidebarItem = props => {
      const active = props.active ? 'active' : ''
      return (
          <div className="sidebar__item">
              <div className={`sidebar__item-inner ${active}`}>
                  <i className={props.icon}></i>
                  <span>
                      {props.title}{"  "}{props.dev ?<Tag>En développment</Tag>:null}
                  </span>
              </div>
          </div>
      )
  }
    return (
      <div className="navLayout">
        <div className="navButton">
              <button ref={nav_toggle_ref} onClick={()=>{}
                // () => setActiveNav()
                }>
                  <Menu style={{fontSize:"1.5em"}}/>
              </button>
              <div ref={nav_ref} className="nav-mobile">
                  {/* <h4>Navigation</h4> */}
                  <button className="nav-mobile__close" onClick={() => closeNav()}>
                      <i className='bx bx-x'></i>
                  </button>
                  <div className="sidebar__logo">
                    <img src={smallLogo} alt="small" /> <img src={logo} alt="gestpark" />
                  </div>
                  <div className="sideContent">
                      {
                          sidebar_items.map((item, index) => {
                              if (permissions.some((element) => element.name === item.role ||  item.role === undefined)){
                                  
                                  return <Link to={item.route} key={index}>
                                              <SidebarItem
                                                  title={item.display_name}
                                                  icon={item.icon}
                                                  active={index === activeItem}
                                                  dev={item.dev}
                                              />
                                          </Link>
                              }
                              return null  
                          })
                      }
                  </div>
              </div>
          </div>
          <div className="searching">
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
              </div>
        <div className='topnav'>
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
                        

                    {isMobile?
                    <Whisper placement="bottomEnd" trigger="click" speaker={renderMenu}>
                      <IconButton color="green" appearance="primary" icon={<Export/>} placement="right" circle/>
                    </Whisper>
                    :
                    <Whisper placement="bottomStart" trigger="click" speaker={renderMenu}>
                        <IconButton color="green" appearance="primary" icon={<Export style={{
                            color:"white",
                            backgroundColor:"green"
                        }} />} placement="left">
                            Exporter
                        </IconButton>
                    </Whisper>}
                </div>:null}  
                <div className="menu topnav__right-item">
                    <ThemeMenu />
                </div>
            </div>
            <ExcelExport
                data={excelData}
                fileName={`Reporting-${!ville?"Tous":getVille(ville)}-${moment(fromDate).format("DD/MM/YYYY")}-${moment(toDate).format("DD/MM/YYYY")}.xlsx`}
                ref={setExporter}
                filterable={true}
                creator="GestParkCorp"
            >   
                <ExcelExportColumn field="date" title="Date" width={120}
                  footer={()=>"Totals"}
                  headerCellOptions={{
                    textAlign:"center",
                    verticalAlign:"center"
                  }}
                />
                <ExcelExportColumn field="nbr_cm"
                title="Nombre"
                width={100} 
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "nbr_cm",
                          aggregate: "sum",
                        },
                      ])
                    return `${tol.nbr_cm?.sum===undefined?0:tol.nbr_cm?.sum}`
                }}
                headerCellOptions={{
                  textAlign:"center",
                  verticalAlign:"center"
                }}
                />
                <ExcelExportColumn field="cm"
                title="CA"
                headerCellOptions={{
                  textAlign:"center",
                  verticalAlign:"center"
                }}
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
                <ExcelExportColumn field="nbr_taj" 
                title="Nombre" 
                headerCellOptions={{
                  textAlign:"center",
                  verticalAlign:"center"
                }}
                width={100}
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
                title="CA" 
                headerCellOptions={{
                  textAlign:"center",
                  verticalAlign:"center"
                }}
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
                <ExcelExportColumn field="n_abonne" 
                title="N" 
                width={80} 
                headerCellOptions={{
                  textAlign:"center",
                  verticalAlign:"center"
                }}
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "n_abonne",
                          aggregate: "sum",
                        },
                      ])
                    return `${tol.n_abonne?.sum===undefined?0:tol.n_abonne?.sum}`
                }}/>
                <ExcelExportColumn field="r_abonne" 
                title="R" 
                width={80} 
                headerCellOptions={{
                  textAlign:"center",
                  verticalAlign:"center"
                }}
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "r_abonne",
                          aggregate: "sum",
                        },
                      ])
                    return `${tol.r_abonne?.sum===undefined?0:tol.r_abonne?.sum}`
                }}/>
                <ExcelExportColumn field="rr_abonne" 
                title="R+" 
                width={80} 
                headerCellOptions={{
                  textAlign:"center",
                  verticalAlign:"center"
                }}
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "rr_abonne",
                          aggregate: "sum",
                        },
                      ])
                    return `${tol.rr_abonne?.sum===undefined?0:tol.rr_abonne?.sum}`
                }}/>
                <ExcelExportColumn field="abonne" 
                title="CA Abonnements" 
                width={150} 
                headerCellOptions={{
                  textAlign:"center",
                  verticalAlign:"center"
                }}
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "abonne",
                          aggregate: "sum",
                        },
                      ])
                    return `${tol.abonne?.sum===undefined?0:tol.abonne?.sum}`
                }}/>
                
                <ExcelExportColumn field="total"
                title="Total CA en DH/TTC"
                width={150} 
                headerCellOptions={{
                  textAlign:"center",
                  verticalAlign:"center"
                }}
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
            {/* ------------------------------- separation ------------------------------- */}
            <ExcelExport
                data={excelData}
                fileName={`Reporting-${getVille(ville)+"-"+year}.xlsx`}
                ref={setOncf}
                filterable={true}
                creator="GestParkCorp"
            >   
                <ExcelExportColumn field="mois" title="Mois" width={200} 
                footer={()=>"Cumul recettes exercice en cours"}/>
                <ExcelExportColumn field="cumul"
                title="Cumul recette"
                width={100} 
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "cumul",
                          aggregate: "sum",
                        },
                      ])
                    return `${tol.cumul?.sum===undefined?0:tol.cumul?.sum}`
                }}/>
                <ExcelExportColumn field="abos"
                title="Dont Recette abonnements %"
                width={120} 
                footer={() => {
                    const abo = aggregateBy(excelData, [
                        {
                          field: "abo",
                          aggregate: "sum",
                        },
                      ])
                      const recette = aggregateBy(excelData, [
                        {
                          field: "cumul",
                          aggregate: "sum",
                        },
                      ])
                      const res = (abo?.abo?.sum*100/recette.cumul.sum).toFixed(2)
                    return `${res||0}`
                }}/>
                <ExcelExportColumn field="nbr_abos" 
                title="Nombre abonnés" 
                width={120} 
                footer={() => {
                    const tol = aggregateBy(excelData, [
                        {
                          field: "nbr_abos",
                          aggregate: "sum",
                        },
                      ])
                    return `${tol.nbr_abos?.sum===undefined?0:tol.nbr_abos?.sum}`
                }}/>
            </ExcelExport>
            <ExportModal year={year} ville={ville} setHourType={setHourType} hourType={hourType} handleHourChange={handleHourChange} confirme={confirmExportModal} isSelected={isSelected} season={season} yearChange={handleYearChange} dateChange={handleIntervalDateChange} show={showExportModal} close={exportModalClose} listVilles={listVilles} handleVilleChange={handleVilleChange} handleVilleUpdate={handleVilleUpdate}/>
            <LogoutModal handleLogout={handleLogout} show={showLogoutModal} close={logoutModalClose}/>
        </div>
      </div>
    )
}

export default Topnav

