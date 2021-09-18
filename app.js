const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
//middleware
const isAuth = require("./middleware/is-auth");
//import resolver and schema
const graphqlSchema = require("./graphql/schemas/index");
const graphqlResolver = require("./graphql/resolvers/index");

//initialize express app
const app = express();
app.use(isAuth);
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  })
);
mongoose
  .connect(
    "mongodb://127.0.0.1:27017/dev-events?directConnection=true&serverSelectionTimeoutMS=2000"
  )
  .then(app.listen(3000, () => console.log("listening on port 3000")))
  .catch((err) => console.log(err));
