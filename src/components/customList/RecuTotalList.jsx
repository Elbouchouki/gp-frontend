import React,{useRef,useState} from 'react'
import {useReactToPrint} from 'react-to-print'
import { FlexboxGrid , List,IconButton,Icon,Modal,Button} from 'rsuite'
import RecusListItem from './RecusListItem'
import moment from 'moment'
const RecuTotalList = ({data,dates,articles}) => {
    const printRef = useRef()
    const [show,setShow]=useState(false);
    const closeModal=()=> {
      setShow(false)
    }
    const openModal=()=> {
      setShow(true)
    }
    const handlePrint = useReactToPrint({
      documentTitle:`details`,
      content:()=>printRef.current})
    const styleCenter = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '40px'
      };
      const titleStyle = {
        textTransform: "capitalize",
        paddingBottom: 5,
        whiteSpace: 'nowrap',
        fontSize: '1em',
        fontWeight: 'bold'
      };
      
      const slimText = {
        fontSize: '0.9em',
        color: '#97969B',
        fontWeight: 'bold',
        paddingBottom: 5,
        textAlign:"center"
      };

      const dataStyle = {
        fontSize: '0.9em',
        fontWeight: 500,
        textAlign:"center"
      };
    return (
        data === null ? null : <List>
        <List.Item>
        {console.log(articles)}
            <FlexboxGrid>
            <FlexboxGrid.Item colspan={5} style={styleCenter}>
                <div style={{ textAlign: 'right' }}>
                <div style={slimText}>Nbr.T Confirmés</div>
                <div style={dataStyle}>
                {((data[`total`]['confirmé'].cpt))===0?
                        0
                        :<span style={{color:"green"}}>
                        {(data[`total`]['confirmé'].cpt)}
                    </span>
                    }
                </div>
                </div>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={6} style={styleCenter}>
                <div style={{ textAlign: 'right' }}>
                <div style={slimText}>Total.t Confirmés</div>
                <div style={dataStyle}>
                {((data[`total`]['confirmé'].total))===0?
                        0
                        :<span style={{color:"green"}}>
                        {"+"+(data[`total`]['confirmé'].total)?.toLocaleString()}
                    </span>
                    }
                </div>
                </div>
            </FlexboxGrid.Item>
            
            {/*uv data*/}
            <FlexboxGrid.Item colspan={5} style={styleCenter}>
                <div style={{ textAlign: 'right' }}>
                <div style={slimText}>Nbr.T Annulés</div>
                    <div style={dataStyle}>
                    {(data[`total`]['annulé'].cpt)===0?
                        0
                        :<span style={{color:"red"}}>
                        {(data[`total`]['annulé'].cpt)}
                        </span>
                    }
                    </div>
                </div>
                
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={6} style={styleCenter}>
                <div style={{ textAlign: 'right' }}>
                <div style={slimText}>Total.t Annulés</div>
                    <div style={dataStyle}>
                    {(data[`total`]['annulé'].total)===0?
                        0
                        :<span style={{color:"red"}}>
                        {"-"+(data[`total`]['annulé'].total)?.toLocaleString()}
                        </span>
                    }
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
                    <IconButton onClick={openModal} appearance="subtle" icon={<Icon icon="more" />} />
                     
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </List.Item>
        <Modal show={show} onHide={closeModal}>
          <Modal.Header>
            <Modal.Title>Détails</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div ref={printRef}>
            <FlexboxGrid style={{marginTop:15,marginBottom:15}}>
                <FlexboxGrid.Item colspan={4} style={styleCenter}>
                  <Icon
                    icon="detail"
                    style={{
                      fontSize: '1.5em'
                    }}
                  />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item
                  colspan={20}
                  style={{
                    ...styleCenter,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    overflow: 'hidden'
                  }}
                >
                    <div style={titleStyle}>Détails Recus</div>
                  <div style={slimText}>
                    <div>                
                      {moment(dates[0]).format("DD/MM/YYYY")===moment(dates[1]).format("DD/MM/YYYY") ? `Le ${moment(dates[0]).format("DD/MM/YYYY")}.`:`De ${moment(dates[0]).format("DD/MM/YYYY")} à ${moment(dates[1]).format("DD/MM/YYYY")}.`}
                    </div>
                  </div>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            {data === null ? null : 
                <List hover>
                        <List.Item>
                            <FlexboxGrid>
                            <FlexboxGrid.Item
                                colspan={8}
                                style={{
                                ...styleCenter,
                                flexDirection: 'column',
                                alignItems: 'center',
                                overflow: 'hidden'
                                }}
                            >   
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={4} style={styleCenter}>
                                <div style={{ textAlign: 'center' }}>
                                <div style={slimText}>Nbr.T Confirmés</div>
                                </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={4} style={styleCenter}>
                                <div style={{ textAlign: 'center' }}>
                                <div style={slimText}>Total.T Confirmés</div>
                                </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={4} style={styleCenter}>
                                <div style={{ textAlign: 'center' }}>
                                <div style={slimText}>Nbr.T Annulés</div>
                                </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={4} style={styleCenter}>
                                <div style={{ textAlign: 'center' }}>
                                <div style={slimText}>Total.T Annulés</div>
                                </div>
                            </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </List.Item>
                    
                    {articles.map((element,index)=><RecusListItem index={index} item={data[`${element}`]}/>)}
                    <List.Item>
                    </List.Item>
                    <RecusListItem index={10} item={data[`total`]}/>
                </List>}  
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

export default RecuTotalList
