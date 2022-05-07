import React from 'react';
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

const container = document.getElementById('root');
const root = createRoot(container);
let user = 576;
// root.render(<HoverMangaInfo />);
// root.render(<SearchMangaTable />)
root.render(
    <Router >
        <Navbar />
        <Routes forceRefresh={true}>
            <Route exact path='/manga/:id' element={<Manga_Info user={user}/>} />
            <Route path='/' element={<Homepage user={user}/>} />
            <Route path='/search' element={<SearchMangaTable user={user}/>} />
            <Route path='filter' element={<FilterTable user={user}/>} />
            <Route path='recommend' element={<RecommendTable
                filters="[[1,27691],[1946,2022],[1,6477],[false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false]]"
                load={true}
                user={user}
            />} />
        </Routes>
    </Router>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
