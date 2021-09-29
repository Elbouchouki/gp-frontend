import React ,{ useState ,useEffect }from 'react'
import Table from '../components/table/Table'
import moment from 'moment'
import { Nav, Icon ,Loader,SelectPicker ,Tag } from 'rsuite'
import { DatePickerDate,DatePickerFreeDate,DatePickerWeekDate,DatePickerMonthDate,YearSelect } from '../components/datepickers/DatePickers'
import ApiCall from '../api/Api'
import { useSelector } from 'react-redux'

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
            <Icon icon="spinner" spin /> Chargement en cours...
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
    const [toDate, setToDate] = useState(new Date())
    const [loading,setLoading] = useState(true)
    const [listBilans,setListBilans]=useState([])
    const [listVilles,setListVilles]=useState([])
    const [filtredBilans,setfiltredBilans]=useState([])
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
            const bilans = await ApiCall.getBilans(token,fromDate,toDate)
            console.log(bilans)
            console.log(fromDate,toDate)
            setListBilans(bilans)
            setLoading(false)
        }
        fetchBilans()
        return () => {
            setLoading(true)
          };
        
    },[fromDate,toDate,token])
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
        </div>
    )
}

export default Bilan
