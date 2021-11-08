import path from "path";

const options = {
    swaggerDefinition: {
        info: {
            description: 'Hockey teams application',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost:3000',
        basePath: '/api',
        produces: [
            "application/json",
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: path.resolve('src/web'), //app absolute path
    files: ['./routers/*.js'] //Path to the API handle folder
};

export default options;
