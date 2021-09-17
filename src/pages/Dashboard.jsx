import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { useSelector } from 'react-redux'
import StatusCard from '../components/status-card/StatusCard'
import CustomList from'../components/customList/CustomList'
import { Nav , Loader, Icon,DateRangePicker} from 'rsuite'
import ApiCall from '../api/Api'
import { monthSwitch, seasonSwitch } from '../helper/helper'
import moment from 'moment'

const CustomNav = ({ active, onSelect, ...props }) => {
    return (
        <Nav  {...props} activeKey={active} onSelect={onSelect} >
            <Nav.Item eventKey="day">Jour</Nav.Item>
            <Nav.Item eventKey="week">Semaine</Nav.Item>
            <Nav.Item eventKey="month">Mois</Nav.Item>
            <Nav.Item eventKey="year">Année</Nav.Item>
            <Nav.Item eventKey="custom">Libre</Nav.Item>

        </Nav>
    );
};
const StCustomNav = ({ active, onSelect, ...props }) => {
    return (
        <Nav  {...props} activeKey={active} onSelect={onSelect} >
            <Nav.Item eventKey="day">Aujourd'hui</Nav.Item>
            <Nav.Item eventKey="yesterday">Hier</Nav.Item>
            <Nav.Item eventKey="custom">Libre</Nav.Item>
        </Nav>
    );
};
const DatePickerFreeDate = ({ handleDateChange }) => {
    return (
      <DateRangePicker
        cleanable={false}
        style={{marginTop: 10}}
        showOneCalendar
        onChange={(value) => {
          handleDateChange(value);
        }}
        defaultValue={[new Date(),new Date()]}
        placeholder="Date Libre"
        format="DD/MM/YYYY"
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
          last7Days: "Derniers 7 jours",
        }}
      />
    );
  };
  const StDatePickerFreeDate = ({ handleDateChange }) => {
    return (
      <DateRangePicker
        cleanable={false}
        style={{marginTop: 10}}
        showOneCalendar
        onChange={(value) => {
          handleDateChange(value);
        }}
        defaultValue={[moment().subtract(1, 'days').toDate(),moment().subtract(1, 'days').toDate()]}
        placeholder="Date Libre"
        format="DD/MM/YYYY"
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
          last7Days: "Derniers 7 jours",
        }}
      />
    );
  };

