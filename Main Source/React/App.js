import React from 'react';
import './App.css';
import Navbar from './Navbar/index';
import { BrowserRouter as Router, Routes, Route}
  from 'react-router-dom';
import SearchMangaTable from "./Search";
import filterTable from "./Filter";

function App() {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<SearchMangaTable />} />
          <Route path='/filter' element={<filterTable />} />
        </Routes>
      </Router>
  );
}

export default App;
