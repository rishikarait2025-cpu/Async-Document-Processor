import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [file, setFile] = useState(null);

  const [response, setResponse] = useState(null);

  const [documents, setDocuments] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [sortOrder, setSortOrder] = useState("latest");



  // LOAD DOCUMENTS
  const fetchDocuments = async () => {
    try {

      const res = await axios.get(
        "http://127.0.0.1:8000/documents"
      );

      setDocuments(res.data);

    } catch (error) {
      console.log(error);
    }
  };


  // SSE PROGRESS
  useEffect(() => {

    fetchDocuments();

    const eventSource = new EventSource(
      "http://127.0.0.1:8000/progress"
    );

    eventSource.onmessage = (event) => {

      const data = JSON.parse(event.data);

      console.log(data);

      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === data.document_id
            ? { ...doc, status: data.status }
            : doc
        )
      );
    };

    return () => {
      eventSource.close();
    };

  }, []);



  // UPLOAD FILE
  const uploadFile = async () => {

    if (!file) {
      alert("Please select file");
      return;
    }

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



  // FINALIZE
  const finalizeDocument = async (id) => {

    try {

      await axios.put(
        `http://127.0.0.1:8000/documents/${id}/finalize`
      );

      fetchDocuments();

      alert("Document finalized");

    } catch (error) {

      console.log(error);
    }
  };



  // FILTERING
  let filteredDocuments = documents.filter((doc) => {

    const matchesSearch =
      doc.filename.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : doc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });



  // SORTING
  filteredDocuments.sort((a, b) => {

    if (sortOrder === "latest") {
      return b.id - a.id;
    } else {
      return a.id - b.id;
    }
  });



  return (

    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh"
      }}
    >

      <div
        style={{
          maxWidth: "1100px",
          margin: "auto"
        }}
      >

        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px"
          }}
        >
          Async Document Processor
        </h1>



        {/* UPLOAD SECTION */}

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



        {/* FILTER SECTION */}

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px"
          }}
        >

          <input
            type="text"
            placeholder="Search filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px",
              flex: 1,
              borderRadius: "5px",
              border: "1px solid #ccc"
            }}
          />



          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px"
            }}
          >

            <option value="all">All</option>

            <option value="queued">Queued</option>

            <option value="processing">Processing</option>

            <option value="completed">Completed</option>

            <option value="failed">Failed</option>

          </select>



          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px"
            }}
          >

            <option value="latest">Latest</option>

            <option value="oldest">Oldest</option>

          </select>

        </div>



        {/* DOCUMENT LIST */}

        <div
          style={{
            display: "grid",
            gap: "20px"
          }}
        >

          {filteredDocuments.map((doc) => (

            <div
              key={doc.id}
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)"
              }}
            >

              <h3>{doc.filename}</h3>

              <p><strong>ID:</strong> {doc.id}</p>

              <p><strong>Status:</strong> {doc.status}</p>

              <p><strong>Type:</strong> {doc.file_type}</p>

              <p><strong>Size:</strong> {doc.file_size}</p>

              <p>
                <strong>Finalized:</strong>{" "}
                {doc.finalized ? "Yes" : "No"}
              </p>

              <div
                style={{
                  backgroundColor: "#f3f4f6",
                  padding: "10px",
                  borderRadius: "5px",
                  marginTop: "10px",
                  maxHeight: "150px",
                  overflowY: "auto"
                }}
              >

                <strong>Extracted Text:</strong>

                <p>
                  {doc.extracted_text || "No text extracted"}
                </p>

              </div>



              <div
                style={{
                  marginTop: "15px",
                  display: "flex",
                  gap: "10px"
                }}
              >

                <button
                  onClick={() => finalizeDocument(doc.id)}
                  style={{
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "5px",
                    backgroundColor: "green",
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  Finalize
                </button>



                <a
                  href="http://127.0.0.1:8000/documents/export/json"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button
                    style={{
                      padding: "10px 15px",
                      border: "none",
                      borderRadius: "5px",
                      backgroundColor: "#2563eb",
                      color: "white",
                      cursor: "pointer"
                    }}
                  >
                    Export JSON
                  </button>
                </a>



                <a
                  href="http://127.0.0.1:8000/documents/export/csv"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button
                    style={{
                      padding: "10px 15px",
                      border: "none",
                      borderRadius: "5px",
                      backgroundColor: "#7c3aed",
                      color: "white",
                      cursor: "pointer"
                    }}
                  >
                    Export CSV
                  </button>
                </a>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default App;