const DistrictTaluka = require("../models/DistrictTaluka");
const XLSX = require("xlsx");
const fs = require("fs");

// Upload and process Excel file
exports.uploadExcel = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
  
      console.log("Uploaded File:", req.file);
  
      const filePath = req.file.path;
      const workbook = XLSX.readFile(filePath);
  
      console.log("Workbook Read Successfully");
  
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
      console.log("Extracted Data:", data);
  
      if (!data.length) {
        return res.status(400).json({ error: "Excel file is empty or has incorrect formatting" });
      }
  
      const formattedData = data.map((row) => ({
        district: row["Dist"] || row["district"],  
        taluka: row["Taluka"] || row["taluka"],  
      }));
  
      console.log("Formatted Data:", formattedData);
  
      await DistrictTaluka.insertMany(formattedData);
      fs.unlinkSync(filePath);  
  
      res.json({ message: "File uploaded and data inserted successfully" });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ error: "Error processing file" });
    }
  };
  

// Get all districts
exports.getAllDistricts = async (req, res) => {
  try {
    const districts = await DistrictTaluka.distinct("district");
    res.json(districts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching districts" });
  }
};

// Get talukas based on selected district
exports.getTalukasByDistrict = async (req, res) => {
  try {
    const { district } = req.params;
    const talukas = await DistrictTaluka.find({ district }).select("taluka -_id");
    res.json(talukas);
  } catch (error) {
    res.status(500).json({ error: "Error fetching talukas" });
  }
};
