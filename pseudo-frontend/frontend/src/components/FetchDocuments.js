//pseudo-
import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function FetchDocuments() {
  const [documents, setDocuments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  
  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/documents");
      setDocuments(res.data);

      } catch (error) {
        console.log(error);
      }
    };    

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

let filteredDocuments = documents.filter((doc) => {

    const matchesSearch =
      doc.filename.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : doc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (

    <div>
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
  )
}
