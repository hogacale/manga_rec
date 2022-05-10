import React from 'react';
// import "https://use.fontawesome.com/releases/v5.7.1/css/all.css";
import "./Style_Sheets/login.css";
import axios from 'axios';
import Link from 'react-bootstrap'

export default class LoginForm extends React.Component {
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
        if(e.target.id === 'username'){
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
            <div class="login">
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css"/>
                <h1>Login</h1>
                <form method="post">
                    <label for="username">
                        <i class="fas fa-user"></i>
                    </label>
                    <input type="text" onChange={this.textChange} name="username" placeholder="Username" id="username" value={this.state.username}required/>
                        <label for="password">
                            <i class="fas fa-lock"></i>
                        </label>
                        <input value={this.state.password} onChange={this.textChange} type="password" name="password" placeholder="Password" id="password" required/>
                            <input type="button" value="Login" onClick={this.onLogin}/>
                </form>
                <a href="/register" >New? Click here to Register</a>
            </div>
        );
    }
}
