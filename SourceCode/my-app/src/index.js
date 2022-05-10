import React, {useState} from 'react';
import './index.css';
import {createRoot} from "react-dom/client";
import App from './App'
// import SearchMangaTable from "./App";
import Navbar from "./Navbar/index";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import FilterTable from "./Filter";
import SearchMangaTable from "./Search";
import RecommendTable from './Recommender'
import Manga_Info from "./Manga_Info";
import Homepage from "./Homepage";
import MAL_UserInputForm from "./MAL_User_Cold_Start";
import LoginForm from "./Login";
import RegisterForm from "./Register";

const container = document.getElementById('root');
const root = createRoot(container);
if(sessionStorage.getItem("LoggedIn") === false){
    sessionStorage.setItem('userId', 0);
}
function setUserId(id) {
    console.log("Id changing",id)
    sessionStorage.setItem('userId', id);
    sessionStorage.setItem('loggedIn', true);
}

// root.render(<HoverMangaInfo />);
// root.render(<SearchMangaTable />)

    root.render(
        <Router>
            <Navbar/>
            <Routes forceRefresh={true}>
                <Route path="/login" element={<LoginForm user={sessionStorage.getItem('userId')} setUser={setUserId}/>}/>
                <Route path="/register" element={<RegisterForm user={sessionStorage.getItem('userId')} setUser={setUserId}/>}/>
                <Route exact path='/manga/:id' element={<Manga_Info user={sessionStorage.getItem('userId')}/>}/>
                <Route path='/' element={<Homepage user={sessionStorage.getItem('userId')}/>}/>
                <Route path='/search' element={<SearchMangaTable user={sessionStorage.getItem('userId')}/>}/>
                <Route path='filter' element={<FilterTable user={sessionStorage.getItem('userId')}/>}/>
                <Route path='recommend' element={<RecommendTable
                    filters="[[1,27691],[1946,2022],[1,6477],[false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false]]"
                    load={true}
                    user={sessionStorage.getItem('userId')}
                />}/>
                <Route path='/user/MAL/cold-start' element={<MAL_UserInputForm user={sessionStorage.getItem('userId')}/>}/>
            </Routes>
        </Router>
    )

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
