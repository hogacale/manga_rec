import React from 'react';
// import "https://use.fontawesome.com/releases/v5.7.1/css/all.css";
import "./Style_Sheets/login.css";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'react-bootstrap'

export default class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            userId: 0,
        }
        this.onLogin = this.onLogin.bind(this);
        this.textChange = this.textChange.bind(this);
    }

    onLogin(e){
        const article = {
            username: this.state.username,
            password: this.state.password,
        }
        axios.post('http://localhost:8080/auth',article)
            .then((response) => {
                this.setState({
                userId: response.data,
            });
                console.log("User with id", this.state.userId, "logged in");
                if(response.data < 0){
                    alert("Incorrect Username and/or Password!");
                    return;
                } else {
                    this.props.setUser(response.data);
                    console.log("Changed id", this.props.user);
                    window.location.replace("http://localhost:3000/");
                }
            });
    }

    textChange(e){
        if(e.target.id === 'name'){
            this.setState({
                username: e.target.value,
            });
        } else if (e.target.id === 'password') {
            this.setState({
                password: e.target.value,
            });
        }
    }

    render() {
        return(
            <div className="login">
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css"/>
                <h1>Register</h1>
                <form >
                    <div className="form-group">
                        <label htmlFor="name">
                            <i className="fas fa-user"></i>
                        </label>
                        <input type="name" name="name" className="form-control" id="name"
                               placeholder="Enter username" onChange={this.textChange} value={this.state.username}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">
                            <i className="fas fa-lock"></i>
                        </label>
                        <input type="password" name="password" className="form-control" id="password"
                               placeholder="*********" value={this.state.password} onChange={this.textChange}/>
                    </div>
                    <input type="Button" onClick={this.onLogin} className="btn btn-primary" value="Add"/>
                        <a href="/login" className="btn btn-success ml-2">Login</a>
                </form>
            </div>
        );
    }
}
