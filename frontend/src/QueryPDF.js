import React, { useState } from "react";
import axios from "axios";

const QueryPDF = ({ filePath }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuerySubmit = async () => {
    if (!filePath) {
      alert("Please upload a file first.");
      return;
    }

    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5001/query", {
        filePath,
        question,
      });

      // Step 1: Remove asterisks and turn text inside them bold
      const boldAnswer = response.data.answer.replace(/\*(.*?)\*/g, '<b>$1</b>');

      // Step 2: Replace line breaks with <br /> to preserve the formatting
      const formattedAnswer = boldAnswer.replace(/\n/g, '<br />');

      setAnswer(formattedAnswer);  // Set the formatted answer
    } catch (error) {
      console.error("Error querying the document:", error);
      alert("Error querying the document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="query-container" style={{ width: "100%", justifyContent: "center", alignContent:"center", maxHeight:"600px", overflow:"hidden", marginLeft:"-1rem", backgroundColor:"#fff"}}>
      <h2 style={{
        fontWeight:"500",
        marginTop:"-2px"
      }}>Query the Document</h2>
      <input
        type="text"
        placeholder="Ask Questions from Your PDF"
        value={question}
        className="querybox"
        onChange={(e) => setQuestion(e.target.value)}
        style={{
          borderRadius:"10px",
          borderWidth: "2px",
          padding: "1rem",
          fontSize:"0.8rem",
          fontWeight: "400",
        }}
      />
      <button onClick={handleQuerySubmit} disabled={loading} style={{width: "100%", fontSize:"1rem", fontWeight:"500", padding:"1rem", marginTop:"-3px"}} className="button">
        {loading ? "Fetching answer..." : "Submit"}
      </button>
      {answer && (
        <div className="answer" style={{maxHeight:"400px", overflow:"scroll", marginTop:"-0.5rem"}}>
          <h3>Answer:</h3>
          <p dangerouslySetInnerHTML={{ __html: answer }} style={{textAlign: "justify"}}></p> {/* Render the HTML content */}
        </div>
      )}
    </div>
  );
};

export default QueryPDF;
