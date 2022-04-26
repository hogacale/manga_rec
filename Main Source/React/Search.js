import React from 'react';
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import HoverMangaInfo from "./components/HoverMangaInfo"
import PageList from './components/PageList'
import './App.css'
import FeedbackPopup from './components/FeedbackPopup'
import Button from "react-bootstrap/Button";

class MangaRow extends React.Component {
    constructor(props) {
        super(props);
        this.interest = null;
        this.myRef = React.createRef();
        this.state = {
            show: false,
            target: this.myRef,
            timeout: null,
            manga: null,
            hovering: false,
            showFeedback: false,
            interest: null,
        };
        // console.log(this.state.target.current);
        this.handleMangaImageOnMouseEnter = this.handleMangaImageOnMouseEnter.bind(this);
        this.handleMangaImageOnMouseLeave = this.handleMangaImageOnMouseLeave.bind(this);
        this.handleFeedbackModalClose = this.handleFeedbackModalClose.bind(this);
        this.handleFeedbackModalOpen = this.handleFeedbackModalOpen.bind(this);
        this.handleFeedbackModalSave = this.handleFeedbackModalSave.bind(this);
        this.handleInterested = this.handleInterested.bind(this);
        this.handleNotInterested = this.handleNotInterested.bind(this);
    }

    handleMangaImageOnMouseEnter(e) {
        e.preventDefault()
        if (!this.state.hovering) {
            const timer = setTimeout(() => {
                const id = this.props.manga.id;
                axios.get(`http://localhost:8080/api/manga/${id}`)
                    .then(res => {
                        if(this.state.hovering)
                            this.setState( {
                                manga: res.data[0],
                                show: true,
                            });
                    });
            }, 400);
            this.setState({
                hovering: true,
                timeout: timer,
            });


            // console.log("Manga State" + this.state.manga);
        }
    }

    handleMangaImageOnMouseLeave(e){
        const timeout = this.state.timeout;
        clearTimeout(this.state.timeout);
        // console.log(this.state.manga)
        setTimeout(() => {
            this.setState({
                show: false,
                hovering: false,
            });
        }, 150);
    }

    handleFeedbackModalClose(e){
        this.setState({
            showFeedback: false,
        });
    }

    handleFeedbackModalOpen(e){
        this.setState({
            showFeedback: true,
        });
    }

    handleFeedbackModalSave(e){
        console.log("Interest of manga", this.props.manga.title, "Set to ", this.interest);
        this.setState({
            showFeedback: false,
            interest: this.interest,
        });
        //  TODO add to database
    }

    handleInterested(e){
        this.interest = true;
        //  TODO update database
    }

    handleNotInterested(e){
        this.interest = false;
        //  TODO update database
    }

    render() {
        const manga = this.props.manga;
        let temp = "";
        if(!manga.pictureLink)
            temp = "http://thumbs.dreamstime.com/b/default-avatar-profile-icon-grey-photo-placeholder-102846161.jpg";
        else
            temp = manga.pictureLink.substring(1, manga.pictureLink.length - 2);
        const title = this.props.manga.title.substring(1, this.props.manga.title.length -1);
        const picture = temp;
        // console.log(picture);
        return (
            <tr>
                <td ref={this.myRef} className={""}>
                    <img src={picture} alt={picture} width="42" height="62" onMouseEnter={this.handleMangaImageOnMouseEnter} onMouseLeave={this.handleMangaImageOnMouseLeave}/>
                    <HoverMangaInfo
                        manga={this.state.manga}
                        show={this.state.show}
                        target={this.state.target}
                    />
                    {/*<p hidden={this.state.hidden}>This is some placeholder text</p>*/}
                </td>
                <td className={"text-truncate "}>
                    {title}
                </td>
                <td>
                    <Button onClick={this.handleFeedbackModalOpen}>Give feedback</Button>
                    <FeedbackPopup
                        show={this.state.showFeedback}
                        handleSave={this.handleFeedbackModalSave}
                        handleClose={this.handleFeedbackModalClose}
                        interest={this.state.interest}
                        handleInterest={this.handleInterested}
                        handleNotInterest={this.handleNotInterested}
                    />
                </td>

            </tr>
        );
    }
}

class MangaTable extends React.Component {

    render() {
        const rows = [];
        let lastCategory = null;

        if(this.props.manga !== null) {
            // let Manga = this.props.manga[0];
            this.props.manga.forEach((manga) => {
                rows.push(
                    <MangaRow
                        manga={manga}
                        key={manga.id}
                    />
                );
            });
        }
        return (
            <table className={"table table-hover mangaTable"}>
                <thead>
                <tr>
                    <th className={"imageRow"}>Image</th>
                    <th className={"titleRow"}>Title</th>
                    <th className={"feedbackRow"}>Feedback</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>

        );
    }
}

class SearchBar extends React.Component {
    constructor(props){
        super(props);
        this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
        this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    }

    handleSearchButtonClick(e) {
        e.preventDefault();
        this.props.onSearchButtonClick(e.target.value);
    }

    handleSearchTextChange(e) {
        e.preventDefault();
        this.props.onSearchTextChange(e.target.value);
    }

    render() {
        return (
            <form>
                <input type="text" placeholder="Search..." value={this.props.searchQuery} onChange={this.handleSearchTextChange}/>
                <button onClick={this.handleSearchButtonClick} value={this.props.searchQuery}>Search</button>
            </form>
        );
    }
}

class SearchMangaTable extends React.Component {
    constructor(props) {
        super(props);
        // const temp = this.getJSON("");
        // console.log(temp);
        this.state = {
            searchQuery: '',
            manga: null,
            pages: 0,
            page: 0
        };
        fetch(`http://localhost:8080/api/search?query=%%&page=0&limit=25`)
            .then((response)=>response.json())
            .then((responseJson)=>{this.setState({
                manga: responseJson[0],
                pages: Math.ceil(responseJson[1][0].numResult / 25),
            })});
        this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
        this.handleSearchQueryChange = this.handleSearchQueryChange.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    async getJSON(search,page) {
        return fetch(`http://localhost:8080/api/search?query=%${search}%&page=${page}&limit=25`)
            .then((response)=>response.json())
            .then((responseJson)=>{return responseJson});
    }

    async handlePageChange(e){
        console.log("Changing to page",e);
        const json = await this.getJSON(this.state.searchQuery,parseInt(e)+1);
        this.setState({
            manga: json[0],
            page: parseInt(e),
            pages: Math.ceil(json[1][0].numResult / 25),
        });
        // console.log("New State",this.state,"JSON",json);
    }

    //This eventually will be the search preview
    handleSearchQueryChange(searchQuery){
        console.log(searchQuery);
        this.setState({
            searchQuery: searchQuery
            //  TODO Query API
        });
    }

    async handleSearchButtonClick(searchQuery){
        this.setState({
            searchQuery: searchQuery,
            page: 0,
            pages: 0,
        });

        const json = await this.getJSON(searchQuery,0);
        console.log(json[1][0].numResult);
        this.setState({
            manga: json[0],
            pages: Math.ceil(json[1][0].numResult / 25),
        });
    }

    render() {
        return (
            <div>
                <SearchBar
                    searchQuery={this.state.searchQuery}
                    onSearchTextChange={this.handleSearchQueryChange}
                    onSearchButtonClick={this.handleSearchButtonClick}
                />
                <MangaTable
                    manga={this.state.manga}
                />
                <PageList
                    numPages={this.state.pages}
                    currentPage={this.state.page}
                    handlePageChange={this.handlePageChange}
                />
            </div>
        );
    }
}



export default SearchMangaTable