import React from 'react'
import "../assets/css/404.css"
import {useHistory } from 'react-router-dom'
import { Button } from 'rsuite'
import fourOtree from "../assets/images/fourOTree.gif"
const Forbidden = () => {
    const history = useHistory()
    return (
        <div className="Container_fourOfour">
            <div className="fourOfour">
                <img className="Container_img" src={fourOtree} alt="403" />
                <p>403<h4>Page interdite!</h4></p>
                <Button onClick={()=>{history.push("/")}} appearance="default">Accueil</Button>
            </div>
        </div>
    )
}

export default Forbidden
