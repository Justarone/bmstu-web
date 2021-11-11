import express from "express";
import body_parser from "body-parser";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import common_controllers from "./controllers/common_controllers.js";
import api_router from "./routers/api_router.js";

import options from "./swagger-options.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(common_controllers.logger);

import expressSwaggerGenerator from "express-swagger-generator";
const expressSwagger = expressSwaggerGenerator(app);
expressSwagger(options);

const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-man-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// заголовки в ответ клиенту
app.use(common_controllers.set_headers);

app.use(body_parser.text());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

app.use("/api", api_router)

app.use("/old", common_controllers.sendOld);

app.listen(port);
console.log(`Running on port ${port}`);
