import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function UploadSection() {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
    
  const [response, setResponse] = useState(null);
    
  const uploadFile = async () => {

    if (!file) {
      alert("Please select file");
      return;
    }

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/documents");
      setDocuments(res.data);

      } catch (error) {
        console.log(error);
      }
    };   
    const formData = new FormData();

    formData.append("file", file);

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/documents/upload",
        formData
      );

      setResponse(res.data);

      fetchDocuments();

    } catch (error) {

      console.log(error);

      alert("Upload failed");
    }
  };



  return (
    <div>
      
        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "10px",
            marginBottom: "30px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
          }}
        >

          <h2>Upload Document</h2>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <br /><br />

          <button
            onClick={uploadFile}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "#2563eb",
              color: "white",
              cursor: "pointer"
            }}
          >
            Upload
          </button>

          {response && (
            <div style={{ marginTop: "20px" }}>

              <p><strong>ID:</strong> {response.id}</p>

              <p><strong>Filename:</strong> {response.filename}</p>

              <p><strong>Status:</strong> {response.status}</p>

            </div>
          )}

        </div>
    </div>
  )
}
// import React, { useState } from "react";
// import axios from "axios";

// export default function UploadSection({ fetchDocuments }) {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const uploadFile = async () => {
//     if (!file) {
//       alert("Please select a file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setLoading(true);

//       await axios.post("http://localhost:8000/upload", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       alert("Upload successful");

//       // refresh list after upload
//       if (fetchDocuments) {
//         fetchDocuments();
//       }

//       setFile(null);
//     } catch (error) {
//       console.error(error);
//       alert("Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>Upload Document</h2>

//       <input
//         type="file"
//         onChange={(e) => setFile(e.target.files[0])}
//       />

//       <button onClick={uploadFile} disabled={loading}>
//         {loading ? "Uploading..." : "Upload"}
//       </button>
//     </div>
//   );
// }