import React from 'react'

export default function Demographic({demographic, toggleDemographic}) {
    function handleDemographicClick(){
        toggleDemographic(demographic.id)
    }
  return (
    <div>
        <input type = "checkbox" checked = {demographic.checked} onChange={handleDemographicClick}/>
        {demographic.name}
    </div>
  )
}