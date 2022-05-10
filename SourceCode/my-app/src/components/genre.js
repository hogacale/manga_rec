import React from 'react'

export default function Genre({genre, toggleGenre}) {
    function handleGenreClick(){
        toggleGenre(genre.id)
    }
  return (
    <div>
        <input type = "checkbox" checked = {genre.checked} onChange={handleGenreClick}/>
        {genre.name}
    </div>
  )
}