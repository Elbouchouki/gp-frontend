import React, { useState } from 'react'
import { FlexboxGrid , List,Icon, Button } from 'rsuite'

const CustomList = ({dataList},...props) => {
  const styleCenter = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60px'
  };
  
  const slimText = {
    fontSize: '0.9em',
    color: '#97969B',
    fontWeight: 'bold',
    paddingBottom: 5
  };
  
  const titleStyle = {
    textTransform: "capitalize",
    paddingBottom: 5,
    whiteSpace: 'nowrap',
    fontWeight: 'bold'
  };
  
  const dataStyle = {
    fontSize: '1.1em',
    fontWeight: 500
  };
    return (
      
        <List hover>
        {dataList?.map((item, index) => (
          <List.Item key={item.id} index={index}>
            <FlexboxGrid>
              {/*icon*/}
              <FlexboxGrid.Item colspan={2} style={styleCenter}>
                <Icon
                  icon="car"
                  style={{
                    color: 'darkgrey',
                    fontSize: '1.5em'
                  }}
                />
              </FlexboxGrid.Item>
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
                <div style={slimText}>
                  <div>{item.ville}</div>
                </div>
              </FlexboxGrid.Item>
              {/*peak data*/}
              <FlexboxGrid.Item colspan={4} style={styleCenter}>
                <div style={{ textAlign: 'right' }}>
                  <div style={slimText}>CM (P)</div>
                  <div style={dataStyle}>
                  {((item.ticket_normal+item.ticket_illisible+item.ticket_perdu))===0?
                        0
                        :<span style={{color:"green"}}>
                        {"+"+(item.ticket_normal+item.ticket_illisible+item.ticket_perdu).toLocaleString()}
                      </span>
                      }
                    
                  </div>
                </div>
                
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={3} style={styleCenter}>
                <div style={{ textAlign: 'right' }}>
                  <div style={slimText}>Abonnées</div>
                  <div style={dataStyle}>
                    
                  {(item.recharge_abonne_an)===0?
                        0
                        :<span style={{color:"green"}}>
                          {"+"+(item.recharge_abonne).toLocaleString()}
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
                      {(item.ticket_normal_an+item.ticket_illisible_an+item.ticket_perdu_an+item.recharge_abonne_an)===0?
                        0
                        :<span style={{color:"red"}}>
                          {"-"+(item.ticket_normal_an+item.ticket_illisible_an+item.ticket_perdu_an+item.recharge_abonne_an).toLocaleString()}
                         </span>
                      }
                      </div>
                </div>
                
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={4} style={styleCenter}>
                <div style={{ textAlign: 'right' }}>
                  <div style={slimText}>Total</div> 
                    <div style={dataStyle}>
                      {(item.ticket_normal+item.ticket_illisible+item.ticket_perdu+item.recharge_abonne).toLocaleString()}  
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
                <Button appearance="ghost" disabled>Détails</Button>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </List.Item>
        ))}
      </List>
    )
}

export default CustomList
