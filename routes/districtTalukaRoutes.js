const express = require("express");
const multer = require("multer");
const { uploadExcel, getAllDistricts, getTalukasByDistrict } = require("../controllers/districtTalukaController");

const router = express.Router();
const upload = multer({
    dest: "uploads/",
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(xls|xlsx)$/)) {
        return cb(new Error("Only Excel files are allowed"), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  });
  
router.post("/upload", upload.single("file"), uploadExcel);
router.get("/districts", getAllDistricts);
router.get("/talukas/:district", getTalukasByDistrict);

module.exports = router;
