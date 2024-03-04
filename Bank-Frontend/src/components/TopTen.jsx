'use strict'

import React, { useEffect, useState } from 'react'

import GridView from '../../src/components/GridView' 
import { Chart } from "react-google-charts" 

import { Button, Grid, ThemeProvider, createTheme } from '@mui/material'  
import { getUserHours, createdb } from '../../src/services/User'

const theme = createTheme({
  typography: {
    fontFamily: ['"Open Sans"', 'Arial', 'Roboto'].join(','),
      h1: {
     fontFamily: '"Arial", Open Sans',
    }
  }, 
})
  
function TopTen() {  
  //const [userHours, setUserHours] = useState([]) 
  const [data, setData] = useState([])  
  const populate = (data) => {  
    var dataArray = [["Name", "Hours"]]  
    data.forEach(function(item, index) {  
        //console.log('item.hours', item.value)
        dataArray.push([item.name + ' ' +  item.sirname, item.value])  
    }) 
    setData(dataArray) 
  } 
  
  useEffect(() => {
      const res  = () => { 
          fetch('https://localhost:7186/api/home/GetTopTenUsers')
            .then((resp) => resp.json()) 
            .then((data) => populate(data)) 
          }
      res()
  }, [])  

   
   
  const color = { color: "blue" }   
  const handleBarClick = (element) => {
    console.log(`The  ${element.text} with value ${element.value} was clicked`)
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
  return (  
      <Grid container item xs={12} sm={12} md={12} lg={12} p={5} ml={5} 
            alignItems="center" justifyContent="center"   
      >  
        <Grid container item xs={12} sm={12} md={6} lg={6} 
            alignItems="center" justifyContent="center"   
        > 
            <Grid container item xs={12} sm={12} md={12} lg={12}   
                alignItems="center" justifyContent="center" 
            >  
                <Chart
                    chartType="BarChart"
                    //xlabel="People"
                    ylabel="Hours"
                    width={550}
                    height={300}
                    //margin={margin}
                    data={data}
                    color={color}
                    onBarClick={handleBarClick}
                    options={options}
                />
            </Grid>  
        </Grid>
    </Grid> 
  ) 
}

export default TopTen
