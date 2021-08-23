import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { useSelector } from 'react-redux'
import StatusCard from '../components/status-card/StatusCard'
import { Nav , Loader, Icon} from 'rsuite'
import ApiCall from '../api/Api'
import { monthSwitch, seasonSwitch } from '../helper/helper'


const statusCards= [
    {
        icon: "bx bx-shopping-bag",
        count: "$995",
        title: "Tickets normals"
    },
    {
        icon: "bx bx-cart",
        count: "$214,251",
        title: "Tickets illisibles"
    },
    {
        icon: "bx bx-dollar-circle",
        count: "$13,632",
        title: "Tickets perdus"
    },
    {
        icon: "bx bx-receipt",
        count: "1,711",
        title: "Total normals"
    }, {
        icon: "bx bx-shopping-bag",
        count: "1,995",
        title: "Total illisibles"
    },
    {
        icon: "bx bx-cart",
        count: "801",
        title: "Total perdus"
    }
]
const CustomNav = ({ active, onSelect, ...props }) => {
    return (
        <Nav  {...props} activeKey={active} onSelect={onSelect} >
            <Nav.Item eventKey="day">Jour</Nav.Item>
            <Nav.Item eventKey="week">Semaine</Nav.Item>
            <Nav.Item eventKey="month">Mois</Nav.Item>
            <Nav.Item eventKey="year">Année</Nav.Item>
        </Nav>
    );
};
const Dashboard = () => {
    const themeReducer = useSelector(state => state.ThemeReducer.mode)
    const [sevenData,setSevenData] = useState([])
    const [normalData,setNormalData] = useState([])
    // ->>>>>>>>>>> chart
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
            background: 'transparent'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
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
            categories: sevenData[2]
        },
        legend: {
            position: 'bottom'
        },
        grid: {
            show: false
        }
    }
    const [loading,setLoading] = useState(true)
    const [sevenChartLoading,setSevenChartLoading] = useState(true)
    const [active, setActive] = useState("day")
    const handleSelect = (activeKey) => {
        setActive(activeKey);
    }
    const [daily,setDaily]=useState(null)
    useEffect(() => {
        async function fetchData(){
            setLoading(true)
            var countArticle  = []
            var sumArticle = []
            const interval = await ApiCall.getStatistiques(active);
            if(!daily){setDaily([interval.recus[0]?.count,interval.recus[0]?.sum])}
            interval.article.forEach(element => {
                countArticle.push(element.count)
                sumArticle.push(element.sum)
            });
            setNormalData([countArticle,sumArticle,interval.recus[0].count,interval.recus[0].sum])
            setLoading(false)
        }
        fetchData()
        return () => {
            setLoading(true)
        }
    }, [active,daily])
    useEffect(() => {
        async function fetchData(){
            setSevenChartLoading(true)
            var countSeven  = []
            var sumSeven = []
            var monthSeven = []
            var sum = 0
            var count = 0
            const seven = await ApiCall.getStatistiques("seven");
            seven.seven.forEach(element => {
                count +=element.count
                sum +=element.sum
                countSeven.push(element.count)
                sumSeven.push(element.sum)
                monthSeven.push(monthSwitch(element.month))
            });
            setSevenData([countSeven,sumSeven,monthSeven,sum,count])
            console.log(sevenData);
            setSevenChartLoading(false)
        }
        fetchData()
        return () => {
            setSevenChartLoading(true)
        }
    }, [])
    return (
        <div>
                <div className="row" style={{justifyContent:"space-between",margin:10,alignItems:"center"}} > 
                    <h2 className="page-header">Accueil</h2>
                    <CustomNav appearance="subtle" active={active} onSelect={handleSelect} />
                </div>
            <div className="row">
                <div className="col-4">
                    <div className="row">
                        <div className="col-12">
                                    <StatusCard
                                        icon="bx bx-receipt"
                                        count={loading ? <Loader />:normalData[2]}
                                        title="Nombre de Tickets"
                                        daily={active==="day"?null:daily?daily[0]:null}
                                        />
                        </div>
                        <div className="col-12">
                                    <StatusCard
                                        icon="bx bx-money"
                                        count={loading ? <Loader />:normalData[3]+" Dh"}
                                        title="Revenue"
                                        daily={active==="day"?null:daily?daily[1]+" dh":null}
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
                        
                        {/* chart */}
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
            <div className="row">
            <div className="col-8">
                    <div className="card" >
                        <div className="row" style={{justifyContent:"space-between",alignItems:"center"}}>
                        <h5 >Ces derniers mois</h5>
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
                                        count={sevenData[4]}
                                        title="Nombre de Tickets"
                                        />
                        </div>
                        <div className="col-12">
                                    <StatusCard
                                        icon="bx bx-money"
                                        count={sevenData[3]+" Dh"}
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
