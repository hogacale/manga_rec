import React from 'react'
import Demographic from './demographic'

export default function ({demographics, toggleDemographic}) {
  return (
    demographics.map(demographic =>{
        return <Demographic key = {demographic.id} toggleDemographic={toggleDemographic} demographic={demographic} />
    })
  )
}