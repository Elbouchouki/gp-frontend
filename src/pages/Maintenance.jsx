import React from 'react'
import MaintenanceDesktop from '../components/maintenance/Maintenance';
import MaintenanceMobile from '../components/maintenance/MaintenanceMobile';

import { isMobile } from "react-device-detect";

const Maintenance = () => {
    
        return isMobile ? <MaintenanceMobile/> : <MaintenanceDesktop/>
    
    
}

export default Maintenance
