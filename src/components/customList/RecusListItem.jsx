import React from 'react'
import { FlexboxGrid , List} from 'rsuite'

const RecusListItem = ({item,index}) => {
    const styleCenter = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '40px'
      };
      const slimText = {
        fontSize: '0.9em',
        color: '#97969B',
        fontWeight: 'bold',
        paddingBottom: 5,
        textAlign:"center"
      };
      
      const titleStyle = {
        textTransform: "capitalize",
        paddingBottom: 5,
        // whiteSpace: 'nowrap',
        fontSize: '1em',
        fontWeight: 'bold',textAlign:"center"
      };
      
      const dataStyle = {
        fontSize: '0.9em',
        fontWeight: 500,
        textAlign:"center"
      };
    return (
        <List.Item key={index}>
                <FlexboxGrid>
                {/*icon*/}
                <FlexboxGrid.Item
                    colspan={8}
                    style={{
                    ...styleCenter,
                    flexDirection: 'column',
                    alignItems: 'center',
                    overflow: 'hidden'
                    }}
                >
                    <div style={titleStyle}>{item.name}</div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={4} style={styleCenter}>
                    <div style={{ textAlign: 'right' }}>
                    
                    <div style={dataStyle}>
                    {((item['confirmé'].cpt))===0?
                            0
                            :<span style={{color:"green"}}>
                            {(item['confirmé'].cpt)}
                        </span>
                        }
                    </div>
                    </div>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={4} style={styleCenter}>
                    <div style={{ textAlign: 'right' }}>
                    
                    <div style={dataStyle}>
                    {((item['confirmé'].total))===0?
                            0
                            :<span style={{color:"green"}}>
                            {"+"+(item['confirmé'].total)?.toLocaleString()}
                        </span>
                        }
                    </div>
                    </div>
                </FlexboxGrid.Item>
                
                {/*uv data*/}
                <FlexboxGrid.Item colspan={4} style={styleCenter}>
                    <div style={{ textAlign: 'right' }}>
                    
                        <div style={dataStyle}>
                        {(item['annulé'].cpt)===0?
                            0
                            :<span style={{color:"red"}}>
                            {(item['annulé'].cpt)}
                            </span>
                        }
                        </div>
                    </div>
                    
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={4} style={styleCenter}>
                    <div style={{ textAlign: 'right' }}>
                    
                        <div style={dataStyle}>
                        {(item['annulé'].total)===0?
                            0
                            :<span style={{color:"red"}}>
                            {"-"+(item['annulé'].total)?.toLocaleString()}
                            </span>
                        }
                        </div>
                    </div>
                    
                </FlexboxGrid.Item>
                {/*uv data*/}
                    {/* <FlexboxGrid.Item
                        colspan={2}
                        style={{
                        ...styleCenter
                        }}
                    >
                        {isMobile?null:<Button appearance="ghost" onClick={()=>openModal(item)} >Détails</Button>}
                        
                    </FlexboxGrid.Item> */}
                </FlexboxGrid>
        </List.Item>
    )
}

export default RecusListItem
