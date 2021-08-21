import React from 'react'

import './statuscard.css'

const StatusCard = props => {
    return (
        <div className='status-card'>
            <div className="status-card__icon">
                <i className={props.icon}></i>
            </div>
            <div className="status-card__info" >
                    {props.daily? <div className="row" style={{justifyContent:"flex-end"}}><h5 >+{props.daily}</h5> </div>:null}
                <h4>{props.count}</h4>
                <span>{props.title}</span>
            </div>
        </div>
    )
}

export default StatusCard
