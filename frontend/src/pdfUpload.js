import React, { useState } from "react";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const UploadPDF = ({ setFilePath }) => {
  const [file, setFile] = useState(null);
  const [previewText, setPreviewText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  // Slide transition function
  const SlideTransition = (props) => <Slide {...props} direction="up" />;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5001/upload", formData);
      setPreviewText(response.data.textExtracted);
      setFilePath("./uploads/upload.pdf");
      setSnackbarMessage("File uploaded successfully!");
      setSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Error uploading file. Please try again.");
      setSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setUploading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="upload-container" style={{ width: "100%", maxHeight: "600px", backgroundColor: "#fff", overflow:"hidden" }}>
      <div className="inputbox" style={{ border: "2px", borderRadius: "10px", borderStyle: "dashed", borderColor: "#1a0061", opacity: "70%", backgroundColor: "#fff" }}>
        <input
          className="inputbox"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ justifyContent: "center", padding: "7rem", opacity: "0%", paddingBottom: "5rem", fontSize: "2rem", backgroundColor: "#000" }}
        />
      </div>
      <h1 className="inputtext" style={{ fontWeight: "500", marginTop: "-10rem", marginBottom: "3rem", fontSize: "1.4rem" }}>
        {file ? file.name : "Click Here to Upload the Document"}
      </h1>

      <button
        className="button"
        style={{ width: "100%", padding: "1rem", marginTop: "6rem", fontWeight: "500", fontSize: "1rem" }}
        onClick={handleFileUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {previewText && (
        <div className="preview" style={{ overflowY: "scroll",overflowX:"hidden", maxHeight:"300px" }}>
          <h3>Extracted Text (Preview):</h3>
          <p>{previewText}</p>
        </div>
      )}

      {/* Snackbar with Slide Transition */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        TransitionComponent={SlideTransition}
        anchorOrigin={{
          vertical: 'bottom',  // Position at the top
          horizontal: 'center',  // Center it horizontally
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UploadPDF;
