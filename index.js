const csvtojson = require("csvtojson");
const { ApolloServer } = require("apollo-server");
const { mongoURL } = require("./config");
const mongoose = require("mongoose");

const covidData = require("./models/CovidData");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/");

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`server running at ${res.url}`);
  });

mongoose.connection.collections["covidData"]
  .findOne()
  .then((doc) => {
    if (!doc) {
      dumpData();
    }
  })
  .catch((err) => {
    console.log(err);
  });

async function dumpData() {
  for (let i = 1; i <= 24; i++) {
    await csvtojson()
      .fromFile(`./CovidData/raw_data${i}.csv`)
      .then(async (data) => {
        await covidData
          .insertMany(data)
          .then(() => {
            // console.log(`inserted from raw_data${i}`);
          })
          .catch((err) => {
            console.log(err);
          });

        await covidData.updateMany(
          {},
          {
            $rename: {
              "Patient Number": "PatientNumber",
              "State Patient Number": "StatePatientNumber",
              "Date Announced": "DateAnnounced",
              "Estimated Onset Date": "EstimatedOnsetDate",
              "Age Bracket": "AgeBracket",
              "Detected City": "DetectedCity",
              "Detected District": "DetectedDistrict",
              "Detected State": "DetectedState",
              "State code": "Statecode",
              "Current Status": "CurrentStatus",
              "Contracted from which Patient (Suspected)":
                "ContractedFromWhichPatient_Suspected",
              "Type of transmission": "TypeOfTransmission",
              "Status Change Date": "StatusChangeDate",
              "Backup Notes": "BackupNotes",
              "Num Cases": "NumCases",
            },
          },
          (err) => {
            if (err) {
              console.log(err);
            } else {
              //   console.log(`updated fields on raw_data${i}`);
            }
          }
        );
      });
  }
}
