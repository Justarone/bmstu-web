import path from "path";

const options = {
    route: {
        url: '/api/v2',
        docs: '/api/v2.json'
    },
    swaggerDefinition: {
        info: {
            description: 'Hockey teams application',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost',
        basePath: '/api/v1',
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
