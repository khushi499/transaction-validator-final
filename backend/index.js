const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const cors = require("cors");
const { Parser } = require("json2csv");

const countryRules = require("./countryRules");

const app = express();

app.use(cors());

const upload = multer({
  dest: "uploads/"
});

// Store validated data for download
let cleanedData = [];

/* -----------------------------
   Phone Validation
----------------------------- */
function validatePhone(phone, country) {
  if (!phone || !country) return false;

  const requiredLength = countryRules[country];

  if (!requiredLength) return false;

  const digits = phone.toString().replace(/\D/g, "");

  return digits.length === requiredLength;
}

/* -----------------------------
   Date & Time Validation
   Accepted Formats:
   YYYY-MM-DD
   YYYY-MM-DD HH:mm:ss
----------------------------- */
function validateDateTime(dateTime) {
  const datePattern =
    /^\d{4}-\d{2}-\d{2}$/;

  const dateTimePattern =
    /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/;

  if (
    !datePattern.test(dateTime) &&
    !dateTimePattern.test(dateTime)
  ) {
    return false;
  }

  return !isNaN(Date.parse(dateTime));
}

/* -----------------------------
   Payment Validation
----------------------------- */
function validatePayment(payment) {
  const validPayments = [
    "UPI",
    "CARD",
    "COD",
    "NETBANKING",
    "WALLET"
  ];

  return validPayments.includes(
  payment.toString().trim().toUpperCase()
);
}

/* -----------------------------
   Data Integrity Validation
----------------------------- */
function validateRow(row) {
  return (
    row.order_id &&
    row.phone &&
    row.country &&
    row.date &&
    row.payment &&
    row.order_id.toString().trim() !== "" &&
    row.phone.toString().trim() !== "" &&
    row.country.toString().trim() !== "" &&
    row.date.toString().trim() !== "" &&
    row.payment.toString().trim() !== ""
  );
}

/* -----------------------------
   CSV Chunking
----------------------------- */
function chunkArray(array, size) {
  const chunks = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
}

/* -----------------------------
   Home Route
----------------------------- */
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

/* -----------------------------
   Upload Route
----------------------------- */
app.post("/upload", upload.single("file"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      error: "No file uploaded"
    });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))

    .on("end", () => {

      const validRows = [];
      const invalidRows = [];

      results.forEach((row) => {

        if (
          validateRow(row) &&
          validatePhone(row.phone, row.country) &&
          validateDateTime(row.date) &&
          validatePayment(row.payment)
        ) {
          validRows.push(row);
        } else {
          invalidRows.push(row);
        }

      });

      // Save cleaned rows
      cleanedData = validRows;

      // Split into chunks
      const chunks = chunkArray(validRows, 100);

      res.json({
        totalRows: results.length,
        validRows: validRows.length,
        invalidRows: invalidRows.length,
        chunksCreated: chunks.length,
        data: validRows
      });

    })

    .on("error", (err) => {
      console.error(err);

      res.status(500).json({
        error: "CSV processing failed"
      });
    });

});

/* -----------------------------
   Download Cleaned CSV
----------------------------- */
app.get("/download", (req, res) => {

  try {

    if (cleanedData.length === 0) {
      return res
        .status(400)
        .send("No validated data available");
    }

    const parser = new Parser();
    const csvData = parser.parse(cleanedData);

    res.header("Content-Type", "text/csv");
    res.attachment("cleaned_data.csv");

    return res.send(csvData);

  } catch (error) {

    console.error(error);

    res.status(500).send(
      "Error generating CSV"
    );

  }

});

/* -----------------------------
   Start Server
----------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});