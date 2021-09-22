import React from 'react'
import mobile from "../../assets/images/mobile.gif"
import "./maintenance-mobile.css"
const MaintenanceMobile = () => {
    return (
        <div>
            <article>
                <img class="cls-1" src={mobile} alt="mobile" />
                <h1>La version mobile est en cours de construction.</h1>
                <div>
                    <p>Veuillez accéder à l'application à l'aide d'un ordinateur ou d'un pc portable. Si vous avez besoin de plus d'informations, vous pouvez toujours nous contacter sur <a href="https://www.linkedin.com/in/elbouchouki-ahmed/">LinkedIn</a></p>
                    <p>&mdash; Equipe GestPark</p>
                </div>
            </article>
        </div>
        // <div   
        //     style={{
        //         backgroundColor:"#4b52db",
        //         height: "100vh",
        //         width:"100wh",
        //         display: "flex",
        //         flexDirection:"column",
                
        //         }}>
        //         <div style={{
        //             flex: "1 0 auto",
        //             display: "flex",
        //             flexDirection:"column",
        //             justifyContent: "center",
        //             alignItems: "center",}}>
        //             <img style={{width:"100%",height:"auto"}} src={mobile} alt="mobile" />
        //             <div style={{color:"white",fontWeight:"bold",textAlign: "center"}}>La version mobile est en cours de construction.</div>
        //             <div style={{color:"white",fontWeight:"300",padding:20,textAlign: "center"}}>Veuillez accéder à l'application à l'aide d'un ordinateur ou d'un pc portable.</div>
        //             <div>&mdash; Equipe GestPark</div>
        //         </div>
                
        //         {/* <div style={{color:"white",flexShrink:0,justifyContent: "center",display: "flex",flexDirection:"row"}}>
        //             Gestpark © 2021
        //         </div> */}
            
        // </div>
    )
}

export default MaintenanceMobile
