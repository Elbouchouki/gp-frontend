import React ,{ useState ,useEffect }from 'react'
import Table from '../components/table/Table'
import { addDays, subDays } from 'date-fns'
import { DateRangePicker } from 'rsuite'
import { Nav, Icon, FlexboxGrid, DatePicker ,Loader,SelectPicker ,Tag } from 'rsuite'


import ApiCall from '../api/Api'
import FlexboxGridItem from 'rsuite/lib/FlexboxGrid/FlexboxGridItem'
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
        <td><Tag color={item.valeur===0?"orange":"blue"} >{item.valeur} Dh</Tag></td>
        <td>{item.date_paiment}</td>
        <td>{item.date_e}</td>
        <td>{item.date_s}</td>
        <td>{item.Ville.nom_ville}</td>
        <td><Tag color={item.etats==="confirmé"?"green":"red"} >{item.etats} </Tag></td>
    </tr>
)
const styles = {
    marginBottom: 50
};
const CustomNav = ({ active, onSelect, ...props }) => {
    return (
        <Nav  {...props} activeKey={active} onSelect={onSelect} style={styles}>
            <Nav.Item eventKey="day">Jour</Nav.Item>
            <Nav.Item eventKey="week">Semaine</Nav.Item>
            <Nav.Item eventKey="month">Mois</Nav.Item>
            <Nav.Item eventKey="year">Année</Nav.Item>
            {/* <Nav.Item eventKey="free">Libre</Nav.Item> */}
        </Nav>
    );
};
const DatePickerDate =({handleDateChange})=>{
    return <DatePicker
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
    placeholder="Choisir une ville"
    data={items}
    style={{ width: 224 }}
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
const Customers = (props) => {
    const [active, setActive] = useState('day')
    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())
    const [loading,setLoading] = useState(true)
    const [listRecus,setListRecus]=useState([])
    const [listVilles,setListVilles]=useState([])
    const [filtredRecus,setfiltredRecus]=useState([])
    const [ville,setVille]=useState(null)
    const handleIntervalDateChange = (value) => {
        setFromDate(value[0])
        setToDate(value[1])
    }
    const handleDateChange = (value) => {    
        setFromDate(value)
        setToDate(value)
    }
    
    const handleSelect = (activeKey) => {
        setActive(activeKey);
    }
        const handleVilleUpdate=async()=> {
        if (listVilles.length === 0) {
            setListVilles([{
                "label": "Marrakech",
                "value": 1234,
   
              },{
                "label": "Casablanca",
                "value": 4321,
              },])
            return;
        }
        console.log()
      }
    const handleVilleChange=(value)=>{
       setVille(value)
    }
   
    useEffect(() => {
        async function filterRecus(){
            setLoading(true)
            if (ville===null){
                setfiltredRecus(listRecus)
                setLoading(false)
                return
            }
            const filtred = await listRecus.filter(item => item.Ville.id === ville)
            setfiltredRecus(filtred)
            setLoading(false)
            
        
        }
        filterRecus()
        return () => {
            setfiltredRecus([])
            setLoading(true)
          };
        
    }, [listRecus,ville])

    useEffect(() => {
        
        async function fetchRecus(){
            setLoading(true)
            const recus = await ApiCall.getRecus(props.articleId,fromDate,toDate)
            setListRecus(recus)
            setLoading(false)
        }
        fetchRecus()
        return () => {
            setListRecus([])
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
                            <FlexboxGrid justify="space-between">
                                <FlexboxGrid.Item>                       
                                        <FlexboxGrid >
                                            <FlexboxGrid.Item>
                                                {active === 'week' || active === 'month' ?
                                                        <DatePickerWeekDate active={active} handleDateChange={handleIntervalDateChange} />
                                                        :
                                                        <DatePickerDate handleDateChange={handleDateChange} />}
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item style={{paddingLeft:'50px'}}>
                                                <VilleSelect items={listVilles} handleChange={handleVilleChange} handleUpdate={handleVilleUpdate}/>
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item>
                                <CustomNav appearance="subtle" active={active} onSelect={handleSelect} />
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </div>
                        <div className="card__body">
                            {loading
                                ?
                                <div style={{display:'flex',justifyContent:'center',padding:'50px'}}>
                                    <Loader  content="Chargement en cours..." />
                                </div>
                                :
                                filtredRecus===undefined? <div style={{display:'flex',justifyContent:'center'}}>Problèmes de connections</div>:filtredRecus.length===0
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

export default Customers
