import React from "react";
import {Link} from 'react-router-dom';
import './SS/Mini_Manga.css'

class Manga extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            pictureLink: this.props.pictureLink,
            title: this.props.title,
            id: this.props.id
        }
    }
    render(){
        const {pictureLink, title, id} = this.state;
        let link = '/manga/'+id;
        console.log(link);
        return(
            <>
                <div className="mangathumb" width = '160px'>
                    <img className = "mangaimg" src={pictureLink||"http://thumbs.dreamstime.com/b/default-avatar-profile-icon-grey-photo-placeholder-102846161.jpg"} alt={"Image failed to load"}/>
                    <h4 className="mangah4"><Link to = {link} >{title}</Link></h4>
                </div>

            </>
        )
    }
}

export default Manga;