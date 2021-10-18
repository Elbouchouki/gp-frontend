import React ,{ useState ,useEffect }from 'react'
import Table from '../components/table/Table'
import moment from 'moment'
import { Nav ,Loader,SelectPicker,IconButton ,Tag,toaster,Message } from 'rsuite'
import { ExcelExport,ExcelExportColumn, } from '@progress/kendo-react-excel-export'
import { Detail } from '@rsuite/icons';
import {aggregateBy } from "@progress/kendo-data-query"
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import { DatePickerDate,DatePickerFreeDate,DatePickerWeekDate,DatePickerMonthDate,YearSelect } from '../components/datepickers/DatePickers'
import ApiCall from '../api/Api'
import { useSelector } from 'react-redux'
import {getVille} from "../helper/helper"
import { isElementOfType } from 'react-dom/cjs/react-dom-test-utils.production.min'

const renderHead = (item, index) => <th key={index}>{item}</th>
const styles = {
    marginBottom: 10
};
const CustomNav = ({ active, onSelect, ...props }) => {
    return (
        <Nav  {...props} activeKey={active} onSelect={onSelect} style={{marginBottom:20}}>
            <Nav.Item eventKey="day">Jour</Nav.Item>
            <Nav.Item eventKey="week">Semaine</Nav.Item>
            <Nav.Item eventKey="month">Mois</Nav.Item>
            <Nav.Item eventKey="year">Année</Nav.Item>
            <Nav.Item eventKey="free">Libre</Nav.Item>
        </Nav>
    );
};

const VilleSelect = ({items,handleUpdate,handleChange}) =>{
    return <SelectPicker
    block
    placeholder="Villes"
    data={items}
    disabledItemValues={(items.filter(item => item.active === false)).map(item => item.value)}
    style={styles}
    onOpen={handleUpdate}
    onChange={handleChange}
    onSearch={handleUpdate}
    renderMenu={menu => {
      if (items.length === 0) {
        return (
          <p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
            <SpinnerIcon pulse style={{ fontSize: '2em' }} /> Chargement en cours...
          </p>
        );
      }
      return menu;
    }}
  />
}


