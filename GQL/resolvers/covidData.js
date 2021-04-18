const covidData = require("../../models/CovidData");
// const moment = require("moment"); // require

module.exports = {
  Query: {
    async getFilters() {
      try {
        let location = [];
        let gender = [];
        let age = [];
        let status = [];
        let dates = [];

        await covidData.find().distinct("DetectedState", function (err, res) {
          location = res;
        });

        await covidData.find().distinct("Gender", function (err, res) {
          gender = res;
        });

        await covidData.find().distinct("AgeBracket", function (err, res) {
          age = res.sort();
        });

        await covidData.find().distinct("CurrentStatus", function (err, res) {
          status = res;
        });

        await covidData.find().distinct("DateAnnounced", function (err, res) {
          res.map((d) => {
            if (d) {
              dates.push(d);
            }
          });
        });

        return { location, gender, age, status, dates };
      } catch (err) {
        throw new Error(err);
      }
    },

    async getData(_, { filters }) {
      try {
        let keys = filters ? Object.keys(filters) : null;
        let matches = [];
        let matchQuery;

        keys
          ? keys.map((ele) => {
              if (ele === "location") {
                matches.push({ DetectedState: filters[ele] });
              }
              if (ele === "gender") {
                matches.push({ Gender: filters[ele] });
              }
              if (ele === "age") {
                matches.push({ AgeBracket: filters[ele] });
              }
              if (ele === "status") {
                matches.push({ CurrentStatus: filters[ele] });
              }
              if (ele === "from") {
                matches.push({
                  DateAnnounced: { $gte: new Date(filters[ele]) },
                });
              } else {
                matches.push({
                  DateAnnounced: {
                    $gte: new Date("2020-01-30T00:00:00.000+00:00"),
                  },
                });
              }
              if (ele === "to") {
                matches.push({
                  DateAnnounced: { $lte: new Date(filters[ele]) },
                });
              } else {
                matches.push({
                  DateAnnounced: {
                    $lte: new Date("2021-03-26T00:00:00.000+00:00"),
                  },
                });
              }
            })
          : null;

        if (matches.length > 0) {
          matchQuery = {
            $match: {
              $and: matches,
            },
          };
        } else {
          matchQuery = {
            $match: {},
          };
        }

        let res = await covidData.aggregate([
          matchQuery,
          {
            $group: {
              _id: "$DateAnnounced",
              active: {
                $sum: {
                  $cond: [{ $eq: ["$CurrentStatus", "Hospitalized"] }, 1, 0],
                },
              },
              recovered: {
                $sum: {
                  $cond: [{ $eq: ["$CurrentStatus", "Recovered"] }, 1, 0],
                },
              },
              deceased: {
                $sum: {
                  $cond: [{ $eq: ["$CurrentStatus", "Deceased"] }, 1, 0],
                },
              },
              others: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $ne: ["$CurrentStatus", "Deceased"] },
                        { $ne: ["$CurrentStatus", "Recovered"] },
                        { $ne: ["$CurrentStatus", "Hospitalized"] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ]);

        return res;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
