import React from 'react';
import MiniManga from './components/manga.js'
import {Link} from 'react-router-dom';


class MangaGenreRow extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mangas: [],
            user: sessionStorage.getItem('userId')
        }
        console.log("User is", sessionStorage.getItem('userId'));
        fetch(`http://localhost:8080/api/genre/${this.props.genre}`)
            .then((res) => res.json())
            .then((res) => {
                this.state.mangas = res
                this.setState({
                    mangas: [...this.state.mangas]
                })
            })
    }
    render(){
        const {mangas} = this.state
        let link = '/' + this.props.genre
        return(
            <>
                <div className='rowT'>
                    <h2 width = 'min-content' className='mangah2'>
                        {this.props.genre}
                    </h2>
                </div>
                <div className='rowC'>
                    {
                        mangas.map(manga =>{
                            console.log(manga)
                            return(
                                <MiniManga key = {manga.id} title={manga.title||'N/A'} pictureLink={manga.pictureLink} id = {manga.id}/>
                            )
                        })
                    }

                </div>
            </>


        );
    }
}

class MangaThemeRow extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mangas: []
        }
        fetch(`http://localhost:8080/api/theme/${this.props.theme}`)
            .then((res) => res.json())
            .then((res) => {
                this.state.mangas = res
                this.setState({
                    mangas: [...this.state.mangas]
                })
            })
    }

    render(){
        const {mangas} = this.state
        let link = '/' + this.props.theme
        return(
            <>
                <div className='rowT'>
                    <h2 width = 'min-content' className='mangah2'>
                        {this.props.theme}
                    </h2>
                </div>
                <div className='rowC'>
                    {
                        mangas.map(manga =>{
                            return(
                                <MiniManga key = {manga.id} title={manga.title||'N/A'} pictureLink={manga.pictureLink} id = {manga.id}/>
                            )
                        })
                    }

                </div>
            </>


        );
    }
}

class MangaInterestRow extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mangas: []
        }
        fetch(`http://localhost:8080/api/Interest/${sessionStorage.getItem('userId')}`)
            .then((res) => res.json())
            .then((res) => {
                this.state.mangas = res
                this.setState({
                    mangas: [...this.state.mangas]
                })
            })
    }

    render(){
        const {mangas} = this.state
        let link = '/' + this.props.theme
        return(
            <>
                <div className='rowT'>
                    <h2 width = 'min-content' className='mangah2'>
                        Interests
                    </h2>
                </div>
                <div className='rowC'>
                    {
                        mangas.map(manga =>{
                            return(
                                <MiniManga key = {manga.id} title={manga.title||'N/A'} pictureLink={manga.pictureLink} id = {manga.id}/>
                            )
                        })
                    }

                </div>
            </>


        );
    }
}

class Homepage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            genres: [{id:  0 , name: 'Adventure'},
                {id:  1 , name: 'Comedy'},
                {id:  2 , name: 'Slice of Life'},
                {id:  3 , name: 'Boys Love'},
                {id:  4 , name: 'Sci-Fi'},
                {id:  5 , name: 'Action'},
                {id:  6 , name: 'Horror'},
                {id:  7 , name: 'Suspense'},
                {id:  8 , name: 'Girls Love'},
                {id:  9 , name: 'Gourmet'},
                {id:  10 , name: 'Sports'},
                {id:  11 , name: 'Avant Garde'},
                {id:  12 , name: 'Supernatural'},
                {id:  13 , name: 'Fantasy'},
                {id:  14 , name: 'Romance'},
                {id:  15 , name: 'Ecchi'},
                {id:  16 , name: 'Drama'},
                {id:  17 , name: 'Mystery'}],

            themes: [{id:  0 , name: 'Historical'},
                {id:  1 , name: 'Time Travel'},
                {id:  2 , name: 'Visual Arts'},
                {id:  3 , name: 'Military'},
                {id:  4 , name: 'Love Polygon'},
                {id:  5 , name: 'Mecha'},
                {id:  6 , name: 'Martial Arts'},
                {id:  7 , name: 'Racing'},
                {id:  8 , name: 'Samurai'},
                {id:  9 , name: 'Strategy Game'},
                {id:  10 , name: 'CGDCT'},
                {id:  11 , name: 'Mythology'},
                {id:  12 , name: 'High Stakes Game'},
                {id:  13 , name: 'Idols (Male)'},
                {id:  14 , name: 'Reincarnation'},
                {id:  15 , name: 'Pets'},
                {id:  16 , name: 'Team Sports'},
                {id:  17 , name: 'Workplace'},
                {id:  18 , name: 'Isekai'},
                {id:  19 , name: 'Gag Humor'},
                {id:  20 , name: 'Memoir'},
                {id:  21 , name: 'Harem'},
                {id:  22 , name: 'Villainess'},
                {id:  23 , name: 'Detective'},
                {id:  24 , name: 'Performing Arts'},
                {id:  25 , name: 'Reverse Harem'},
                {id:  26 , name: 'Childcare'},
                {id:  27 , name: 'Otaku Culture'},
                {id:  28 , name: 'Mahou Shoujo'},
                {id:  29 , name: 'Anthropomorphic'},
                {id:  30 , name: 'Survival'},
                {id:  31 , name: 'Magical Sex Shift'},
                {id:  32 , name: 'Music'},
                {id:  33 , name: 'Delinquents'},
                {id:  34 , name: 'Organized Crime'},
                {id:  35 , name: 'Adult Cast'},
                {id:  36 , name: 'Medical'},
                {id:  37 , name: 'Showbiz'},
                {id:  38 , name: 'Crossdressing'},
                {id:  39 , name: 'Gore'},
                {id:  40 , name: 'Psychological'},
                {id:  41 , name: 'School'},
                {id:  42 , name: 'Combat Sports'},
                {id:  43 , name: 'Parody'},
                {id:  44 , name: 'Romantic Subtext'},
                {id:  45 , name: 'Space'},
                {id:  46 , name: 'Iyashikei'},
                {id:  47 , name: 'Video Game'},
                {id:  48 , name: 'Educational'},
                {id:  49 , name: 'Vampire'},
                {id:  50 , name: 'Super Power'}]
        }
        this.setState({
            genres: [...this.state.genres],
            themes: [...this.state.themes]
        })
    }


    render(){
        const {genres, themes} = this.state;

        return(
            <>
                <div className='mangadiv' border-style = 'hidden'>
                    <MangaInterestRow user = {sessionStorage.getItem('userId')}/>
                    {genres.map(genre=>{
                        return(
                            <MangaGenreRow key = {genre.id} genre = {genre.name}/>
                        )
                    })}
                    {themes.map(theme=>{
                        return(
                            <MangaThemeRow key = {theme.id} theme = {theme.name}/>
                        )
                    })}
                </div>
            </>
        );
    }
}

export default Homepage;