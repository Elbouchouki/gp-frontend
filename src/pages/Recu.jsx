import React ,{ useState ,useEffect }from 'react'
import Table from '../components/table/Table'
import { addDays, subDays } from 'date-fns'
import { DateRangePicker } from 'rsuite'
import { Nav, Icon, DatePicker ,Loader,SelectPicker ,Tag,CheckPicker } from 'rsuite'
import { listTarifs,tarification } from '../helper/helper'
import ApiCall from '../api/Api'

const customerTableHead = [
    'Caisse',
    'Valeur',
    "Date de paiement",
    "Date d'entrer",
    'Date de sortie',
    'Ville',
    'Etat',
]

const renderHead = (item, index) => <th key={index}>{item}</th>

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{item.caisse}</td>
        <td><Tag color={tarification.includes(item.valeur) ?"blue":item.valeur ===0?"orange":"violet"} >{item.valeur} Dh</Tag></td>
        <td>{item.date_paiment}</td>
        <td>{item.date_e}</td>
        <td>{item.date_s}</td>
        <td>{item.Ville.nom_ville}</td>
        <td><Tag color={item.etats==="confirmé"?"green":"red"} >{item.etats} </Tag></td>
    </tr>
)
const styles = {
    marginBottom: 10
};
const CustomNav = ({ active, onSelect, ...props }) => {
    return (
        <Nav  {...props} activeKey={active} onSelect={onSelect} style={{marginBottom:20}}>
            <Nav.Item pullRight eventKey="day">Jour</Nav.Item>
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
    format="DD/MM/YYYY"
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
        format="DD/MM/YYYY"
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
            <Icon icon="spinner" spin /> Chargement en cours...
          </p>
        );
      }
      return menu;
    }}
  />
}
const TarifsSelect = ({items,handleChange}) =>{
    return <CheckPicker
    block
    data={items}
    searchable={false}
    onChange={handleChange}
    renderMenuItem={(label, item) => {
      return   <Tag color={item.value ===-1 ?"violet":item.value ===0?"orange":"blue"}>
                 <i className="rs-icon rs-icon-user" /> {label}
                </Tag >;
    }}
    
  />
}

const Recu = (props) => {
    const [active, setActive] = useState('day')
    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())
    const [loading,setLoading] = useState(true)
    const [listRecus,setListRecus]=useState([])
    const [listVilles,setListVilles]=useState([])
    const [filtredRecus,setfiltredRecus]=useState([])
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
            const villes  = await ApiCall.getVilles()
            setListVilles(villes)
            return;
        }
      }
    const handleVilleChange=(value)=>{
       setVille(value)
    }
   
    useEffect(() => {
        async function filterRecus(){
            await setTimeout(setLoading(true),500)
            if ((ville===null || ville===undefined)&&tarifs.length===0){
                setfiltredRecus(listRecus)
                setLoading(false)
                return
            }
            var filtred = []
            if(ville !== null && ville !== undefined && tarifs.length === 0){
                filtred.push(...listRecus.filter(item => item.Ville.id === ville))
            }
            if(tarifs.length !== 0 &&(ville===null || ville===undefined)){
                filtred.push(...listRecus.filter(item => tarifs.includes(item.valeur)))
                if(tarifs.includes(-1)){
                    filtred.push(...listRecus.filter(item => !tarification.includes(item.valeur) ))
                }
            }
            if(tarifs.length !== 0 && ville !== null && ville !== undefined){
                var temp = []
                temp.push(...listRecus.filter(item => tarifs.includes(item.valeur)))
                if(tarifs.includes(-1)){
                    temp.push(...listRecus.filter(item => !tarification.includes(item.valeur) ))
                }
                filtred.push(...temp.filter(item => item.Ville.id === ville))
            }
            setfiltredRecus(filtred)
            setLoading(false)
        }
        filterRecus()
        return () => {
            setLoading(true)
            setfiltredRecus([])
          };
        
    }, [listRecus,ville,tarifs])

    useEffect(() => {
        
        async function fetchRecus(){
            setLoading(true)
            const recus = await ApiCall.getRecus(props.articleId,fromDate,toDate)
            setListRecus(recus)
            setLoading(false)
        }
        fetchRecus()
        return () => {
            setLoading(true)
          };
        
    },[fromDate,toDate,props.articleId])
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
                                            <TarifsSelect items={listTarifs} handleChange={handleTarifChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card__body">
                            {
                                filtredRecus===undefined
                                ? 
                                <div style={{display:'flex',justifyContent:'center'}}>Problèmes de connections</div>
                                :
                                loading
                                ?
                                <div style={{display:'flex',justifyContent:'center',padding:'50px'}}>
                                    <Loader  content="Chargement en cours..." />
                                </div>
                                :
                                filtredRecus.length===0
                                ?
                                <div style={{display:'flex',justifyContent:'center'}}>Pas de données</div>
                                :
                                <Table
                                limit='10'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={filtredRecus}
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

export default Recu
