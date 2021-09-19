import React, { useState,useRef } from 'react'
import {useReactToPrint} from 'react-to-print'
import { FlexboxGrid , List,Icon, Button,Modal } from 'rsuite'
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
  const printRef = useRef()
  const [show,setShow]=useState(false);
  const closeModal=()=> {
    setShow(false)
  }
  const openModal=(item)=> {
    setCurrentItem(item)
    setShow(true)
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
              {isMobile?null:<FlexboxGrid.Item colspan={2} style={styleCenter}>
                <Icon
                  icon="car"
                  style={{
                    color: 'darkgrey',
                    fontSize: '1.5em'
                  }}
                />
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
              <FlexboxGrid.Item colspan={4} style={styleCenter}>
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
              <FlexboxGrid.Item colspan={4} style={styleCenter}>
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
                {isMobile?null:<Button appearance="ghost" onClick={()=>openModal(item)} >Détails</Button>}
                
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </List.Item>
        ))}


        <Modal show={show} onHide={closeModal}>
          <Modal.Header>
            <Modal.Title>Détails</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div ref={printRef}>
              <FlexboxGrid style={{marginTop:15}}>
                <FlexboxGrid.Item colspan={4} style={styleCenter}>
                  <Icon
                    icon="car"
                    style={{
                      color: 'darkgrey',
                      fontSize: '1.5em'
                    }}
                  />
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
                      {moment(dates[0]).format("DD/MM/YYYY")===moment(dates[1]).format("DD/MM/YYYY") ? `Le ${moment(dates[0]).format("DD/MM/YYYY")}.`:`De ${moment(dates[0]).format("DD/MM/YYYY")} à ${moment(dates[1]).format("DD/MM/YYYY")}.`}
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
                              {(currentItem?.ticket_normal_an+currentItem?.ticket_illisible_an+currentItem?.ticket_perdu_an+currentItem?.recharge_abonne_an)===0?
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
            <Button onClick={handlePrint} appearance="primary">
              Imprimer
            </Button>
            <Button onClick={closeModal} appearance="subtle">
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      </List>
    )
}

export default CustomList
