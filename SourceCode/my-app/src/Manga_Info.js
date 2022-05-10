import React from 'react';
import { useParams } from 'react-router-dom';
import './Style_Sheets/Manga_Info.css';


class Manga_Info extends React.Component{
    //References allow you to access html elements outside of functions called by that element
    //This example it is the <td> element for the row.
    //It is used to tell the manga hover element who its parent is(Where it should place itself)
    constructor(props){
        super(props);
        this.state = {
            popularity: null,
            title: null,
            description: null,
            releaseDate: null,
            chapterCount: null,
            status: null,
            genre: null,
            theme: null,
            demographic: null,
            pictureLink: null,
            other: 'N/A',
            interested: false,
            notinterested: false,
            dislike: false,
            neutral: false,
            like: false,
        };
        const id = this.props.params.id;
        const user = this.props.user;
        fetch(`http://localhost:8080/api/manga/${id}`)
            .then((res) => res.json())
            .then((res) => {
                let temp = res[0].pictureLink
                if(!temp){
                    temp = "http://thumbs.dreamstime.com/b/default-avatar-profile-icon-grey-photo-placeholder-102846161.jpg"
                }
                this.setState({
                    popularity: res[0].popularity,
                    title: res[0].title,
                    description: res[0].description,
                    releaseDate: res[0].releaseDate,
                    chapterCount: res[0].chapterCount,
                    status: res[0].status,
                    genre: res[0].genre,
                    theme: res[0].theme,
                    demographic: res[0].demographic,
                    pictureLink: temp,
                    id: id,
                    user: this.props.user
                });
            })

        fetch(`http://localhost:8080/api/${user}/manga/${id}`)
            .then((res) => res.json())
            .then((res) => {
                if(res[0].status!=null){


                    if(res[0].status=="interested"){
                        this.setState({
                            interested: true
                        })
                    }
                    if(res[0].status=="not interested"){
                        this.setState({
                            notinterested: true
                        })
                    }
                }
                if(res[0].rating !=null){
                    if(res[0].rating <4){
                        this.setState({
                            dislike: true
                        })
                    }else if(res[0].rating <8){
                        this.setState({
                            neutral: true
                        })
                    }else if(res[0].rating <=10){
                        this.setState({
                            like: true
                        })
                    }
                }
            })
    }
    toggleinterestChange = () => {
        if(this.state.interested){
            return;
        }
        this.setState({
            interested: true,
            notinterested: false,
            dislike: false,
            neutral: false,
            like: false
        });
        let interest = 'interested'
        fetch(`http://localhost:8080/api/${this.state.user}/manga/${this.state.id}/${interest}`,{
            method: 'POST',
        });

    }
    togglenotinterestChange = () => {
        if(this.state.notinterested){
            return;
        }
        this.setState({
            interested: false,
            notinterested: true,
            dislike: false,
            neutral: false,
            like: false
        });
        let interest = 'not interested'
        fetch(`http://localhost:8080/api/${this.state.user}/manga/${this.state.id}/${interest}`,{
            method: 'POST',
        });
    }
    toggledislike = () => {
        if(this.state.dislike){
            return;
        }
        this.setState({
            dislike: true,
            neutral: false,
            like: false,
            interested: false,
            notinterested: false
        });
        let rating = 1
        fetch(`http://localhost:8080/api/${this.state.user}/${this.state.id}/${rating}`,{
            method: 'POST',
        });
    }
    toggleneutral = () => {
        if(this.state.neutral){
            return;
        }
        this.setState({
            dislike: false,
            neutral: true,
            like: false,
            interested: false,
            notinterested: false
        });
        let rating = 6
        fetch(`http://localhost:8080/api/${this.state.user}/${this.state.id}/${rating}`,{
            method: 'POST',
        });
    }
    togglelike = () => {
        if(this.state.like){
            return;
        }
        this.setState({
            dislike: false,
            neutral: false,
            like: true,
            interested: false,
            notinterested: false
        });
        let rating = 10
        fetch(`http://localhost:8080/api/${this.state.user}/${this.state.id}/${rating}`,{
            method: 'POST',
        });
    }
    render(){
        const {title, description,
            releaseDate, chapterCount, status, genre,
            theme, demographic, pictureLink, other} = this.state;
        return(
            <>
                <div className='infodiv'>
                    <h1 className='infoh1'>{title}</h1>
                    <img className = 'infoimg' src={pictureLink} alt={pictureLink}/>
                    <div className='infodiv'>
                        <h4 className='infoh4'>Release Date: {releaseDate||other}</h4>
                        <h4 className='infoh4'>Chapters: {chapterCount||other} </h4>
                        <h4 className='infoh4'>Publishing Status: {status||other}</h4>
                    </div>
                    <body className='infobody'>{description||other}</body>
                    <div className='infodiv'>
                        <h4 className='infoh4'>Genres: {genre||other}</h4>
                        <h4 className='infoh4'>Themes: {theme||other}</h4>
                        <h4 className='infoh4'>Demographics: {demographic||other}</h4>
                    </div>
                    <div className='infodiv'>
                        <input type="checkbox" checked = {this.state.interested} onChange={this.toggleinterestChange}/> Interested
                        <input type="checkbox" checked = {this.state.notinterested} onChange={this.togglenotinterestChange}/> Not Interested
                    </div>
                    <div className='infodiv'>
                        <input type="checkbox" checked = {this.state.dislike} onChange={this.toggledislike}/> Disliked
                        <input type="checkbox" checked = {this.state.neutral} onChange={this.toggleneutral}/> Neutral
                        <input type="checkbox" checked = {this.state.like} onChange={this.togglelike}/> Liked
                    </div>
                </div>
            </>
        );
    }
}

export default (props) =>(
    <Manga_Info
        {...props}
        params={useParams()}
    />
);