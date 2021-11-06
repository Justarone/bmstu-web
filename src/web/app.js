const express = require("express");
const path = require("path");
const body_parser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const common_controllers = require("./controllers/common_controllers");
const api_router = require("./routers/api_router");

const PAGES_FOLDER = "public";

const port = process.env.PORT | 3000;

const app = express();

const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(common_controllers.logger);
// заголовки в ответ клиенту
app.use(common_controllers.set_headers);

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use("/api", api_router)

app.use(express.static(path.join(__dirname, "..", PAGES_FOLDER)));

app.listen(port);
console.log(`Running on port ${port}`);
