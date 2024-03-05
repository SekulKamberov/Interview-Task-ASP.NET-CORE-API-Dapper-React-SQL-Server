'use strict'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { AgGridReact } from 'ag-grid-react'

import React, { useCallback, useMemo, useState } from 'react'
import { Button } from '@mui/material'  

import moment from 'moment'
 

const GridView = (props) => {
  const { displayUserHours } = props
  const containerStyle = useMemo(() => ({ width: '100%', height: '500px' }), [])
  const gridStyle = useMemo(() => ({ height: '500px', width: '100%' }), [])
  const limit = 10

  const [rowData, setRowData] = useState()

  const [columnDefs, setColumnDefs] = useState([
    { field: 'name', minWidth: 90 },
    { field: 'sirname', minWidth: 90 },
    { field: 'email', minWidth: 170, },
    { field: 'project', minWidth: 100, },
    { 
        field: 'created', 
        minWidth: 100, 
        valueFormatter: function (params) {
            return moment(params.value).format('D/MM/yyyy')
        }, 
    }, 
    { 
        field: 'compare', 
        minWidth: 100, 
        filter: false,
        valueGetter: (params) =>
        params,
        cellRenderer: function(params){
            return <Button onClick={(e) => displayUserHours(e, params.value.data.id)} variant="outlined" 
                style={{ marginTop: '-7px', borderRadius: '8px', maxWidth: "69px", minHeight: "23px", 
                    fontSize: 10, color: "black", maxHeight: "34px", minWidth: "66px", 
                    border: '1px solid blue' 
                }}
            >
                Compare 
            </Button>
        },
    },
     
    
  ])

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: true,
      floatingFilter: true,
       
    }
  }, [])
  
const onGridReady = useCallback((params) => { 
  //console.log('params.endRow', params.api) 
    const page = 1 /// limit 
  
    const startDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    const endDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')

    fetch(`https://localhost:7186/api/home/GetUsers/${page}/${limit}/${startDate}/${endDate}`)
      .then(resp => resp.json())
      .then(res => { 
        setRowData(res) 
      
        console.log('res =>', res)
      }).catch(err => {
        //params.successCallback([], 0);
        console.log(err)
      }) 
    //.then((resp) => resp.json())
    //  .then((data) =>  
      //  setRowData(data)
      //)
  }, [])  

  //console.log('rowData =>', rowData)
  return (
    <div style={containerStyle}>
      <div
        style={gridStyle}
        className={
          "ag-theme-quartz"
        }
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          //rowModelType={'infinite'}
          onGridReady={onGridReady} 
          //rowModelType={rowModelType} 
          pagination={true} 
          //paginationPageSize={10}   
          //cacheBlockSize={10}  
          paginationPageSize={limit}
          cacheBlockSize={limit}
        />
      </div>
    </div>
  )
}
export default GridView   
