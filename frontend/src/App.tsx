import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {lazy} from "react"


const Home = lazy(()=>import("./pages/Home"));
const Search = lazy(()=>import("./pages/Search"));
const Cart = lazy(()=>import("./pages/Cart"));

const App = () => {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search/>} />
          <Route path="/cart" element={<Cart/>} />
      </Routes>
    </Router>
  );
};

export default App;
