// import React, {useState, useEffect} from 'react'
// import axios from 'axios'

// export default function FilterDocuments() {
//     const [search, setSearch] = useState("");
//     const [statusFilter, setStatusFilter] = useState("all");
//     const [documents, setDocuments] = useState([]);
//     const [sortOrder, setSortOrder] = useState("latest");
    
//     const fetchDocuments = async () => {
//     try {
//         const res = await axios.get("http://127.0.0.1:8000/documents");
//         setDocuments(res.data);

//         } catch (error) {
//         console.log(error);
//         }
//     };    
    
//     useEffect(() => {

//         fetchDocuments();

//         const eventSource = new EventSource(
//         "http://127.0.0.1:8000/progress"
//         );

//         eventSource.onmessage = (event) => {

//         const data = JSON.parse(event.data);

//         console.log(data);

//         setDocuments((prevDocs) =>
//             prevDocs.map((doc) =>
//             doc.id === data.document_id
//                 ? { ...doc, status: data.status }
//                 : doc
//             )
//         );
//         };

//         return () => {
//         eventSource.close();
//         };

//     }, []);

//     filteredDocuments.sort((a, b) => {

//     if (sortOrder === "latest") {
//       return b.id - a.id;
//     } else {
//       return a.id - b.id;
//     }
//     });

//     let filteredDocuments = documents.filter((doc) => {

//     const matchesSearch =
//       doc.filename.toLowerCase().includes(search.toLowerCase());

//     const matchesStatus =
//       statusFilter === "all"
//         ? true
//         : doc.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <div>      
//         <div
//           style={{
//             display: "flex",
//             gap: "15px",
//             marginBottom: "20px"
//           }}
//         >

//           <input
//             type="text"
//             placeholder="Search filename..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             style={{
//               padding: "10px",
//               flex: 1,
//               borderRadius: "5px",
//               border: "1px solid #ccc"
//             }}
//           />



//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             style={{
//               padding: "10px",
//               borderRadius: "5px"
//             }}
//           >

//             <option value="all">All</option>

//             <option value="queued">Queued</option>

//             <option value="processing">Processing</option>

//             <option value="completed">Completed</option>

//             <option value="failed">Failed</option>

//           </select>



//           <select
//             value={sortOrder}
//             onChange={(e) => setSortOrder(e.target.value)}
//             style={{
//               padding: "10px",
//               borderRadius: "5px"
//             }}
//           >

//             <option value="latest">Latest</option>

//             <option value="oldest">Oldest</option>

//           </select>

//         </div>
//     </div>
//   )
// }
//pseudo-
import React from "react";

export default function FilterDocuments({
  documents = [],
  search,
  statusFilter,
}) {
  // ✅ MUST be defined BEFORE return
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name?.toLowerCase().includes(search?.toLowerCase() || "");

    const matchesStatus =
      statusFilter === "all" || doc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <h2>Documents</h2>

      {filteredDocuments.length === 0 ? (
        <p>No documents found</p>
      ) : (
        <ul>
          {filteredDocuments.map((doc) => (
            <li key={doc.id}>
              {doc.name} - {doc.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}