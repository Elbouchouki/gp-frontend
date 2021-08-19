import React, { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import { useSelector } from 'react-redux'
import StatusCard from '../components/status-card/StatusCard'
import { Nav} from 'rsuite'

const options= {
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
        categories: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Juil', 'Aout', 'Sep','Oct','Nov','Dec']
    },
    legend: {
        position: 'bottom'
    },
    grid: {
        show: false
    }
}
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
            <Nav.Item pullRight eventKey={1}>Jour</Nav.Item>
            <Nav.Item eventKey={2}>Semaine</Nav.Item>
            <Nav.Item eventKey={3}>Mois</Nav.Item>
            <Nav.Item eventKey={4}>Année</Nav.Item>
        </Nav>
    );
};
const Dashboard = () => {
    const [yearChart,setYearChart] = useState([{
        name: 'Online Customers',
        data: [40, 70, 20, 90, 36, 80, 30, 91, 60]
    }, {
        name: 'Store Customers',
        data: [40, 30, 70, 80, 40, 16, 40, 20, 51, 10,1,1]
    }])
    const [loading,setLoading] = useState(true)
    const themeReducer = useSelector(state => state.ThemeReducer.mode)
    const [active, setActive] = useState(1)
    const handleSelect = (activeKey) => {
        setActive(activeKey);
    }
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
                                        count="1234"
                                        title="Tickets"
                                        />
                        </div>
                        <div className="col-12">
                                    <StatusCard
                                        icon="bx bx-receipt"
                                        count="$13123"
                                        title="Revenue"
                                        />
                        </div>
                        <div className="col-12">
                                    <StatusCard
                                        icon="bx bxs-traffic-barrier"
                                        count="$13123"
                                        title="Mouvements"
                                        />
                        </div>
                        
                    </div>
                </div>
                <div className="col-8">
                    <div className="card full-height">
                        {/* chart */}
                        <Chart
                            options={themeReducer === 'theme-mode-dark' ? {
                                ...options,
                                theme: { mode: 'dark' }
                            } : {
                                ...options,
                                theme: { mode: 'light' }
                            }}
                            series={yearChart}
                            type='line'
                            height='100%'
                        />
                    </div>
                </div>
                <div className="col-12">

                    <div className="card">
                        <div className="card__header">
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