const Dashboard = () => {
    const themeReducer = useSelector(state => state.ThemeReducer.mode)
    const authReducer = useSelector(state=>state.AuthReducer)
    const user = authReducer.user
    const token = authReducer.token
    const [toDate, setToDate] = useState(new Date())
    const [fromDate, setFromDate] = useState(new Date())
    const [sevenData,setSevenData] = useState([])
    const [normalData,setNormalData] = useState([])
    const [stData,setStData] = useState([])
    const [loading,setLoading] = useState(true)
    const [stLoading,setStLoading] = useState(true)
    const [sevenChartLoading,setSevenChartLoading] = useState(true)
    const [active, setActive] = useState("day")
    // statistic for ville part
    const [stActive,setStActive] = useState("yesterday")
    const [stToDate, setStToDate] = useState(moment().subtract(1, 'days').toDate())
    const [stFromDate, setStFromDate] = useState(moment().subtract(1, 'days').toDate())
    const sevenChart = [{
        name: 'Nombre de tickets',
        type:"line",
        data: sevenData[0]
    }, {
        name: 'Revenue',
        type:"line",
        data: sevenData[1]
    }]
    const normalChart = [{
        name: 'Nombre de tickets',
        type:"column",
        data: normalData[0]
    }, {
        name: 'Revenue',
        type:"column",
        data: normalData[1]
    }]
    const options2= {
        color: ['#6ab04c', '#2980b9'],
        chart: {
            background: 'transparent',
            toolbar: {
                show: false,
              },
            zoom: {
                enabled: false,
            },
        },
        
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'category',
            categories: ["Ticket Normal","Ticket Illisible","Ticket Perdu","Entrée Abonné","Recharge Abonné"],
        },
        legend: {
            position: 'bottom'
        },
        grid: {
            show: false
        }
    }
    const options1= {
        color: ['#6ab04c', '#2980b9'],
        chart: {
            background: 'transparent'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'category',
            categories: sevenData[2],
            tickAmount: 10 
        },
        legend: {
            position: 'bottom'
        },
        grid: {
            show: false
        }
    }
    const handleSelect = (activeKey) => {
        setActive(activeKey);
    }
    const handleStSelect = (activeKey) => {
        setStActive(activeKey);
    }
    const handleIntervalDateChange = (value) => {
        setFromDate(value[0])
        setToDate(value[1])
    }
    const handleStIntervalDateChange = (value) => {
        setStFromDate(value[0])
        setStToDate(value[1])
    }
    const [daily,setDaily]=useState(null)
    useEffect(() => {
        async function fetchData(){
            setLoading(true)
            const daything = await ApiCall.getStatistiques(token,"day");
            setDaily([daything.recus[0]?.count,daything.recus[0]?.sum])
            var countArticle  = []
            var sumArticle = []
            var interval = null;
            if(active==="custom"){
                interval = await ApiCall.getStatistiquesCustom(token,fromDate,toDate);
            }else{
                interval = await ApiCall.getStatistiques(token,active);
            }
            interval?.article.forEach(element => {
                countArticle.push(element.count)
                sumArticle.push(element.sum)
            });
            setNormalData([countArticle,sumArticle,interval?.recus[0].count,interval?.recus[0].sum])
            setLoading(false)
        }
        fetchData()
        return () => {
            setDaily([])
            setNormalData([])
        }
    }, [active,token,fromDate,toDate])

    useEffect(() => {
        async function fetchData(){
            setStLoading(true)
            const villeStatistiques = await ApiCall.getVilleStatistiques(token,stActive,stFromDate,stToDate)
            setStData(villeStatistiques)
            setStLoading(false)
        }
        fetchData()
        return () => {
            setStData([])
        }
    }, [stActive,token,stFromDate,stToDate])
    
    useEffect(() => {
        async function fetchData(){
            setSevenChartLoading(true)
            var countSeven  = []
            var sumSeven = []
            var monthSeven = []
            var sum = 0
            var count = 0
            const seven = await ApiCall.getStatistiques(token,"seven");
            seven.seven.forEach(element => {
                count +=element.count
                sum +=element.sum
                countSeven.push(element.count)
                sumSeven.push(element.sum)
                monthSeven.push(monthSwitch(element.month))
            });
            setSevenData([countSeven,sumSeven,monthSeven,sum,count])
            setSevenChartLoading(false)
        }
        fetchData()
        return () => {
            setSevenChartLoading(true)
        }
    }, [token])

    return (
        <div>
                <div className="row" style={{justifyContent:"space-between",margin:10,alignItems:"center"}} > 
                    <h2 className="page-header">Accueil</h2>
                    <div style={{diplay:"flex",flexDirection:"column",justifyItems:"flex-end"}}>
                        <CustomNav appearance="subtle" active={active} onSelect={handleSelect} />
                        {active==="custom"?<div className="row" style={{marginRight:0,justifyContent:"end"}}>
                            <DatePickerFreeDate  handleDateChange={handleIntervalDateChange} />
                        </div>:null}
                    </div>
                </div>
            <div className="row">
                <div className="col-4">
                    <div className="row">
                        <div className="col-12">
                                    <StatusCard
                                        icon="bx bx-receipt"
                                        count={loading ? <Loader />:normalData[2]}
                                        title="Nombre de Tickets"
                                        daily={active==="day"||active==="custom"?null:daily?daily[0]:null}
                                        />
                        </div>
                        <div className="col-12">
                                    <StatusCard
                                        icon="bx bx-money"
                                        count={loading ? <Loader />:normalData[3]+" Dh"}
                                        title="Revenue"
                                        daily={active==="day"||active==="custom"?null:daily?daily[1]+" dh":null}
                                        />
                        </div>
                         
                    </div>
                </div>
                <div className="col-8">
                    <div className="card" >
                        <div className="row" style={{justifyContent:"space-between",alignItems:"center"}}>
                            <h5>Statistiques {seasonSwitch(active)}</h5>
                            {loading ? <Loader content="Chargement en cours..." />:<Icon icon="bar-chart" size="2x" />}
                        </div>    
                        <Chart
                            options={themeReducer === 'theme-mode-dark' ? {
                                ...options2,
                                theme: { mode: 'dark' }
                            } : {
                                ...options2,
                                theme: { mode: 'light' }
                            }}
                            series={normalChart}
                            type='line'
                            height='100%'
                        />
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card" >
                    <div className="row" style={{justifyContent:"space-between",margin:10,alignItems:"center"}} >
                        <h5>Reporting par ville</h5>
                        <div style={{diplay:"flex",flexDirection:"column",justifyItems:"flex-end"}}>
                            <StCustomNav appearance="subtle" active={stActive} onSelect={handleStSelect} />
                            {stActive==="custom"?<div className="row" style={{marginRight:0,justifyContent:"end"}}>
                                <StDatePickerFreeDate  handleDateChange={handleStIntervalDateChange} />
                                </div>:null}
                        </div>
                    </div>
                    {stLoading?
                                <div style={{display:'flex',justifyContent:'center',padding:'50px'}}>
                                    <Loader  content="Chargement en cours..." />
                                </div>
                                :
                                <CustomList dates={[stFromDate,stToDate]} dataList={stData}/>
                                }

                </div>
            </div>
                    


            <div className="row">
            <div className="col-8">
                    <div className="card" >
                        <div className="row" style={{justifyContent:"space-between",alignItems:"center"}}>
                        <h5 >Les mois précédents</h5>
                        {sevenChartLoading ? <Loader content="Chargement des données en cours..." />:<Icon icon="line-chart" size="2x" />}
                             </div>    
                        
                        {/* chart */}
                        <Chart
                            options={themeReducer === 'theme-mode-dark' ? {
                                ...options1,
                                theme: { mode: 'dark' }
                            } : {
                                ...options1,
                                theme: { mode: 'light' }
                            }}
                            series={sevenChart}
                            type='line'
                            height='100%'
                        />
                        
                    </div>
                    
                </div>
                <div className="col-4" > 
                    <div className="row" >
                        <div className="col-12">
                                    <StatusCard
                                        icon="bx bx-receipt"
                                        count={sevenChartLoading ? <Loader />:sevenData[4]}
                                        title="Nombre de Tickets"
                                        />
                        </div>
                        <div className="col-12">
                                    <StatusCard
                                        icon="bx bx-money"
                                        count={sevenChartLoading ? <Loader />:sevenData[3]+" Dh"}
                                        title="Revenue"
                                        />
                        </div>
                    </div>
                </div>            
            </div>
        </div>
    )
}

export default Dashboard
