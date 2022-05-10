import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from "axios";


class MAL_UserInputForm extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            malUsername: "",
        }
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
    }

    onFormSubmit(e) {
        const article = {
            username: this.state.malUsername,
            userId: sessionStorage.getItem('userId'),
        }
        console.log(article);
        axios.post('http://localhost:8080/api/user/mal-cold-start', article)
            .then(() => console.log("Account",this.state.malUsername,"added"));
    }



    onValueChange(e){
        this.setState({
            malUsername: e.target.value,
        });
    }

    render() {
        return (
            <Form>
                <Form.Group width="33%" className="mb-3" controlId="formMALUsername">
                    <Form.Label>MAL userName</Form.Label>
                    <Form.Control type="username" placeholder="MAL Username" value={this.state.malUsername} onChange={this.onValueChange}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formMALSubmit">
                    <Button variant="primary" onClick={this.onFormSubmit}>
                        Add Account
                    </Button>
                </Form.Group>
            </Form>
        )}
}

export default MAL_UserInputForm;
