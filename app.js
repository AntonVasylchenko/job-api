require("dotenv").config();
require("express-async-errors");

// security

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");


// Swagger

const swaggerUI =require("swagger-ui-express");
const YAML = require("yamljs")
const swaggerDocument = YAML.load("./swagger.yaml")
const express = require("express");
const app = express();

// connectDB
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
// Router
const authRouter = require("./routes/auth3");
const jobRouter = require("./routes/jobs3");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");


app.set("trust proxy", 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
// extra packages

app.get("/", (req,res) => {
  res.send("<h1>Api</h1><br><a href='/api-docs '>docs</a>")
})
app.use("/api-docs",swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
