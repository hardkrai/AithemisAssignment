import React, { useState } from "react";
import "./App.css";
import UploadPDF from "./pdfUpload";
import QueryPDF from "./QueryPDF";

const App = () => {
  const [filePath, setFilePath] = useState("");
  // const [filePath, setFilePath] = useState(null);

  return (
    <div className="app">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"5px"}}>
      
      <h3 style={{fontWeight: "400", color:"white", textAlign:"left", paddingRight: "2rem", marginTop:"-11px"}}>Chat and Learn <br/>from your Documents</h3>
      <h1 style={{fontWeight: "400", color:"white", textAlign:"right", paddingLeft: "2rem", marginTop:"-5px"}}>DoQuery</h1>
      </div>
      
      <div style={{display: "flex", justifyContent:"center", alignItems:"center", marginTop:"auto", marginBottom:"auto", maxHeight: "100%" }}>
      <UploadPDF setFilePath={setFilePath} />
      {filePath && <QueryPDF filePath={filePath} />}
      </div>
     
    </div>
  );
};

export default App;
