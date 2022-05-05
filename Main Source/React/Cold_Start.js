import React from 'react';
import GenreList from './components/genreList';
import ThemeList from './components/themeList';
import DemographicList from './components/demographicList';

  export default function Cold_Start() {
      const [genres, setGenres] = React.useState([
      {id:  0 , name: 'Adventure', interested: false}, 
      {id:  1 , name: 'Comedy', interested: false}, 
      {id:  2 , name: 'Slice of Life', interested: false}, 
      {id:  3 , name: 'Boys Love', interested: false}, 
      {id:  4 , name: 'Sci-Fi', interested: false}, 
      {id:  5 , name: 'Action', interested: false}, 
      {id:  6 , name: 'Horror', interested: false}, 
      {id:  7 , name: 'Suspense', interested: false}, 
      {id:  8 , name: 'Girls Love', interested: false}, 
      {id:  9 , name: 'Gourmet', interested: false}, 
      {id:  10 , name: 'Sports', interested: false}, 
      {id:  11 , name: 'Avant Garde', interested: false}, 
      {id:  12 , name: 'Supernatural', interested: false}, 
      {id:  13 , name: 'Fantasy', interested: false}, 
      {id:  14 , name: 'Romance', interested: false}, 
      {id:  15 , name: 'Ecchi', interested: false}, 
      {id:  16 , name: 'Drama', interested: false}, 
      {id:  17 , name: 'Mystery', interested: false}  
      ])

      const [themes, setThemes] = React.useState([
        {id:  0 , name: 'Historical', interested: false}, 
        {id:  1 , name: 'Time Travel', interested: false}, 
{id:  2 , name: 'Visual Arts', interested: false}, 
{id:  3 , name: 'Military', interested: false}, 
{id:  4 , name: 'Love Polygon', interested: false}, 
{id:  5 , name: 'Mecha', interested: false}, 
{id:  6 , name: 'Martial Arts', interested: false}, 
{id:  7 , name: 'Racing', interested: false}, 
{id:  8 , name: 'Samurai', interested: false}, 
{id:  9 , name: 'Strategy Game', interested: false}, 
{id:  10 , name: 'CGDCT', interested: false}, 
{id:  11 , name: 'Mythology', interested: false}, 
{id:  12 , name: 'High Stakes Game', interested: false}, 
{id:  13 , name: 'Idols (Male)', interested: false}, 
{id:  14 , name: 'Reincarnation', interested: false}, 
{id:  15 , name: 'Pets', interested: false}, 
{id:  16 , name: 'Team Sports', interested: false}, 
{id:  17 , name: 'Workplace', interested: false}, 
{id:  18 , name: 'Isekai', interested: false}, 
{id:  19 , name: 'Gag Humor', interested: false}, 
{id:  20 , name: 'Memoir', interested: false}, 
{id:  21 , name: 'Harem', interested: false}, 
{id:  22 , name: 'Villainess', interested: false}, 
{id:  23 , name: 'Detective', interested: false}, 
{id:  24 , name: 'Performing Arts', interested: false}, 
{id:  25 , name: 'Reverse Harem', interested: false}, 
{id:  26 , name: 'Childcare', interested: false}, 
{id:  27 , name: 'Otaku Culture', interested: false}, 
{id:  28 , name: 'Mahou Shoujo', interested: false}, 
{id:  29 , name: 'Anthropomorphic', interested: false}, 
{id:  30 , name: 'Survival', interested: false}, 
{id:  31 , name: 'Magical Sex Shift', interested: false}, 
{id:  32 , name: 'Music', interested: false}, 
{id:  33 , name: 'Delinquents', interested: false}, 
{id:  34 , name: 'Organized Crime', interested: false}, 
{id:  35 , name: 'Adult Cast', interested: false}, 
{id:  36 , name: 'Medical', interested: false}, 
{id:  37 , name: 'Showbiz', interested: false}, 
{id:  38 , name: 'Crossdressing', interested: false}, 
{id:  39 , name: 'Gore', interested: false}, 
{id:  40 , name: 'Psychological', interested: false}, 
{id:  41 , name: 'School', interested: false}, 
{id:  42 , name: 'Combat Sports', interested: false}, 
{id:  43 , name: 'Parody', interested: false}, 
{id:  44 , name: 'Romantic Subtext', interested: false}, 
{id:  45 , name: 'Space', interested: false}, 
{id:  46 , name: 'Iyashikei', interested: false}, 
{id:  47 , name: 'Video Game', interested: false}, 
{id:  48 , name: 'Educational', interested: false}, 
{id:  49 , name: 'Vampire', interested: false}, 
{id:  50 , name: 'Super Power', interested: false}
])

const [demographics, setDemographics] = React.useState([
{id:  0 , name: 'Kids', interested: false}, 
{id:  1 , name: 'Seinen', interested: false}, 
{id:  2 , name: 'Shoujo', interested: false}, 
{id:  3 , name: 'Josei', interested: false}, 
{id:  4 , name: 'Shounen', interested: false}
])

      function toggleGenre(id){
        const newGenres = [...genres]
        const genre = newGenres.find (genre => genre.id===id)
        genre.interested = !genre.interested
        setGenres(newGenres)
      }

      function toggleTheme(id){
        const newThemes = [...themes]
        const theme = newThemes.find (theme => theme.id===id)
        theme.interested = !theme.interested
        setThemes(newThemes)
      }

      function toggleDemographic(id){
        const newDemographics = [...demographics]
        const demographic = newDemographics.find (demographic => demographic.id===id)
        demographic.interested = !demographic.interested
        setDemographics(newDemographics)
      }
    return(
        <>
        <div>
            What genres intrest you?
            <GenreList genres = {genres} toggleGenre = {toggleGenre}/>
        </div>
        <div>
        What themes intrest you?
        <ThemeList themes = {themes} toggleTheme = {toggleTheme}/>
        </div>
        <div>
        What demographics intrest you?
        <DemographicList demographics = {demographics} toggleDemographic = {toggleDemographic}/>
        </div>
        </>
    );
}