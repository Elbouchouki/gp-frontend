import React ,{ useState ,useEffect }from 'react'
import Table from '../components/table/Table'
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import { Nav ,Loader,SelectPicker ,Tag,CheckPicker } from 'rsuite'
import { tarification,tarificationAbonne } from '../helper/helper'
import { DatePickerDate,DatePickerFreeDate,DatePickerWeekDate,DatePickerMonthDate,YearSelect } from '../components/datepickers/DatePickers'
import RecuTotalList from '../components/customList/RecuTotalList'
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
const TarifsSelect = ({items,handleChange,handleUpdate,type}) =>{
    return <CheckPicker
    block
    placeholder={type === "normal"?"Tarifs":"Type"}
    data={items}
    searchable={false}
    onOpen={handleUpdate}
    onChange={handleChange}
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
    renderMenuItem={(label, item) => {
      return   <Tag color={item.value ===-1 ?"violet":item.value ===0?"orange":"blue"}>
                 <i className="rs-icon rs-icon-user" /> {label}
                </Tag >;
    }}
    
  />
}
const ArticleSelect = ({items,handleChange,handleUpdate}) =>{
    return <CheckPicker
    block
    placeholder="Types"
    data={items}
    searchable={false}
    onOpen={handleUpdate}
    onChange={handleChange}
    valueKey="id"
    labelKey="desc_art"
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
    // renderMenuItem={(label, item) => {
    //   return   <Tag color={item.value ===-1 ?"violet":item.value ===0?"orange":"blue"}>
    //              <i className="rs-icon rs-icon-user" /> {label}
    //             </Tag >;
    // }}
    
  />
}
const EtatsSelect = ({handleChange}) =>{
    return <SelectPicker
    block
    placeholder="Etats"
    data={[{
        value:"confirmé",
        label:"confirmé"
    },{
        value:"annulé",
        label:"annulé"
    }]}
    searchable={false}
    onChange={handleChange}
    renderMenuItem={(label, item) => {
      return   <Tag color={item.value ==="confirmé" ?"green":"red"}>
                 <i className="rs-icon rs-icon-user" /> {label}
                </Tag >;
    }}
    
  />
}

