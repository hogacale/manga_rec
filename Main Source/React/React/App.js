import React from 'react';
import './App.css';
import Navbar from './Navbar/index';
import { BrowserRouter as Router, Routes, Route, Switch}
    from 'react-router-dom';
import SearchMangaTable from "./Search";
import filterTable from "./Filter";
import Manga_Info from './Manga_Info';
import Homepage from './Homepage';
import RecommendTable from "./Recommender";


function App() {
  return (
      <>
          <Router>
            <Navbar />
            <Routes>
                <Route exact path='/manga/:id' element={<Manga_Info/>} />
                <Route path='/' element={<Homepage/>} />
                <Route path='/search' element={<SearchMangaTable />} />
                <Route path='/filter' element={<filterTable />} />
                <Route path='/recommend' element={<RecommendTable />} />
            </Routes>
          </Router>
      </>
  );
}

export default App;
