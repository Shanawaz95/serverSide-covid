const { model, Schema } = require("mongoose");
const { collection } = require("./User");

const covidSchema = new Schema(
  {
    "Patient Number": Number,
    "State Patient Number": String,
    "Date Announced": Date,
    "Estimated Onset Date": Date,
    "Age Bracket": String,
    Gender: String,
    "Detected City": String,
    "Detected District": String,
    "Detected State": String,
    "State code": String,
    "Current Status": String,
    Notes: String,
    "Contracted from which Patient (Suspected)": String,
    Nationality: String,
    "Type of transmission": String,
    "Status Change Date": Date,
    Source_1: String,
    Source_2: String,
    Source_3: String,
    "Backup Notes": String,
    "Num Cases": Number,
  },
  { collection: "covidData" }
);

module.exports = model("covidData", covidSchema);
