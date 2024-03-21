import "./App.css"; // css local

import { Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";

// components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import InvoiceList from "./components/InvoiceList";

function App() {
  let [messageState, setmessageState] = useState("App");
  function changeStateFromChild() {
    setmessageState("Dashboard");
  }

  return (
    <div>
      <div className="header_div ">
        <Header />
      </div>
      <div className="d-flex flex-row  ">
        <div className="sidebar_div   ">
          <Sidebar />
        </div>
        <div className="content-div  ">
          <Routes>
            
            <Route path="/invoicelist" element={<InvoiceList />}></Route>
            
            
            
            <Route path="*" element={<InvoiceList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
