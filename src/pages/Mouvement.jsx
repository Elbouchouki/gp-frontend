import React ,{ useState ,useEffect }from 'react'
import Table from '../components/table/Table'
import { DateRangePicker } from 'rsuite'
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import { Nav, DatePicker ,Loader,SelectPicker ,Tag,CheckPicker } from 'rsuite'
import { listMouvs } from '../helper/helper'
import ApiCall from '../api/Api'
import { useSelector } from 'react-redux'

const customerTableHead = [
    'Mouvements',
    'Type',
    "Ville",
    "Date du mouvements",
]

const renderHead = (item, index) => <th key={index}>{item}</th>

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{item.desc_m}</td>
        <td><Tag color={"orange"}>{item.Mouv?.desc_mouv}</Tag></td>
        <td>{item.Ville?.nom_ville}</td>
        <td>{item.date_m}</td>
    </tr>
)
const styles = {
    marginBottom: 10
};
const CustomNav = ({ active, onSelect, ...props }) => {
    return (
        <Nav  {...props} activeKey={active} onSelect={onSelect} style={{marginBottom:20}}>
            <Nav.Item eventKey="day">jour</Nav.Item>
            <Nav.Item eventKey="week">Semaine</Nav.Item>
            <Nav.Item eventKey="month">Mois</Nav.Item>
            <Nav.Item eventKey="year">Année</Nav.Item>
            {/* <Nav.Item eventKey="free">Libre</Nav.Item> */}
        </Nav>
    );
};
const DatePickerDate =({handleDateChange})=>{
    return <DatePicker 
    block
    style={styles}
    onChange={(value) => { handleDateChange(value) }}       
    format="dd/MM/yyyy"
    locale={{
        sunday: 'Dim',
        monday: 'Lun',
        tuesday: 'Mar',
        wednesday: 'Mer',
        thursday: 'Jeu',
        friday: 'Ven',
        saturday: 'Sam',
        ok: 'OK',
        today: "Aujourd'hui",
        yesterday: 'Hier',
        last7Days: 'Last 7 days'
    }}
    oneTap cleanable={false} defaultValue={new Date()} 
    />
}
const DatePickerWeekDate = ({ active, handleDateChange }) => {
    return (<DateRangePicker cleanable={false}
        block
        style={styles}
        onChange={(value) => { handleDateChange(value) }}
        oneTap
        hoverRange={active}
        showWeekNumbers={active === 'week' ? true : false}
        placeholder="Choisir une date"
        ranges={[]}
        format="dd/MM/yyyy"
        locale={{
            sunday: 'Dim',
            monday: 'Lun',
            tuesday: 'Mar',
            wednesday: 'Mer',
            thursday: 'Jeu',
            friday: 'Ven',
            saturday: 'Sam',
            ok: 'OK',
            today: "Aujourd'hui",
            yesterday: 'Hier',
            last7Days: 'Last 7 days'
        }}
    />)
}
const VilleSelect = ({items,handleUpdate,handleChange}) =>{
    
    
    return <SelectPicker
    block
    placeholder="Choisir une ville"
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
const MouvSelect = ({items,handleChange}) =>{
    return <CheckPicker
    block
    data={items}
    searchable={false}
    onChange={handleChange}
    groupBy="type"
    renderMenuItem={(label,item) => {
      return   <Tag color={item.type ==="Entrées" ?"blue":"orange"}>
                 <i className="rs-icon rs-icon-user" /> {label}
                </Tag >;
    }}
    renderMenuGroup={(label, item) => {
    return (
        <div>
            <i className="bx bxs-spreadsheet" /> {label}
        </div>
    );
    }}

    
  />
}

const Mouvement = (props) => {
    const authReducer = useSelector(state=>state.AuthReducer)
    const user = authReducer.user
    const token = authReducer.token
    const [active, setActive] = useState('day')
    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())
    const [loading,setLoading] = useState(true)
    const [listMouvements,setListMouvements]=useState([])
    const [listVilles,setListVilles]=useState([])
    const [filtredMouvements,setfiltredMouvements]=useState([])
    const [ville,setVille]=useState(null)
    const [tarifs,setTarifs] = useState([])
    const handleIntervalDateChange = (value) => {
        setFromDate(value[0])
        setToDate(value[1])
    }
    const handleDateChange = (value) => {    
        setFromDate(value)
        setToDate(value)
    }
    const handleTarifChange = (value) =>{
        setTarifs(value)
    }
    const handleSelect = (activeKey) => {
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
   
    useEffect(() => {
        async function filterMouvements(){
            await setTimeout(setLoading(true),500)
            if ((ville===null || ville===undefined)){
                setfiltredMouvements(listMouvements)
                setLoading(false)
                return
            }
            var filtred = []
            if(ville !== null && ville !== undefined && tarifs.length === 0){
                filtred.push(...listMouvements.filter(item => item.Ville.id === ville))
            }
            setfiltredMouvements(filtred)
            setLoading(false)
        }
        filterMouvements()
        return () => {
            setLoading(true)
            setfiltredMouvements([])
          };
        
    }, [listMouvements,ville,tarifs])

    useEffect(() => {
        async function fetchMouvements(){
            setLoading(true)
            const mouvements = await ApiCall.getMouvements(token,fromDate,toDate)
            setListMouvements(mouvements)
            setLoading(false)
        }
        fetchMouvements()
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
                                                {active === 'week' || active === 'month' ?
                                                        <DatePickerWeekDate active={active} handleDateChange={handleIntervalDateChange} />
                                                        :
                                                        <DatePickerDate handleDateChange={handleDateChange} />}
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
                                       
                                        <div className="col-3">
                                            <VilleSelect items={listVilles} handleChange={handleVilleChange} handleUpdate={handleVilleUpdate}/>
                                        </div>
                                        <div className="col-3">
                                            <MouvSelect items={listMouvs} handleChange={handleTarifChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card__body">
                            {
                                filtredMouvements===undefined
                                ? 
                                <div style={{display:'flex',justifyContent:'center'}}>Problèmes de connections</div>
                                :
                                loading
                                ?
                                <div style={{display:'flex',justifyContent:'center',padding:'50px'}}>
                                    <Loader  content="Chargement en cours..." />
                                </div>
                                :
                                filtredMouvements.length===0
                                ?
                                <div style={{display:'flex',justifyContent:'center'}}>Pas de données</div>
                                :
                                <Table
                                limit='10'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={filtredMouvements}
                                renderBody={(item, index) => renderBody(item, index)}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mouvement
