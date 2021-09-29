import React from 'react'
import { Route, Switch,Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Dashboard from '../pages/Dashboard'
import Recu from '../pages/Recu'
import Mouvement from '../pages/Mouvement'
import NotFound from '../pages/NotFound'
import Forbidden from '../pages/Forbidden'
import Users from '../pages/Users'
import Bilan from '../pages/Bilan'

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
            <ProtectedRoute perm="show_recu_normal" path='/tickets' exact component={()=><Recu type="normal" articleId={[1,2,3]} pageTitle="Tickets"/>}/>
            {/* <ProtectedRoute perm="show_recu_illisible" path='/tickets-illisible' exact component={()=><Recu articleId="2" pageTitle="Tickets illisibles"/>}/> */}
            {/* <ProtectedRoute perm="show_recu_perdu" path='/tickets-perdus' exact component={()=><Recu articleId="3" pageTitle="Tickets perdus"/>}/> */}
            {/* <ProtectedRoute perm="show_recu_entree_abonne" path='/sortie-abonnés' exact component={()=><Recu articleId="4" pageTitle="Sorties Abonnés"/>}/> */}
            <ProtectedRoute perm="show_recu_recharge_abonne" path='/abonnés' exact component={()=><Recu type="abonné" articleId={[6,7,8]} pageTitle="Abonnements"/>}/>
            <ProtectedRoute perm="show_recu_normal" path='/bilans' exact component={()=><Bilan pageTitle="Bilans"/>}/>
            <ProtectedRoute perm="show_mouvement" path='/mouvements' exact component={()=><Mouvement pageTitle="Mouvements"/>}/>
            {/* <ProtectedRoute perm="show_annulation" path='/annulations' exact component={()=><Annulation pageTitle="Mouvements"/>}/> */}
            <ProtectedRoute perm="manage_users" path='/utilisateurs' exact component={()=><Users pageTitle="Utilisateurs"/>}/>
            {/* <ProtectedRoute perm="manage_roles" path='/autorizations' exact component={()=><Users pageTitle="Mouvements"/>}/> */}
            <Route path='/unauthorized' exact component={()=><Forbidden/>}/>
            <Route component={()=><NotFound/>}/>
        </Switch>
    )
}

export default Routes
