import React from 'react'
import Genre from './genre'

export default function ({genres, toggleGenre}) {
  return (
    genres.map(genre =>{
        return <Genre key = {genre.id} toggleGenre={toggleGenre} genre={genre} />
    })
  )
}