const Recu = (props) => {
    const authReducer = useSelector(state=>state.AuthReducer)
    // const user = authReducer.user
    const token = authReducer.token
    const [active, setActive] = useState('day')
    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())
    const [loading,setLoading] = useState(true)
    const [listRecus,setListRecus]=useState([])
    const [listVilles,setListVilles]=useState([])
    const [filtredRecus,setfiltredRecus]=useState([])
    const [ville,setVille]=useState(null)
    const [etats,setEtats]=useState(null)
    const [tarifs,setTarifs] = useState([])
    const [articles,setArticles] = useState([])
    const [listTarifs,setListTarifs]=useState([])
    const [listArticles,setListArticles]=useState([])
    const [totals,setTotals]=useState(null)
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
    const handleTarifChange = (value) =>{
        setTarifs(value)
    }
    const handleArticleChange = (value) =>{
        setArticles(value)
    } 
    const handleEtatsChange = (value) =>{
        setEtats(value)
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
        async function filterRecus(){
            await setTimeout(setLoading(true),500)
            if ((ville===null || ville===undefined) && tarifs.length===0 && articles.length === 0 && (etats===null || etats===undefined)){
                setfiltredRecus(listRecus)
                setLoading(false)
                // return
            }
            var filtred = []
            var baseFilter = props.type==="normal"?tarification:tarificationAbonne
            
            if(tarifs.length !== 0){
                var temp = []
                temp.push(...listRecus.filter(item => tarifs.includes(item.valeur)))
                if(tarifs.includes(-1)){
                    temp.push(...listRecus.filter(item => !baseFilter.includes(item.valeur) ))
                }
                filtred.push(...temp.filter(item => {
                    return (
                        ((ville===null || ville===undefined) ?true:item.Ville.id === ville) &&
                        (articles.length === 0 ?true:articles.includes(item.Article.id))&&
                        ((etats===null || etats===undefined) ?true:item.etats === etats)
                    )
                }))
            }else{
                filtred.push(...listRecus.filter(item => {
                    return (
                        ((ville===null || ville===undefined) ?true:item.Ville.id === ville) &&
                        (articles.length === 0 ?true:articles.includes(item.Article.id))&&
                        ((etats===null || etats===undefined) ?true:item.etats === etats)
                    )
                }))
            }

            setfiltredRecus(filtred)
            if(filtred.length !== 0){
                var all = props.type ==="normal" ? {
                    '1':{
                        'name':"Tickets Horaires",
                        'confirmé':{
                            cpt:0,
                            total:0.0
                        },
                        'annulé':{
                            cpt:0,
                            total:0.0
                        }
                    },
                    '2':{
                        'name':"Tickets Illisibles",
                        'confirmé':{
                            cpt:0,
                            total:0.0
                        },
                        'annulé':{
                            cpt:0,
                            total:0.0
                        }
                    },
                    '3':{
                        'name':"Tickets Perdus",
                        'confirmé':{
                            cpt:0,
                            total:0.0
                        },
                        'annulé':{
                            cpt:0,
                            total:0.0
                        }
                    },
                    'total':{
                        'name':"Total",
                        'confirmé':{
                            cpt:0,
                            total:0.0
                        },
                        'annulé':{
                            cpt:0,
                            total:0.0
                        }
                    },
                } : {
                    '6':{
                        'name':"Nouveaux Abonnés",
                        'confirmé':{
                            cpt:0,
                            total:0.0
                        },
                        'annulé':{
                            cpt:0,
                            total:0.0
                        }
                    },
                    '7':{
                        'name':"Recharges Abonnés Normaux",
                        'confirmé':{
                            cpt:0,
                            total:0.0
                        },
                        'annulé':{
                            cpt:0,
                            total:0.0
                        }
                    },
                    '8':{
                        'name':"Recharges Abonnés ONCF",
                        'confirmé':{
                            cpt:0,
                            total:0.0
                        },
                        'annulé':{
                            cpt:0,
                            total:0.0
                        }
                    },
                    'total':{
                        'name':"Total",
                        'confirmé':{
                            cpt:0,
                            total:0.0
                        },
                        'annulé':{
                            cpt:0,
                            total:0.0
                        }
                    },
                }
                filtred.forEach(element=>{
                    all[`${element.Article.id}`][`${element.etats}`].cpt += 1
                    all[`${element.Article.id}`][`${element.etats}`].total += element.valeur
                    all[`total`][`${element.etats}`].cpt += 1
                    all[`total`][`${element.etats}`].total += element.valeur
                })
                setTotals(all)
            }
            setLoading(false)
        }
        filterRecus()
        return () => {
            setLoading(true)
            setfiltredRecus([])
          };
        
    }, [listRecus,ville,tarifs,props.type,articles,etats])

    useEffect(() => {
        async function fetchRecus(){
            setLoading(true)
            const recus = await ApiCall.getRecus(token,active,props.articleId,fromDate,toDate)
            setListRecus(recus)
            setLoading(false)
        }
        fetchRecus()
        return () => {
            setLoading(true)
          };
        
    },[fromDate,toDate,props.articleId,token,active])
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
                                        <div className="col-3">
                                            <TarifsSelect type={props.type} items={listTarifs} handleChange={handleTarifChange} handleUpdate={handleTarifUpdate}/>
                                        </div>
                                            
                                    </div>
                                    {props.type ==="normal"?
                                    <div className="row">
                                        <div className="col-3">
                                            <ArticleSelect items={listArticles} handleChange={handleArticleChange} handleUpdate={handleArticleUpdate}/>
                                        </div>
                                        <div className="col-3">
                                            <EtatsSelect items={listArticles} handleChange={handleEtatsChange}/>
                                        </div>                                        
                                    </div>:
                                    <div className="row">
                                        <div className="col-6">
                                            <EtatsSelect items={listArticles} handleChange={handleEtatsChange}/>
                                        </div>                                        
                                     </div>
                                    }
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
                                filtredRecus.length === 0
                                ?
                                <div style={{display:'flex',justifyContent:'center'}}>Pas de données</div>
                                :
                                <div>
                                    <div style={{margin:20}}><RecuTotalList articles={props.articleId} dates={[fromDate,toDate]} data={totals}/></div>
                                    <Table
                                    limit='10'
                                    headData={customerTableHead}
                                    renderHead={(item, index) => renderHead(item, index)}
                                    bodyData={filtredRecus}
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

export default Recu
