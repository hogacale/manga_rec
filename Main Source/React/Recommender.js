import React from "react";
import axios from 'axios';
import HoverMangaInfo from "./components/HoverMangaInfo";
import Button from "react-bootstrap/Button";
import FeedbackPopup from "./components/FeedbackPopup";
import FilterTable from "./Filter";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

class RecommendTable extends React.Component {
    constructor(props) {
        super(props);
        // const temp = this.getJSON("");
        // console.log(temp);
        this.state = {
            showFilter: true,
            manga: null,
        };
        //This fetch calls the intial api call
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let article;
        if (urlParams.has('filters')) {
            console.log("URL params", urlParams.get('filters').toString());
            article = {
                userId: 10,
                filters: urlParams.get('filters'),
            };
            console.log("article", article)
        }
        else {
            article = {
                userId: 576,
                filters: this.props.filters,
            };
            console.log("article", article)
        }
        axios.post('http://localhost:8080/api/manga/recommend', article)
            .then(response => this.setState({
                manga: response.data,
            }));
    }

    render() {
            return (
                <div>
                    <MangaTable
                        manga={this.state.manga}
                    />
                </div>
        );
    }
}

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
            temp = manga.pictureLink;
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
                            {manga.title}
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
        console.log("inside manga", this.props.manga);
        if(this.props.manga) {
            // let Manga = this.props.manga[0];
            //Sets each row to the MangaRow html
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

export default RecommendTable;