const Bilan = (props) => {
    const authReducer = useSelector(state=>state.AuthReducer)
    const token = authReducer.token
    const [active, setActive] = useState('day')
    const [fromDate, setFromDate] = useState(new Date())
    const [exporter,setExporter] =useState(null)
    const [toDate, setToDate] = useState(new Date())
    const [loading,setLoading] = useState(true)
    const [listBilans,setListBilans]=useState([])
    const [listVilles,setListVilles]=useState([])
    const [filtredBilans,setfiltredBilans]=useState([])
    const [excelData,setExcelData]=useState(null)
    const [exportLoading,setExportLoading]=useState(false)
    const [ville,setVille]=useState(null)
    const handleIntervalDateChange = (value) => {
        setFromDate(value[0])
        setToDate(value[1])
    }
    const handleDateChange = (value) => {    

        setFromDate(value)
        setToDate(value)
    }
    const handleYearChange = (year) =>{

        setFromDate(new Date(year,0,1))
        setToDate(new Date(year,11,31))
    }
    const handleSelect = (activeKey) => {
        if(active=== activeKey){
            return
        }
        setActive(activeKey);
    }
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
    const renderBody = (item, index) => {
        const duration = moment.duration(moment(item.date_f,'DD/MM/YYYY HH:mm').diff(moment(item.date_d,'DD/MM/YYYY HH:mm')))
        const hours = parseInt(duration.asHours())
        const minutes = duration.asMinutes()%60
        const dur = hours?minutes?hours+"h:"+minutes+"m":hours+"h":minutes+"min"
        return(<tr key={index}>
            <td>{item.poste}</td>
            {/* <td>{item.caisse}</td> */}
            <td>{item.caisser}</td>
            <td>{item.montant+" Dh"}</td>
            <td>{item.date_d}</td>
            <td>{item.date_f}</td>
            <td>{dur}</td>
            <td>{item.Ville.nom_ville}</td>
            {/* <td><Tag color={item.etats==="confirmé"?"green":"red"} >{item.etats} </Tag></td> */}
        </tr>)
    }
        
        
    
    const customerTableHead =[
        'Poste',
        // 'Caisse',
        'Caisser',
        'Montant',
        'Date de début',
        'Date de fin',
        'Durée',
        'Ville'
    ]
    useEffect(() => {
        async function filterBilans(){
            await setTimeout(setLoading(true),500)
            var filtred = []
            if ((ville===null || ville===undefined)){
                filtred=listBilans
            }else{
                filtred.push(...listBilans.filter(item => item.Ville.id === ville ))
            }
            setfiltredBilans(filtred)
            setLoading(false)
        }
        filterBilans()
        return () => {
            setLoading(true)
            setfiltredBilans([])
          };
        
    }, [listBilans,ville])

    useEffect(() => {
        async function fetchBilans(){
            setLoading(true)
            const bilans = await ApiCall.getBilans(token,active,fromDate,toDate)
            console.log(bilans)
            setListBilans(bilans)
            setLoading(false)
        }
        fetchBilans()
        return () => {
            setLoading(true)
          };
        
    },[fromDate,toDate,token,active])
    const exportation = async () =>{
        setExportLoading(true)
        var excelFiltred = []
        filtredBilans.forEach(element =>{
            const duration = moment.duration(moment(element.date_f,'DD/MM/YYYY HH:mm').diff(moment(element.date_d,'DD/MM/YYYY HH:mm')))
            const hours = parseInt(duration.asHours())
            const minutes = duration.asMinutes()%60
            const dur = hours?minutes?hours+"h:"+minutes+"m":hours+"h":minutes+"min"
            excelFiltred.push({
                caisser:element.caisser,
                montant:element.montant,
                date_d:element.date_d,
                date_f:element.date_f,
                duree:dur,
                poste:element.poste,
                ville:element.Ville?.nom_ville
            })
        })
        await setExcelData(excelFiltred)
        setExportLoading(false)
        if(exporter){
             toaster.clear()
             toaster.push(
                <Message type="success" showIcon closable>
                  Telechargement ...   
                </Message>
              )
            const options = exporter.workbookOptions()
            const rows = options.sheets[0].rows
            options.sheets[0].frozenRows = 2
            const interval = `DU ${moment(fromDate).format("DD/MM/YYYY")} AU ${moment(toDate).format("DD/MM/YYYY")}`
            const headerRow = {
                height: 70,
                cells: [
                  {
                    value: `Bilans ${!ville?"DE TOUS LES PARKING":"DU PARKING DE "+getVille(ville)} EN DH/TTC ${interval}`,
                    fontSize: 16,
                    colSpan: 7,
                    wrap:true,
                    textAlign:"center",
                    verticalAlign:"center"
                  },
                ],
              }
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
            return
        }
         toaster.clear()
         toaster.push(
            <Message type="error" showIcon closable>
              Exportation echoué  
            </Message>
          )
    }
    return (
        <div>
            <h2 className="page-header">
                {props.pageTitle}
            </h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__header"> 
                            <div className="row">
                                <div className="col-12" >
                                    <div className="row" style={{justifyContent:"space-between"}} > 
                                        <div className="col-6">
                                                {active === 'week'?
                                                        <DatePickerWeekDate active={active} handleDateChange={handleIntervalDateChange} />
                                                        :active ==="month"?
                                                        <DatePickerMonthDate active={active} handleDateChange={handleIntervalDateChange} />
                                                        :active ==="day"?
                                                        <DatePickerDate handleDateChange={handleDateChange}/>
                                                        :active === "year" ?<YearSelect handleChange={handleYearChange} />
                                                        :<DatePickerFreeDate handleDateChange={handleIntervalDateChange} />
                                                }
                                        </div>
                                        <div className="col-4">
                                            <div className="row" style={{justifyContent:"flex-end"}} > 
                                                    <CustomNav appearance="subtle" active={active} onSelect={handleSelect} />
                                            </div>
                                        </div>
                                       
                                    </div>
                                </div>
                                <div className="col-12">                       
                                    <div className="row">
                                        <div className="col-4">
                                            <VilleSelect items={listVilles} handleChange={handleVilleChange} handleUpdate={handleVilleUpdate}/>
                                        </div> 
                                        {filtredBilans?.length!==0?
                                            <div className="col-4">
                                                <IconButton onClick={exportation} loading={exportLoading} size="md" appearance='primary' color="green" icon={<Detail />} />
                                            </div>
                                        :null}    
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card__body">
                            {
                                filtredBilans===undefined
                                ? 
                                <div style={{display:'flex',justifyContent:'center'}}>Problèmes de connections</div>
                                :
                                loading
                                ?
                                <div style={{display:'flex',justifyContent:'center',padding:'50px'}}>
                                    <Loader  content="Chargement en cours..." />
                                </div>
                                :
                                filtredBilans.length === 0
                                ?
                                <div style={{display:'flex',justifyContent:'center'}}>Pas de données</div>
                                :
                                <div>
                                    {/* <div style={{margin:20}}><BilanTotalList articles=} dates={[fromDate,toDate]} data={totals}/></div> */}
                                    <Table
                                    limit='10'
                                    headData={customerTableHead}
                                    renderHead={(item, index) => renderHead(item, index)}
                                    bodyData={filtredBilans}
                                    renderBody={(item, index) => renderBody(item, index)}
                                    />

                                </div>
                                
                            }
                        </div>
                    </div>
                </div>
            </div>
            <ExcelExport
                data={excelData}
                fileName={`Bilans-${!ville?"Tous":getVille(ville)}-${moment(fromDate).format("DD/MM/YYYY")}-${moment(toDate).format("DD/MM/YYYY")}.xlsx`}
                ref={setExporter}
                filterable={true}
                creator="GestPark"
            >
                <ExcelExportColumn field="poste" title="Poste" width={80}/>
                <ExcelExportColumn field="caisser" title="Caisser" width={100} footer={()=>"Totals"}/>
                <ExcelExportColumn field="montant"
                title="Montant"
                width={60} 
                footer={() => {
                    var sum = 0;
                    excelData.forEach(element =>sum+=parseFloat(element.montant))
                    return sum
                }}/>
                <ExcelExportColumn field="date_d" title="Poste" width={180}/>
                <ExcelExportColumn field="date_f" title="Poste" width={180}/>
                <ExcelExportColumn field="duree" title="Duree" width={100}/>
                <ExcelExportColumn field="ville" title="Ville" width={120}/>
            </ExcelExport>
        </div>
    )
}

export default Bilan
