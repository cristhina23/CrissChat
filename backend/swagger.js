const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CrissChat API',
    description: 'API documentation for CrissChat'
  },
  host: process.env.HOST || 'localhost:5000',
  schemes: ['http', 'https']
};

const outputFile = './swagger-output.json';
const endpointFiles = ['./server.js'];

(async () => {
  try {
    await swaggerAutogen(outputFile, endpointFiles, doc);
    console.log(' Swagger documentation generated successfully');
  } catch (err) {
    console.error(' Error generating swagger documentation:', err);
    process.exit(1);
  }
})();
