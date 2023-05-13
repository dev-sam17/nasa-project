const http  = require('http');

require('dotenv').config()

const app = require('./src/app')
const { mongoConnect } = require('./src/services/mongo')
const { loadPlanetsData } = require('./src/models/planets.models')
const { loadLaunchesData } = require('./src/models/launches.model')

const PORT = process.env.PORT || 8000

const server = http.createServer(app)

async function startServer() {
  await mongoConnect()

  await loadPlanetsData();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}....`);
  });
} 

startServer()
