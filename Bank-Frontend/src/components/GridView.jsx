'use strict'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { AgGridReact } from 'ag-grid-react'

import React, { useCallback, useMemo, useState } from 'react'
import { Button } from '@mui/material'  

import moment from 'moment'

var filterParams = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    var dateAsString = cellValue;
    if (dateAsString == null) return -1
    var dateParts = dateAsString.split('/')
    var cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0])
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1
    }
    return 0
  },
  minValidYear: 2000,
  maxValidYear: 2021,
  inRangeFloatingFilterDateFormat: 'Do MMM YYYY',
}

const GridView = (props) => {
  const { displayUserHours } = props
  const containerStyle = useMemo(() => ({ width: '100%', height: '500px' }), [])
  const gridStyle = useMemo(() => ({ height: '500px', width: '100%' }), [])

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
    fetch('https://localhost:7186/api/home/GetInit')
      .then((resp) => resp.json())
      .then((data) =>  
        setRowData(data)
      )
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
          onGridReady={onGridReady} 
          //rowModelType={rowModelType} 
          pagination={true} 
          paginationPageSize={10}  
        />
      </div>
    </div>
  )
}
export default GridView   
