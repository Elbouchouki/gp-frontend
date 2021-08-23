import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Recu from '../pages/Recu'
import Mouvement from '../pages/Mouvement'

const Routes = () => {
    return (
        <Switch>
            <Route path='/' exact component={()=><Dashboard/>}/>
            <Route path='/tickets-normals' exact component={()=><Recu articleId="1" pageTitle="Tickets normaux"/>}/>
            <Route path='/tickets-illisible' exact component={()=><Recu articleId="2" pageTitle="Tickets illisibles"/>}/>
            <Route path='/tickets-perdus' exact component={()=><Recu articleId="3" pageTitle="Tickets perdus"/>}/>
            <Route path='/entreés-abonnés' exact component={()=><Recu articleId="4" pageTitle="Tickets perdus"/>}/>
            <Route path='/recharges-abonnés' exact component={()=><Recu articleId="5" pageTitle="Tickets perdus"/>}/>
            <Route path='/mouvements' exact component={()=><Mouvement pageTitle="Mouvements"/>}/>

        </Switch>
    )
}

export default Routes
