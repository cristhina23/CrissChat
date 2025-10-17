const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongodb = require('./db/connection'); // conexión a Mongo
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const User = require('./models/User');
const Message = require('./models/Message');
const expressAsyncHandler = require('express-async-handler');

const app = express();

//  Rooms fijas
const rooms = ['general', 'tech', 'finance', 'crypto'];

//  Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//  Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

//  Routes
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to CrissChat API');
});

//  Funciones auxiliares para mensajes
async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    {
      $group: {
        _id: '$date',
        messagesByDate: { $push: '$$ROOT' },
      },
    },
  ]);
  return roomMessages;
}

function sortRoomMessages(messages) {
  return messages.sort((a, b) => {
    let dateA = a._id.split('/');
    let dateB = b._id.split('/');
    dateA = dateA[2] + dateA[0] + dateA[1];
    dateB = dateB[2] + dateB[0] + dateB[1];
    return dateA > dateB ? 1 : -1;
  });
}

//  Crear servidor HTTP
const server = require('http').createServer(app);

//  Socket.IO
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

//  Eventos de Socket.IO
io.on('connection', (socket) => {

  socket.on('new_user', async () => {
    const members = await User.find();
    io.emit('new_user', members);
  });

  socket.on('join_room', async (room) => {
    socket.join(room);
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessages(roomMessages);
    socket.emit('room_messages', roomMessages);
  })

  socket.on('message_room', async(room, content, sender, date, time) => {
    console.log('new message: ', content);
    // Guardar primero
    const newMessage = new Message({ content, from: sender, to: room, date, time });
    await newMessage.save();

    // Luego obtener todos los mensajes actualizados
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessages(roomMessages);

    // Enviar mensajes actualizados al room
    io.to(room).emit('room_messages', roomMessages);

    // Notificar a otros usuarios
    socket.broadcast.emit('notifications', room);
  })

  
});

//  Endpoint para obtener rooms
app.get('/rooms', (req, res) => {
  res.json(rooms);
});

//  Middleware de errores
app.use(notFound);
app.use(errorHandler);

//  Conectar a MongoDB y levantar servidor
mongodb.initDb((err, db) => {
  if (err) {
    console.error(' Failed to initialize database:', err);
    process.exit(1);
  } else {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  }
});
