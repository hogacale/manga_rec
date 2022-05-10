import React from 'react';
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import HoverMangaInfo from "./components/HoverMangaInfo"
import PageList from './components/PageList'
import './App.css'
import FeedbackPopup from './components/FeedbackPopup'
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";

/*
Hierarchy of this page

- SearchMangaTable
    - SearchBar
    - MangaTable
        - MangaRow

In react you create components which can/will house other components.
These components are the building blocks of react.
In this example SearchMangaTable is the common parent for all the tables.
It will house all the common elements and variables used needed by multiple components.
For example it holds the manga to be displayed, which page the table is on, and the searchQuery(this one might not be necessary).
NOTE:
    When you call a react component you call it as a html tag EX. <SearchBar />
    You pass parameters to these components by adding it as a html property
        Ex. <SearchBar
             searchQuery={this.state.searchQuery}
             onSearchTextChange={this.handleSearchQueryChange}
             onSearchButtonClick={this.handleSearchButtonClick}/>
       In this example the variable search query is set to the state variable searchQuery
       onSearchTextChange is set to the function(needs to be .bind(ed)) on SearchTextChange to handleSearchQuery inside of parent object.
       You access these parameters using the this.props.<Parameter name>
NOTE 2:
When state get updated it updates everything related to that state(Reruns the code) and "refreshes" the page
                This refresh is not actually a full page refresh
 */

//This is the component for each row in the search table
class MangaRow extends React.Component {
    constructor(props) {
        super(props);
        this.interest = null;
        //References allow you to access html elements outside of functions called by that element
        //This example it is the <td> element for the row.
        //It is used to tell the manga hover element who its parent is(Where it should place itself)
        this.myRef = React.createRef();
        this.state = {
            //Used to determine if the overlay will be shown
            show: false,
            target: this.myRef,
            //Timeout function(Set onHover)
            timeout: null,
            manga: null,
            hovering: false,
            showFeedback: false,
            interest: null,
        };
        // console.log(this.state.target.current);
        //These lines bind the functions to the object, allowing them to be called by html elements
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
        //Sets show to true and sets the manga to be shown after a time of 400ms
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
        //Stops the timer, so that the overlay does not show
        clearTimeout(this.state.timeout);
        // console.log(this.state.manga)
        //If the overlay is showing hides it(set show to false)
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
        fetch(`http://localhost:8080/api/user/interest/${sessionStorage.getItem('userId')}/${this.props.manga.id}`)
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                if(res !== 'empty')
                    this.setState({
                        showFeedback: true,
                        interest: res,
                    })
                else
                    this.setState({
                        showFeedback: true,
                    })
            })
    }

    handleFeedbackModalSave(e) {
        console.log("Interest of manga", this.props.manga.title, "Set to ", this.interest);
        this.setState({
            showFeedback: false,
            interest: this.interest,
        });
        let interestedString;
        if(this.interest) {
            interestedString = 'interested';
        } else {
            interestedString = 'not interested'
        }
        const article = {
            userId: sessionStorage.getItem('userId'),
            mangaId: this.props.manga.id,
            interest: interestedString,
        }
        axios.post('http://localhost:8080/api/manga/interest', article)
            .then(() => console.log("User added interest"));
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
            temp = manga.pictureLink;
        const title = this.props.manga.title;
        const picture = temp;
        // console.log(picture);
        return (
            <tr>
                {/*ref={} sets a reference object to this html element*/}
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
                        <Link to={`/manga/${manga.id}`}>
                        {title}
                        </Link>
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

//This component is the Table which holds the manga rows
class MangaTable extends React.Component {

    render() {
        //This will be set to the html for the table
        const rows = [];
        let lastCategory = null;

        if(this.props.manga !== null) {
            // let Manga = this.props.manga[0];
            //Sets each row to the MangaRow html
            this.props.manga.forEach((manga) => {
                rows.push(
                    <MangaRow
                        manga={manga}
                        key={manga.id}
                        user={sessionStorage.getItem('userId')}
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

//This is the actual search bar element
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
    //The value of the <input> is a state.
    //This means that in order for it to work it must change with the onChange function
    render() {
        return (
            <form>
                <input type="text" placeholder="Search..." value={this.props.searchQuery} onChange={this.handleSearchTextChange}/>
                <button onClick={this.handleSearchButtonClick} value={this.props.searchQuery}>Search</button>
            </form>
        );
    }
}

//This is the parent component which houses global functions and variables
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
        //This fetch calls the intial api call
        const article ={
            page: 1,
            limit: 25,
            query: '%%',
        }
        axios.post('http://localhost:8080/api/search', article)
            .then(response => this.setState({
                manga: response.data[0],
                pages: Math.ceil(response.data[1][0].numResult / 25),
            }));

        this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
        this.handleSearchQueryChange = this.handleSearchQueryChange.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    async getJSON(search,page) {
        const article ={
            page: page,
            limit: 25,
            query: '%' + search + '%',
        }
        axios.post('http://localhost:8080/api/search', article)
            .then(response => this.setState({
                manga: response.data[0],
                pages: Math.ceil(response.data[1][0].numResult / 25),
            }));
    }

    async handlePageChange(e){
        console.log("Changing to page",e);
        // This is probably unecessary as the .then does the wait itself.
        //Though since it works I don't want to change it
        const article ={
            page: parseInt(e)+1,
            limit: 25,
            query: '%' + this.state.searchQuery + '%',
        }
        axios.post('http://localhost:8080/api/search', article)
            .then(response => this.setState({
                page: parseInt(e),
                manga: response.data[0],
                pages: Math.ceil(response.data[1][0].numResult / 25),
            }));
        // console.log("New State",this.state,"JSON",json);
    }

    //This eventually will be the search preview
    handleSearchQueryChange(searchQuery){
        // console.log(searchQuery);
        this.setState({
            searchQuery: searchQuery
        });
    }

    async handleSearchButtonClick(searchQuery){
        this.setState({
            searchQuery: searchQuery,
            page: 0,
            pages: 0,
        });

        const article ={
            page: 1,
            limit: 25,
            query: '%' + searchQuery + '%',
        }
        //Sends a post request to the API I used a post request to that it does not have the %20 that the GET gave
        axios.post('http://localhost:8080/api/search', article)
            .then(response => this.setState({
                manga: response.data[0],
                pages: Math.ceil(response.data[1][0].numResult / 25),
            }));
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
                    user={sessionStorage.getItem('userId')}
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