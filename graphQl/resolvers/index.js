const userResolvers = require("./users");
const dataResolvers = require("./covidData");

module.exports = {
  Query: {
    ...dataResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};
