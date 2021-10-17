import React,{useRef,useState} from 'react'
import {useReactToPrint} from 'react-to-print'
import { ExcelExport,ExcelExportColumn, } from '@progress/kendo-react-excel-export';

import { More,Detail,FileDownload ,TextImage } from '@rsuite/icons';
import {aggregateBy } from "@progress/kendo-data-query";
import { FlexboxGrid , List, IconButton ,Modal,Button,Dropdown,toaster,Message} from 'rsuite'
import RecusListItem from './RecusListItem'
import moment from 'moment'
const RecuTotalList = ({data,dates,articles}) => {
    const printRef = useRef()
    const [exportData,setExportData]=useState(null)
    const [exporter,setExporter] =useState(null)
    const [show,setShow]=useState(false);
    const closeModal=()=> {
      setShow(false)
    }
    const openModal= async() => {
      const datas = await articles.map((element,index)=> ({
        title:data[`${element}`]?.name ,
        nbr:data[`${element}`]?.['confirmé'].cpt ,
        somme:data[`${element}`]?.['confirmé'].total,
        nbrAn:data[`${element}`]?.['annulé'].cpt ,
        sommeAn:data[`${element}`]?.['annulé'].total
       })
       )
      setExportData(datas)
      setShow(true)
    }
    const handleExport =()=>{
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
              value: `Details Tickets ${interval}`,
              fontSize: 16,
              colSpan: 5,
              wrap:true,
              textAlign:"center",
              verticalAlign:"center"
            },
          ],
        };
        rows.unshift(headerRow);
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
                    <IconButton onClick={openModal} appearance="subtle" icon={<More  />} />
                     
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </List.Item>
        <Modal open={show} onClose={closeModal}>
          <Modal.Header>
            <Modal.Title>Détails Tickets</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div ref={printRef}>
            <FlexboxGrid style={{marginTop:15,marginBottom:15}}>
                <FlexboxGrid.Item colspan={4} style={styleCenter}>
                  <Detail 
                   style={{fontSize:"3em"}}
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
                    <div style={titleStyle}>Détails Tickets</div>
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
                fileName={`DetailsTickets-${moment(dates[0]).format("DD/MM/YYYY")}-${moment(dates[1]).format("DD/MM/YYYY")}.xlsx`}
                ref={setExporter}
                creator="GestPark"

        >
                <ExcelExportColumn 
                field="title"
                title=" "
                width={200} 
                cellOptions={{
                    color:"#fff",
                    background: "#808080",
                }}
                footer={()=>"Totals"}
                />
                <ExcelExportColumn 
                field="nbr"
                title="Nbr.T Confirmés" 
                width={120} 
                footer={() => {
                  const tol = aggregateBy(exportData, [
                      {
                        field: "nbr",
                        aggregate: "sum",
                      },
                    ]);
                  return `${tol.nbr.sum}`;
                }}/>
                
                <ExcelExportColumn 
                field="somme"
                title="Total.T Confirmés" 
                width={120}
                footer={() => {
                  const tol = aggregateBy(exportData, [
                      {
                        field: "somme",
                        aggregate: "sum",
                      },
                    ]);
                  return `${tol.somme.sum}`;
                }}/>
                
                <ExcelExportColumn 
                field="nbrAn"
                title="Nbr.T Annulés" 
                width={120}
                footer={() => {
                  const tol = aggregateBy(exportData, [
                      {
                        field: "nbrAn",
                        aggregate: "sum",
                      },
                    ]);
                  return `${tol.nbrAn.sum}`;
                }}/>
                
                <ExcelExportColumn
                field="sommeAn"
                title="Total.T Annulés"
                width={120}
                footer={() => {
                  const tol = aggregateBy(exportData, [
                      {
                        field: "sommeAn",
                        aggregate: "sum",
                      },
                    ]);
                  return `${tol.sommeAn.sum}`;
                }}/>
                
        </ExcelExport>
    </List>
    )
}

export default RecuTotalList