import React ,{ useState ,useEffect }from 'react'
import Table from '../components/table/Table'
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import { Nav ,Loader,SelectPicker ,Tag,CheckPicker } from 'rsuite'
import { tarification,tarificationAbonne } from '../helper/helper'
import { DatePickerDate,DatePickerFreeDate,DatePickerWeekDate,DatePickerMonthDate,YearSelect } from '../components/datepickers/DatePickers'
import ApiCall from '../api/Api'
import { useSelector } from 'react-redux'

const customerTableHead = [
    'Caisse',
    'Type',
    'Valeur',
    "Date d'entrer",
    'Date de sortie',
    'Ville',
    'Etat',
]

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
const Traffic = (props) => {
    const authReducer = useSelector(state=>state.AuthReducer)
    // const user = authReducer.user
    const token = authReducer.token
    const [active, setActive] = useState('day')
    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())
    const [loading,setLoading] = useState(true)
    const [listVilles,setListVilles]=useState([])
    const [ville,setVille]=useState(0)
    const [listTarifs,setListTarifs]=useState([])
    const [listArticles,setListArticles]=useState([])
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

    
    const handleTarifUpdate=async()=> {
        if (listTarifs.length === 0) {
            const tarifs  = await ApiCall.getTarifs(token,props.type)
            setListTarifs(tarifs)
            return;
        }
    }
    const handleArticleUpdate=async()=> {
        if (listArticles.length === 0 && props.type ==="normal") {
            const articles  = await ApiCall.getArticles(token,props.type)
            setListArticles(articles)
            return;
        }
    }
    const handleVilleChange=(value)=>{
       setVille(value)
    }
    const renderBody = (item, index) => (
        <tr key={index}>
            <td>{item.caisse}</td>
            <td>{item.Article.desc_art}</td>
            {
                props.type==="abonné"?<td>{item.societe.trim()}</td>:null
            }
            {
                props.type==="abonné"?<td>{item.participant.trim()}</td>:null
            }
            {props.type==="normal"?<td><Tag color={item.valeur ===0?"orange":tarification.includes(item.valeur)?"blue":"violet"}>{item.valeur} Dh</Tag></td>:
                        <td><Tag color={item.valeur ===0?"orange":tarificationAbonne.includes(item.valeur)?"blue":"violet"}>{item.valeur} Dh</Tag></td>
                    }
            
            <td>{item.date_e}</td>
            {
                props.type==="normal"?<td>{item.date_s}</td>:null
            }
            <td>{item.Ville.nom_ville}</td>
            <td><Tag color={item.etats==="confirmé"?"green":"red"} >{item.etats} </Tag></td>
        </tr>
    )
    const customerTableHead = props.type === "normal"?[
        'Caisse',
        'Type',
        'Valeur',
        "Date d'entrer",
        'Date de sortie',
        'Ville',
        'Etat',
    ]:[
        'Caisse',
        'Type',
        'Société',
        'Participant',
        'Valeur',
        "Date",
        'Ville',
        'Etat',
    ]
    

    useEffect(() => {
        async function fetchRecus(){
            setLoading(true)
            const inout = await ApiCall.inOut(token,ville,fromDate,toDate)
            console.log(inout)
            // setListRecus(recus)
            setLoading(false)
        }
        fetchRecus()
        return () => {
            setLoading(true)
          };
        
    },[fromDate, toDate, token, ville])
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
                                       
                                        <div className="col-3">
                                            <VilleSelect items={listVilles} handleChange={handleVilleChange} handleUpdate={handleVilleUpdate}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card__body">
                            {

                                // filtredRecus===undefined
                                // ? 
                                // <div style={{display:'flex',justifyContent:'center'}}>Problèmes de connections</div>
                                // :
                                // loading
                                // ?
                                // <div style={{display:'flex',justifyContent:'center',padding:'50px'}}>
                                //     <Loader  content="Chargement en cours..." />
                                // </div>
                                // :
                                // filtredRecus.length === 0
                                // ?
                                // <div style={{display:'flex',justifyContent:'center'}}>Pas de données</div>
                                // :
                                // <div>
                                //     <div style={{margin:20}}><RecuTotalList articles={props.articleId} dates={[fromDate,toDate]} data={totals}/></div>
                                //     <Table
                                //     limit='10'
                                //     headData={customerTableHead}
                                //     renderHead={(item, index) => renderHead(item, index)}
                                //     bodyData={filtredRecus}
                                //     renderBody={(item, index) => renderBody(item, index)}
                                //     />

                                // </div>
                                
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Traffic
