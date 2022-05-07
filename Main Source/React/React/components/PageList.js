import React from 'react'
import {ButtonGroup, ButtonToolbar} from "react-bootstrap";
import Button from 'react-bootstrap/Button'

class PageList extends React.Component{
    constructor(props) {
        super(props);
        this.onNewPageClick = this.onNewPageClick.bind(this);
        // this.onNextPageClick = this.onNextPageClick(this);
        // this.onPrevPageClick = this.onPrevPageClick(this);
        console.log("Current page",this.props.currentPage,"Total Pages",this.props.numPages)
    }

    onNewPageClick(e){
        this.props.handlePageChange(e.target.value);
    }

    render() {
        let rows = [];
        rows.push();
        let displayPage = this.props.currentPage;
        if(displayPage < 5){
            displayPage = 3
        }
        for (let i = displayPage; i <= displayPage + 2; i++) {
            if (!(i >= this.props.numPages)) {
            rows.push(
                <Button key={i} value={i} onClick={this.onNewPageClick} size="sm">{i}</Button>
            )
            }
        }
        // console.log(this.props.currentPage);

        return (
            <ButtonToolbar>
                <ButtonGroup className="me-2">
                    {this.props.currentPage >= 1 &&
                        <Button key={"Prev"} onClick={this.onNewPageClick} value={this.props.currentPage - 1} size="sm">&#60;&#60;</Button>
                    }
                </ButtonGroup>
                <ButtonGroup className="me-2">
                    <Button key={1} value={0} onClick={this.onNewPageClick} size="sm">1</Button>
                    {/*This is a conditional you can put inside the html, Hide certain page buttons depending on pages and current page*/}
                    {this.props.numPages > 1 &&
                        <Button key={2} value={1} onClick={this.onNewPageClick} size="sm">2</Button>
                    }
                    {this.props.currentPage > 4 &&
                        <p className="ms-2 me-2">...</p>
                    }
                    {rows}
                </ButtonGroup>
                <ButtonGroup className="me-2">
                    {!(this.props.numPages-1 === this.props.currentPage) &&
                        <Button key={"Next"} onClick={this.onNewPageClick} value={this.props.currentPage + 1} size="sm">&#62;&#62;</Button>
                    }
                </ButtonGroup>
            </ButtonToolbar>
        );
    }
}

export default PageList;