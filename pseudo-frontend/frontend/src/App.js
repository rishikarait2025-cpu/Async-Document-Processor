import FetchDocuments from './components/FetchDocuments.js';
import FilterDocuments from './components/FilterDocuments.js';
import UploadSection from './components/UploadSection.js';

function App() {

  return (
    <div>
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



   <UploadSection/>
   <FilterDocuments/>
   <FetchDocuments/>
    </div>
    </div>
     </div>
  );
}

export default App;
