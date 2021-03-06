import React from 'react'
import "../assets/css/404.css"
import {useHistory } from 'react-router-dom'
import { Button } from 'rsuite'
import fourOfour from "../assets/images/fourOfour.gif"
const NotFound = () => {
    const history = useHistory()
    return (
        <div className="Container_fourOfour">
            <div className="fourOfour">
                <img className="Container_img" src={fourOfour} alt="404" />
                <p>404<h4>Page introuvable!</h4></p>
                <Button onClick={()=>{history.push("/")}} appearance="default">Accueil</Button>
            </div>
        </div>
    )
}

export default NotFound
