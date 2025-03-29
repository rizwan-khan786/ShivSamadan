const mongoose = require("mongoose");

const DistrictTalukaSchema = new mongoose.Schema({
  district: { type: String, required: true },
  taluka: { type: String, required: true },
});

module.exports = mongoose.model("DistrictTaluka", DistrictTalukaSchema);
