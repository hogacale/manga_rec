import React from 'react'
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import {FormCheck} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

class FeedbackPopup extends React.Component {
    constructor(props) {
        super(props);
        this.onClickClose = this.onClickClose.bind(this);
        this.onClickSave = this.onClickSave.bind(this);

    }

    onClickClose(e){
        this.props.handleClose(e);
    }

    onClickSave(e){
        this.props.handleSave(e);
    }

    render() {

        return (
            <Modal show={this.props.show} onHide={this.onClickClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FeedBack
                        interest={this.props.interest}
                        handleInterest={this.props.handleInterest}
                        handleNotInterest={this.props.handleNotInterest}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.onClickClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.onClickSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

class FeedBack extends React.Component {
    constructor(props){
        super(props);
        if(this.props.interest) {
            this.state = {
                interested: true,
                notInterested: false
            };
        } else {
            this.state = {
                interested: false,
                notInterested: true
            };
        }
        if(this.props.interest == null){
            this.state = {
                interested: false,
                notInterested: false
            };
        }
        this.onInterestClick = this.onInterestClick.bind(this);
        this.onNotInterestClick = this.onNotInterestClick.bind(this);
    }

    onInterestClick(e){
        this.setState({
            interested: true,
            notInterested: false,
        });
        this.props.handleInterest();
    }

    onNotInterestClick(e) {
        this.setState({
            interested: false,
            notInterested: true,
        });
        this.props.handleNotInterest();
    }

    render() {
        return (
            <form>
                <div>
                    <FormCheck
                        label="Interested"
                        name="group1"
                        type="radio"
                        id={'feedbackInterested'}
                        checked={this.state.interested}
                        onChange={this.onInterestClick}
                        />
                    <FormCheck
                        label="Not Interested"
                        name="group1"
                        type="radio"
                        id={'feedbackNotInterested'}
                        checked={this.state.notInterested}
                        onChange={this.onNotInterestClick}
                    />
                </div>
            </form>
            // <form>
            //     <p>
            //         <input className={"form-check-input"} type={"radio"} name="interestRadio" checked={this.props.interest} onChange={this.onInterestClick}/>
            //         {' '}
            //         Interested
            //     </p>
            //     <p>
            //         <input className={"form-check-input"} type={"radio"} name="interestRadio" checked={this.props.notInterested} onChange={this.onNotInterestClick}/>
            //         {' '}
            //         Not Interested
            //     </p>
            // </form>
        );
    }
}
export default FeedbackPopup;