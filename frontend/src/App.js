import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a CSV file first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "https://transaction-validator-final.onrender.com/upload",
        formData
      );

      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f9",
        padding: "40px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2563eb"
          }}
        >
          Transaction Data Validation Platform
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666"
          }}
        >
          Validate, clean, and process international transaction datasets.
        </p>

        {/* Features */}
        <div
          style={{
            background: "#eef6ff",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "20px"
          }}
        >
          🌍 International Phone Validation <br />
          📅 Date & Time Validation <br />
          🧹 Automated Data Cleaning <br />
          📦 Intelligent CSV Chunking
        </div>

        {/* Validation Rules */}
        <div
          style={{
            marginTop: "15px",
            padding: "15px",
            background: "#f8fafc",
            borderRadius: "8px"
          }}
        >
          <h3>Validation Capabilities</h3>

          <p>🌍 Country-specific phone validation using configurable country codes</p>
          <p>📅 Date & time validation against predefined formats</p>
          <p>✅ Data integrity checks for required transaction fields</p>
          <p>💳 Payment mode validation</p>
          <p>📦 Automatic CSV chunking for large datasets</p>
          <p>⬇️ Downloadable cleaned output file</p>
        </div>

        {/* Upload Section */}
        <div
          style={{
            marginTop: "30px",
            padding: "30px",
            border: "2px dashed #93c5fd",
            borderRadius: "12px",
            textAlign: "center",
            background: "#f8fbff"
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>
            Upload Transaction Dataset
          </h3>

          <input
            type="file"
            id="csvUpload"
            accept=".csv"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap"
            }}
          >
            <label
              htmlFor="csvUpload"
              style={{
                background: "#2563eb",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "180px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              📂 Choose File
            </label>

            <button
              onClick={uploadFile}
              style={{
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "180px",
                height: "48px"
              }}
            >
              ⬆️ Upload CSV
            </button>
          </div>

          {file ? (
            <p
              style={{
                marginTop: "15px",
                color: "#16a34a",
                fontWeight: "bold"
              }}
            >
              ✅ Selected File: {file.name}
            </p>
          ) : (
            <p
              style={{
                marginTop: "15px",
                color: "#64748b"
              }}
            >
              Select a CSV file to begin validation
            </p>
          )}
        </div>

        {result && (
          <>
            {/* Success Banner */}
            <div
              style={{
                background: "#dcfce7",
                color: "#166534",
                padding: "15px",
                borderRadius: "8px",
                marginTop: "20px",
                fontWeight: "bold"
              }}
            >
              ✅ Validation Completed Successfully.{" "}
              {result.invalidRows} invalid records removed.
            </div>

            {/* Statistics Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(180px,1fr))",
                gap: "15px",
                marginTop: "25px"
              }}
            >
              <div className="card">
                <h2>{result.totalRows}</h2>
                <p>Total Rows</p>
              </div>

              <div className="card">
                <h2>{result.validRows}</h2>
                <p>Valid Rows</p>
              </div>

              <div className="card">
                <h2>{result.invalidRows}</h2>
                <p>Invalid Rows</p>
              </div>

              <div className="card">
                <h2>{result.chunksCreated}</h2>
                <p>Chunks Created</p>
              </div>
            </div>

            {/* Progress Bar */}
            <h3 style={{ marginTop: "30px" }}>
              Validation Score
            </h3>

            <div
              style={{
                width: "100%",
                background: "#e5e7eb",
                borderRadius: "999px",
                overflow: "hidden",
                height: "14px"
              }}
            >
              <div
                style={{
                  width: `${
                    (result.validRows / result.totalRows) * 100
                  }%`,
                  height: "100%",
                  background: "#22c55e"
                }}
              />
            </div>

            <p>
              {Math.round(
                (result.validRows / result.totalRows) * 100
              )}
              % Records Valid
            </p>

            {/* Download Button */}
            <div
              style={{
                marginTop: "20px",
                textAlign: "center"
              }}
            >
              <button
                onClick={() =>
                  window.open(
                    "https://transaction-validator-final.onrender.com/download",
                    "_blank"
                  )
                }
                style={{
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  height: "48px",
                  padding: "0 24px"
                }}
              >
                ⬇️ Download Cleaned CSV
              </button>
            </div>

            {/* Table */}
            <h2 style={{ marginTop: "30px" }}>
              Validated Records
            </h2>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px"
              }}
            >
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Date</th>
                  <th>Payment</th>
                </tr>
              </thead>

              <tbody>
                {result.data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.order_id}</td>
                    <td>{row.phone}</td>
                    <td>{row.country}</td>
                    <td>{row.date}</td>
                    <td>{row.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default App;