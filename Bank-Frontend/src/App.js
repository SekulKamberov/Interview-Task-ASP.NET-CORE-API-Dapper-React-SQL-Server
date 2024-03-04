'use strict'

import React, { useEffect, useState } from 'react'

import GridView from '../src/components/GridView' 
import { Chart } from "react-google-charts" 

import { Button, Grid, ThemeProvider, createTheme } from '@mui/material'  
import { getUserHours, createdb } from '../src/services/User'
import TopTen from '../src/components/TopTen'

const theme = createTheme({
  typography: {
    fontFamily: ['"Open Sans"', 'Arial', 'Roboto'].join(','),
      h1: {
     fontFamily: '"Arial", Open Sans',
    }
  }, 
})
  
function App() { 
  const [dbready, setDbready] = useState(false) 
  //const [data, setData] = useState([])  
  const [userHours, setUserHours] = useState([]) 
 
  const populateHours = (data) => {  
    let d = [["Name", "Hours"]]  
    data.forEach(function(item, index) {   
        d.push([item.name, item.hours])  
    }) 
    console.log('d', d)
    setUserHours(d)  
  }
    
  const displayUserHours = (e, userId) => {    
    e.preventDefault()
    getUserHours(userId)
        .then((data) =>  {     
          populateHours(data)   
        })
        .catch(error => console.log(error)) 
  } 
   
  const color = { color: "blue" }   
  const handleBarClick = (element) => {
    console.log(`The  ${element.text} with value ${element.value} was clicked`)
  }

  const dbinit = (e) => { 
    e.preventDefault()
    createdb()
      .then((data) => {
        console.log(data)
        setDbready(data)
      })
    .catch(error => console.log(error)) 
  }

  const options = {
    title: "TOP 10 Users with the highest hours",
    chartArea: { width: "50%" },
    hAxis: {
      title: "Total Hours",
      minValue: 0,
    },
    vAxis: {
      title: "Users",
    }, 
  } 

  const options2 = { 
    chartArea: { width: "50%" }, 
    colors: ['red','green', 'purple']
  } 

  return (
    <ThemeProvider theme={theme}> 
    <> 
    {!dbready && 
      <Grid container item xs={12} sm={12} md={12} lg={12} p={15} 
            alignItems="center" justifyContent="center"   
      >
            <Button onClick={(e) => dbinit(e)} variant="outlined" 
                style={{ borderRadius: '18px', maxWidth: "169px", minHeight: "63px", 
                    fontSize: 30, color: "red", maxHeight: "64px", minWidth: "166px", 
                    border: '2px solid blue' 
                }}
            >
                  DB Init
            </Button>
      </Grid>
    }
    {dbready && 
      <Grid container item xs={12} sm={12} md={12} lg={12} p={5} ml={5} 
            alignItems="center" justifyContent="center"   
      >
        <Grid container item xs={12} sm={12} md={6} lg={6}    
            alignItems="center" justifyContent="center"   
       > 
            <GridView displayUserHours={displayUserHours}/>  
        </Grid>

        <Grid container item xs={12} sm={12} md={6} lg={6} 
            alignItems="center" justifyContent="center"   
        > 
          {dbready &&  
            <TopTen/>
          }
          {dbready && userHours.length > 0 &&  
            <Grid container item xs={12} sm={12} md={12} lg={12} mt={3} 
              alignItems="center"
              justifyContent="center"   >   
              <Chart
                  chartType="Line"
                  //xlabel="People"
                  ylabel="Hours"
                  width={500}
                  height={'100%'}
                  //margin={margin}
                  data={userHours}
                  //color={color2}
                  onBarClick={handleBarClick}
                  options={options2}
              />
            </Grid>  
          } 
        </Grid>
         
      </Grid>
      }
      </>
  </ThemeProvider>
  ) 
}

export default App
