import React from 'react';
import './index.css';
import {createRoot} from "react-dom/client";
import App from './App'
// import SearchMangaTable from "./App";
import Navbar from "./Navbar/index";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import FilterTable from "./Filter";
import SearchMangaTable from "./Search";

const container = document.getElementById('root');
const root = createRoot(container);
// root.render(<HoverMangaInfo />);
// root.render(<SearchMangaTable />)
root.render(
    <Router>
        <Navbar />
        <Routes>
            <Route path='/' element={<SearchMangaTable />} />
            <Route path='filter' element={<FilterTable />} />
        </Routes>
    </Router>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
