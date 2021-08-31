import React from 'react'
import { Route, Switch,Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Dashboard from '../pages/Dashboard'
import Recu from '../pages/Recu'
import Mouvement from '../pages/Mouvement'
import NotFound from '../pages/NotFound'
import Forbidden from '../pages/Forbidden'

const ProtectedRoute =({component:Component,perm,...restProps})=>{
    const authReducer = useSelector(state=>state.AuthReducer)
    const permissions = authReducer.user.permissions
    const access = permissions.some((element) => element.name === perm)
    return <Route {...restProps} render={(props)=>access ?<Component {...props}/>:<Redirect to="/unauthorized"/>}/>
}
const Routes = () => {

    return (
        <Switch>
            <Route path='/' exact component={()=><Dashboard/>}/>
            <ProtectedRoute perm="show_recu_normal" path='/tickets-normals' exact component={()=><Recu articleId="1" pageTitle="Tickets normaux"/>}/>
            <ProtectedRoute perm="show_recu_illisible" path='/tickets-illisible' exact component={()=><Recu articleId="2" pageTitle="Tickets illisibles"/>}/>
            <ProtectedRoute perm="show_recu_perdu" path='/tickets-perdus' exact component={()=><Recu articleId="3" pageTitle="Tickets perdus"/>}/>
            <ProtectedRoute perm="show_recu_entree_abonne" path='/entreés-abonnés' exact component={()=><Recu articleId="4" pageTitle="Entrées Abonnés"/>}/>
            <ProtectedRoute perm="show_recu_recharge_abonne" path='/recharges-abonnés' exact component={()=><Recu articleId="5" pageTitle="Recharges Abonnés"/>}/>
            <ProtectedRoute perm="show_mouvement" path='/mouvements' exact component={()=><Mouvement pageTitle="Mouvements"/>}/>
            <Route path='/unauthorized' exact component={()=><Forbidden/>}/>
            <Route component={()=><NotFound/>}/>
        </Switch>
    )
}

export default Routes
