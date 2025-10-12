const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const mongodb = require('./db/connection')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const userRoutes = require('./routes/userRoutes')
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

const app = express()

const rooms = ['general', 'tech', 'finance', 'crypto'];

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/users', userRoutes)

app.get('/', (req, res) => {
  res.send('Welcome to CrissChat API');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000

const server = require('http').createServer(app)

const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
})

mongodb.initDb((err, db) => {
  if (err) {
    console.error('Failed to initialize database:', err)
    process.exit(1); // Exit with error code
  } else {
    try {
      server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
    } catch (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  }
})

