import React ,{ useState ,useEffect }from 'react'
import Table from '../components/table/Table'
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import { Nav ,Loader,SelectPicker ,Tag,List,FlexboxGrid } from 'rsuite'
import groupArray from 'group-array'
import { tarification,tarificationAbonne } from '../helper/helper'
import { DatePickerDate,DatePickerFreeDate,DatePickerWeekDate,DatePickerMonthDate,YearSelect } from '../components/datepickers/DatePickers'
import ApiCall from '../api/Api'
import { useSelector } from 'react-redux'


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
    style={{marginBottom: 10}}
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

const ListItem =(item)=>{
    const debut = item?.item?.debutH
    const fin = item?.item?.finH
    const sorties = item?.item?.sortie
    const entrees = item?.item?.entree
    const soustra = item?.item?.entree-item?.item?.sortie
    const soustraColor = soustra===0?"black":soustra>0?"green":"red"
    const sortiesColor = sorties===0?"black":"red"
    const entreesColor = entrees===0?"black":"green"
    const soustraValue = soustra===0?"-":soustra>0?soustra:soustra*-1
    const styleCenter = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '20px'
      };
    const dataStyle = {
        fontSize: '1.1em',
        fontWeight: 500,
        textAlign:"center"
      };
    return (
        <List.Item key={item?.index}>
            <FlexboxGrid>
                <FlexboxGrid.Item colspan={6}>
                    <span style={{...dataStyle}}>
                        <div style={{  ...styleCenter }}>
                            {debut+" >> "+fin}
                        </div>
                    </span>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={7}>
                    <span style={{...dataStyle,color:entreesColor}}>
                            <div style={{  ...styleCenter }}>
                                {entrees}
                            </div>
                    </span>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={7}>
                        <span style={{...dataStyle,color:sortiesColor}}>
                            <div style={{  ...styleCenter }}>
                                {sorties}
                            </div>
                        </span>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={4}>
                    <span style={{...dataStyle,color:soustraColor}}>
                        <div style={{  ...styleCenter }}>
                            {soustraValue}
                        </div>
                    </span>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </List.Item>
    )
}


const Traffic = (props) => {
    const authReducer = useSelector(state=>state.AuthReducer)
    // const user = authReducer.user
    const token = authReducer.token
    const [active, setActive] = useState('day')
    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())
    const [brutTraffic,setBrutTraffic] = useState([])
    const [loading,setLoading] = useState(true)
    const [listVilles,setListVilles]=useState([])
    const [ville,setVille]=useState(0)

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
        if(active=== activeKey) return
        setActive(activeKey);
    }
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
    const styleCenter = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60px'
      };
    const dataStyle = {
        fontSize: '1.1em',
        fontWeight: 700,
        textAlign:"center"
      };

    useEffect(() => {
        async function fetchRecus(){
            setLoading(true)
            const data = await ApiCall.traffic(token,ville,fromDate,toDate)
            var traffic = []
            for(let x=0;x<24;x++){
                const h = parseInt(data?.entree[x]?.heur)
                traffic.push({
                    debutH:h+"h",
                    finH:(h+1)+"h",
                    entree:data?.entree[x]?.entree,
                    sortie:data?.sorties[x]?.sortie
                })
            }
            console.log(data)
            console.log(traffic)
            setBrutTraffic(traffic)
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
                                brutTraffic === undefined || brutTraffic === null ?
                                    <div style={{display:'flex',justifyContent:'center'}}>Problèmes de connections</div>
                                :
                                    brutTraffic.lenght === 0 || loading ?
                                        <div style={{display:'flex',justifyContent:'center',padding:'50px'}}>
                                            <Loader  content="Chargement en cours..." />
                                        </div>
                                    :
                                    <div>
                                        <List bordered hover>
                                            <List.Item key={-1}>
                                                <FlexboxGrid>
                                                    <FlexboxGrid.Item colspan={6}>
                                                        <span style={{...dataStyle}}>
                                                            <div style={{ ...styleCenter }}>
                                                                Interval Horaire
                                                            </div>
                                                        </span>
                                                    </FlexboxGrid.Item>
                                                    <FlexboxGrid.Item colspan={7}>
                                                        <span style={{...dataStyle}}>
                                                            <div style={{  ...styleCenter }}>
                                                                Entrées
                                                            </div>
                                                        </span>
                                                        
                                                    </FlexboxGrid.Item>
                                                    <FlexboxGrid.Item colspan={7}>
                                                            <span style={{...dataStyle}}>
                                                                <div style={{  ...styleCenter }}>
                                                                    Sorties
                                                                </div>
                                                            </span>
                                                    </FlexboxGrid.Item>
                                                    <FlexboxGrid.Item colspan={4}>
                                                        <span style={{...dataStyle}}>
                                                            <div style={{  ...styleCenter }}>
                                                                Diff
                                                            </div>
                                                        </span>
                                                    </FlexboxGrid.Item>
                                                </FlexboxGrid>
                                            </List.Item>
                                            {brutTraffic.map((item,index)=>(<ListItem index={index} item={item} />))}
                                        </List>
                                    </div>

                                
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
