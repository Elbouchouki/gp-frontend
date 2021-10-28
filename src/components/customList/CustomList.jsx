import React, { useState,useRef } from 'react'
import {useReactToPrint} from 'react-to-print'
import Building from "../../assets/images/building.svg"
import { Location,Detail ,TextImage,FileDownload,Icon} from '@rsuite/icons';
import { FlexboxGrid , List , Button,Modal,Dropdown , toaster,Message} from 'rsuite'
import { ExcelExport,ExcelExportColumn, } from '@progress/kendo-react-excel-export';
import { isMobile } from "react-device-detect";
import moment from 'moment';
import ListItem from './ListItem';

const CustomList = ({dataList,dates},...props) => {
  const styleCenter = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px'
  };
  const styleCenter2 = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  
  const slimText = {
    fontSize: '0.9em',
    color: '#97969B',
    fontWeight: 'bold',
    paddingBottom: 5,textAlign:"center"
  };
  
  const titleStyle = {
    textTransform: "capitalize",
    paddingBottom: 5,
    whiteSpace: 'nowrap',
    fontSize: isMobile?'0.8em':'1.2em',
    fontWeight: 'bold'
  };
  
  const dataStyle = {
    fontSize: isMobile?'1em':'1.1em',
    fontWeight: 500,
    textAlign:"center"
  };
  const [currentItem,setCurrentItem]=useState(null);
  const [exportData,setExportData]=useState(null)
  const [exporter,setExporter] =useState(null)
  const printRef = useRef()
  const [show,setShow]=useState(false);
  const closeModal=()=> {
    setShow(false)
  }
  const openModal=(item)=> {
    setCurrentItem(item)
    
    setExportData(
      [
       {
        title:"Tickets Horaire" ,nbr:item.nbr_ticket_normal ,somme:item.ticket_normal  ,nbrAn:item.nbr_ticket_normal_an ,sommeAn:item.ticket_normal_an 
        
       },
       {
        title:"Tickets Illisible" ,nbr:item.nbr_ticket_illisible ,somme:item.ticket_illisible  ,nbrAn:item.nbr_ticket_illisible_an ,sommeAn:item.ticket_illisible_an 
        
       },
       {
        title:"Tickets Perdu" ,nbr:item.nbr_ticket_perdu ,somme:item.ticket_perdu  ,nbrAn:item.nbr_ticket_perdu_an ,sommeAn:item.ticket_perdu_an 
        
       },
       {
        title:"Nouveaux Abonnés" ,nbr:item.nbr_nouveau_abonne ,somme:item.nouveau_abonne  ,nbrAn:item.nbr_nouveau_abonne_an ,sommeAn:item.nouveau_abonne_an 
        
       },
       {
        title:"Recharges Abonnés Normaux" ,nbr:item.nbr_recharge_abonne ,somme:item.recharge_abonne  ,nbrAn:item.nbr_recharge_abonne_an ,sommeAn:item.recharge_abonne_an 
        
       },
       {
        title:"Recharges Abonnés ONCF" ,nbr:item.nbr_recharge_abonne_oncf ,somme:item.recharge_abonne_oncf  ,nbrAn:item.nbr_recharge_abonne_oncf_an ,sommeAn:item.recharge_abonne_oncf_an 
       }
      ]
    )
    setShow(true)
  }
  const handleExport=()=>{
    toaster.push(
      <Message type="warning" showIcon closable>
        Exportation encours...
      </Message>
    );
    if(exporter){
       toaster.clear()
       toaster.push(
        <Message type="success" showIcon closable>
          Telechargement ...
        </Message>
      );
      const options = exporter.workbookOptions();
      const rows = options.sheets[0].rows;
      options.sheets[0].frozenRows = 2;
      const interval = `DU ${moment(dates[0]).format("DD/MM/YYYY")} AU ${moment(dates[1]).format("DD/MM/YYYY")}`
      const headerRow = {
          height: 70,
          cells: [
            {
              value: `Details ${currentItem?.ville} ${interval}`,
              fontSize: 16,
              colSpan: 5,
              wrap:true,
              textAlign:"center",
              verticalAlign:"center"
            },
          ],
        };
        const addonTitle = {type:"header",
                            value: "", 
                            cells:[
                              {value: "", color: "#fff",background:"#fff"},
                              {value: "CM (P)", color: "#fff",background:"#808080"},
                              {value: "Abonnements", color: "#fff",background:"#808080"},
                              {value: "Tarifs à justifier", color: "#fff",background:"#808080"},
                              {value: "Total", color: "#fff",background:"#808080"},
                            ],
                            background:"#808080"
                            }
        const addonData = {type:"data",
        value: "", 
        cells:[
          {value: "", color: "#000"},
          {value: currentItem?.ticket_normal+currentItem?.ticket_illisible+currentItem?.ticket_perdu, color: "#3ec215"},
          {value: currentItem?.nouveau_abonne+currentItem?.recharge_abonne+currentItem?.recharge_abonne_oncf, color: "#3ec215"},
          {value: currentItem?.ticket_normal_an+currentItem?.ticket_illisible_an+currentItem?.ticket_perdu_an+currentItem?.nouveau_abonne_an+currentItem?.recharge_abonne_an+currentItem?.recharge_abonne_oncf_an, color: "#ff6e6e"},
          {value: currentItem?.ticket_normal+currentItem?.ticket_illisible+currentItem?.ticket_perdu+currentItem?.nouveau_abonne+currentItem?.recharge_abonne+currentItem?.recharge_abonne_oncf, color: "#000"},
        ],
        }
        rows.unshift(headerRow);
        rows.push({type:"data",
        value: "", 
        cells:[],
        })
        rows.push(addonTitle)
        rows.push(addonData)
        // console.log(rows)
      try {
          exporter.save(options);
      } catch (error) {
           toaster.clear()
           toaster.push(
            <Message type="error" showIcon closable>
              Erreur
            </Message>
          );
      }
      return
    }
     toaster.clear()
     toaster.push(
      <Message type="error" showIcon closable>
        Exportation echoué
      </Message>
    );
  }
  const handlePrint = useReactToPrint({
    documentTitle:`details-${currentItem?.ville}`,
    content:()=>printRef.current})
    return (
        <List hover>
        {dataList?.map((item, index) => (
          <List.Item key={index}>
            <FlexboxGrid>
              {/*icon*/}
              {<FlexboxGrid.Item colspan={2} style={styleCenter}>
                <img src={Building} alt="img" style={{width:"40px",height:"40px"}} />
                {/* <Icon
                  as={Building}
                  style={{
                    color: 'darkgrey',
                    fontSize:"3em"
                  }}
                /> */}
              </FlexboxGrid.Item>}
              {/*base info*/}
              <FlexboxGrid.Item
                colspan={4}
                style={{
                  ...styleCenter,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  overflow: 'hidden'
                }}
              >
                <div style={titleStyle}>{item.ville}</div>
                {/* <div style={slimText}>
                  <div>{item.ville}</div>
                </div> */}
              </FlexboxGrid.Item>
              {/*peak data*/}
              <FlexboxGrid.Item colspan={3} style={styleCenter}>
                <div style={{ textAlign: 'right' }}>
                  <div style={slimText}>CM (P)</div>
                  <div style={dataStyle}>
                  {((item.ticket_normal+item.ticket_illisible+item.ticket_perdu))===0?
                        0
                        :<span style={{color:"green"}}>
                        {"+"+(item.ticket_normal+item.ticket_illisible+item.ticket_perdu)?.toLocaleString()}
                      </span>
                      }
                    
                  </div>
                </div>
                
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={3} style={styleCenter}>
                <div style={{ textAlign: 'right' }}>
                  <div style={slimText}>Abonnées</div>
                  <div style={dataStyle}>
                    
                  {(item.nouveau_abonne+item.recharge_abonne+item.recharge_abonne_oncf)===0?
                        0
                        :<span style={{color:"green"}}>
                          {"+"+(item.nouveau_abonne+item.recharge_abonne+item.recharge_abonne_oncf)?.toLocaleString()}
                        </span>
                      }
                    </div>
                </div>
                
              </FlexboxGrid.Item>
              {/*uv data*/}
              <FlexboxGrid.Item colspan={3} style={styleCenter}>
                <div style={{ textAlign: 'right' }}>
                  <div style={slimText}>Tàj</div>
                    <div style={dataStyle}>
                      {(item.ticket_normal_an+item.ticket_illisible_an+item.ticket_perdu_an+item.nouveau_abonne_an+item.recharge_abonne_an+item.recharge_abonne_oncf_an)===0?
                        0
                        :<span style={{color:"red"}}>
                          {"-"+(item.ticket_normal_an+item.ticket_illisible_an+item.ticket_perdu_an+item.nouveau_abonne_an+item.recharge_abonne_an+item.recharge_abonne_oncf_an)?.toLocaleString()}
                         </span>
                      }
                      </div>
                </div>
                
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={3} style={styleCenter}>
                <div style={{ textAlign: 'right' }}>
                  <div style={slimText}>Bilans</div>
                    <div style={dataStyle}>
                      {(item.bilan)===0?
                        0:
                        (item.bilan)<3?
                            <span style={{color:"green"}}>
                              {(item.bilan)}
                            </span>:
                       (item.bilan)===3?
                            <span style={{color:"orange"}}>
                              {(item.bilan)}
                            </span>:
                            <span style={{color:"red"}}>
                              {(item.bilan)}
                            </span>
                        
                      }
                      </div>
                </div>
                
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={4} style={styleCenter}>
                <div style={{ textAlign: 'right' }}>
                  <div style={slimText}>Total</div> 
                    <div style={dataStyle}>
                      {(item.ticket_normal+item.ticket_illisible+item.ticket_perdu+item.nouveau_abonne+item.recharge_abonne+item.recharge_abonne_oncf)?.toLocaleString()}  
                    </div>              
                </div>
                
              </FlexboxGrid.Item>
              {/*uv data*/}
              <FlexboxGrid.Item
                colspan={2}
                style={{
                  ...styleCenter
                }}
              >
                {<Button appearance="ghost" onClick={()=>openModal(item)} >Détails</Button>}
                
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </List.Item>
        ))}


        <Modal open={show} onClose={closeModal}>
          <Modal.Header>
            <Modal.Title>Détails</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div ref={printRef}>
              <FlexboxGrid style={{marginTop:15}}>
                <FlexboxGrid.Item colspan={4} style={styleCenter}>
                  <img src={Building} alt="small" style={{width:"65px",height:"65px",marginTop:-20}} />
                  {/* <Icon
                   as={Building}
                    style={{
                      color: 'darkgrey',
                      fontSize:"3em"
                    }}
                  /> */}
                </FlexboxGrid.Item>
                <FlexboxGrid.Item
                  colspan={20}
                  style={{
                    ...styleCenter2,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    overflow: 'hidden'
                  }}
                >
                  <div style={titleStyle}>{currentItem?.ville}</div>
                  <div style={slimText}>
                    <div>                
                      {moment(dates[0]).format("DD/MM/YYYY HH:mm")===moment(dates[1]).format("DD/MM/YYYY HH:mm") ? `Le ${moment(dates[0]).format("DD/MM/YYYY")}.`:`De ${moment(dates[0]).format("DD/MM/YYYY HH:mm")} à ${moment(dates[1]).format("DD/MM/YYYY HH:mm")}.`}
                    </div>
                  </div>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            
              <List hover>
                {/* header */}
                <List.Item>
                    <FlexboxGrid>
                      <FlexboxGrid.Item colspan={6} style={styleCenter2}>
                        <div style={{ textAlign: 'left' }}>
                          
                        </div>  
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={4} style={styleCenter2}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={dataStyle}>
                            <div style={slimText}>Nbr Tickets</div>
                          </div>
                        </div>
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={5} style={styleCenter2}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={dataStyle}>
                            <div style={slimText}>Somme</div>
                          </div>
                        </div>
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={4} style={styleCenter2}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={dataStyle}>
                            <div style={slimText}>Nbr Tickets Annulés</div>
                          </div>
                        </div>
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={5} style={styleCenter2}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={dataStyle}>
                            <div style={slimText}>Somme Annulations</div>
                          </div>
                        </div>
                      </FlexboxGrid.Item>
                  </FlexboxGrid>
                </List.Item>
                {/* items */}
                <ListItem title="Tickets Horaire" nbr={currentItem?.nbr_ticket_normal} somme={currentItem?.ticket_normal}  nbrAn={currentItem?.nbr_ticket_normal_an} sommeAn={currentItem?.ticket_normal_an} />
                <ListItem title="Tickets Illisible" nbr={currentItem?.nbr_ticket_illisible} somme={currentItem?.ticket_illisible}  nbrAn={currentItem?.nbr_ticket_illisible_an} sommeAn={currentItem?.ticket_illisible_an} />
                <ListItem title="Tickets Perdu" nbr={currentItem?.nbr_ticket_perdu} somme={currentItem?.ticket_perdu}  nbrAn={currentItem?.nbr_ticket_perdu_an} sommeAn={currentItem?.ticket_perdu_an} />
                <ListItem title="Nouveaux Abonnés" nbr={currentItem?.nbr_nouveau_abonne} somme={currentItem?.nouveau_abonne}  nbrAn={currentItem?.nbr_nouveau_abonne_an} sommeAn={currentItem?.nouveau_abonne_an} />
                <ListItem title="Recharges Abonnés Normaux" nbr={currentItem?.nbr_recharge_abonne} somme={currentItem?.recharge_abonne}  nbrAn={currentItem?.nbr_recharge_abonne_an} sommeAn={currentItem?.recharge_abonne_an} />
                <ListItem title="Recharges Abonnés ONCF" nbr={currentItem?.nbr_recharge_abonne_oncf} somme={currentItem?.recharge_abonne_oncf}  nbrAn={currentItem?.nbr_recharge_abonne_oncf_an} sommeAn={currentItem?.recharge_abonne_oncf_an} />
                <List.Item>
                </List.Item>
                <List.Item>
                  <FlexboxGrid>
                    <FlexboxGrid.Item colspan={6} style={styleCenter}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={slimText}>CM (P)</div>
                          <div style={dataStyle}>
                          {((currentItem?.ticket_normal+currentItem?.ticket_illisible+currentItem?.ticket_perdu))===0?
                                0
                                :<span style={{color:"green"}}>
                                {"+"+(currentItem?.ticket_normal+currentItem?.ticket_illisible+currentItem?.ticket_perdu)?.toLocaleString()}
                              </span>
                              }
                          </div>
                        </div>
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={6} style={styleCenter}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={slimText}>Abonnées</div>
                          <div style={dataStyle}>
                          {(currentItem?.nouveau_abonne+currentItem?.recharge_abonne+currentItem?.recharge_abonne_oncf)===0?
                                0
                                :<span style={{color:"green"}}>
                                  {"+"+(currentItem?.nouveau_abonne+currentItem?.recharge_abonne+currentItem?.recharge_abonne_oncf)?.toLocaleString()}
                                </span>
                              }
                            </div>
                        </div>
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={6} style={styleCenter}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={slimText}>Tàj</div>
                            <div style={dataStyle}>
                              {(currentItem?.ticket_normal_an+currentItem?.ticket_illisible_an+currentItem?.ticket_perdu_an+currentItem?.nouveau_abonne_an+currentItem?.recharge_abonne_an+currentItem?.recharge_abonne_oncf_an)===0?
                                0
                                :<span style={{color:"red"}}>
                                  {"-"+(currentItem?.ticket_normal_an+currentItem?.ticket_illisible_an+currentItem?.ticket_perdu_an+currentItem?.nouveau_abonne_an+currentItem?.recharge_abonne_an+currentItem?.recharge_abonne_oncf_an)?.toLocaleString()}
                                </span>
                              }
                              </div>
                        </div>
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={6} style={styleCenter}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={slimText}>Total</div> 
                            <div style={dataStyle}>
                              {(currentItem?.ticket_normal+currentItem?.ticket_illisible+currentItem?.ticket_perdu+currentItem?.nouveau_abonne+currentItem?.recharge_abonne+currentItem?.recharge_abonne_oncf)?.toLocaleString()}  
                            </div>              
                        </div>
                      </FlexboxGrid.Item> 
                  </FlexboxGrid>
                </List.Item>
              </List>
            </div>
          </Modal.Body>

          <Modal.Footer>
            {/* <Button onClick={handlePrint} appearance="primary">
              Imprimer
            </Button> */}
            <Dropdown placement="leftEnd" title=" Sauvegarder" appearance="primary" noCaret icon={<TextImage />}>
              <Dropdown.Item onClick={handleExport} icon={<Detail/>}>Fichier Excel</Dropdown.Item>
              <Dropdown.Item onClick={handlePrint} icon={<FileDownload />}>Impression PDF</Dropdown.Item>
            </Dropdown>
            <Button onClick={closeModal} appearance="subtle">
              Fermer  
            </Button>
          </Modal.Footer>
        </Modal>
        <ExcelExport
                data={exportData}
                fileName={`Details-${currentItem?.ville}-${moment(dates[0]).format("DD/MM/YYYY")}-${moment(dates[1]).format("DD/MM/YYYY")}.xlsx`}
                ref={setExporter}
                creator="Elbouchouki"

        >
                <ExcelExportColumn 
                field="title"
                title=" "
                width={200} 
                cellOptions={{
                    color:"#fff",
                    background: "#808080",
                }}
                />
                <ExcelExportColumn 
                field="nbr"
                title="Nbr Tickets" 
                width={120} 
                />
                <ExcelExportColumn 
                field="somme"
                title="Somme" 
                width={120}
                />
                <ExcelExportColumn 
                field="nbrAn"
                title="Nbr Tickets An" 
                width={120}
                // cellOptions={{
                //     background: "#ff6e6e",
                // }}
                />
                <ExcelExportColumn
                field="sommeAn"
                title="Somme Annulations"
                width={120} 
                // cellOptions={{
                //     background: "#3ec215",
                // }}
                />
        </ExcelExport>
      </List>
    )
}

export default CustomList
