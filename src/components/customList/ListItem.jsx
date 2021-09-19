import React from 'react'
import { FlexboxGrid , List} from 'rsuite'
import { isMobile } from "react-device-detect";

const ListItem = ({title,nbr,somme,nbrAn,sommeAn}) => {
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
      const dataStyle = {
        fontSize: isMobile?'1em':'1.1em',
        fontWeight: 500,
        textAlign:"center"
      };
    return (
        <List.Item>
                  <FlexboxGrid>
                    <FlexboxGrid.Item colspan={6} style={styleCenter2}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={slimText}>{title}</div>
                      </div>  
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={4} style={styleCenter2}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={dataStyle}>
                            { (nbr)===0
                                          ?
                              (nbr) 
                                          :
                              <span style={{color:"green"}}>
                                {(nbr)}
                              </span>
                            }
                        </div>
                      </div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={5} style={styleCenter2}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={dataStyle}>
                            { (somme)===0
                                          ?
                              (somme) 
                                          :
                              <span style={{color:"green"}}>
                                {"+"+(somme).toLocaleString()}
                              </span>
                            }
                        </div>
                      </div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={4} style={styleCenter2}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={dataStyle}>
                            { (nbrAn)===0
                                          ?
                              (nbrAn) 
                                          :
                              <span style={{color:"red"}}>
                                {(nbrAn)}
                              </span>
                            }
                          </div>
                      </div>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={5} style={styleCenter2}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={dataStyle}>
                            { (sommeAn)===0
                                          ?
                              (sommeAn) 
                                          :
                              <span style={{color:"red"}}>
                                {"-"+(sommeAn).toLocaleString()}
                              </span>
                            }
                          </div>
                      </div>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </List.Item>
    )
}
export default ListItem;
