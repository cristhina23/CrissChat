const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('./db/connection');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const User = require('./models/User');
const Message = require('./models/Message');
const expressAsyncHandler = require('express-async-handler');

const app = express();

// Rooms fijas
const rooms = ['general', 'tech', 'finance', 'crypto'];

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Rutas
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to CrissChat API');
});

// Funciones auxiliares
async function getLastMessagesFromRoom(room) {
  const roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: '$date', messagesByDate: { $push: '$$ROOT' } } },
  ]);
  return roomMessages;
}

function sortRoomMessages(messages) {
  return messages.sort((a, b) => {
    const [mA, dA, yA] = a._id.split('/');
    const [mB, dB, yB] = b._id.split('/');
    return yA + mA + dA > yB + mB + dB ? 1 : -1;
  });
}

// Crear servidor HTTP
const server = require('http').createServer(app);

// Socket.IO
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

// Eventos de Socket.IO
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);
  socket.join('general');

  // Cuando un nuevo usuario entra
  socket.on('new_user', async () => {
    const members = await User.find().sort({ status: -1, createdAt: -1 });
    io.emit('new_user', members);
  });

  // Unirse a una sala
  socket.on('join_room', async (room) => {
    socket.join(room);
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessages(roomMessages);
    socket.emit('room_messages', roomMessages);
  });

  // Enviar mensaje a la sala
  // Enviar mensaje a la sala
socket.on('message_room', async (room, content, senderId, time, date) => {
  try {
    console.log('💬 Message received:', content);

    await Message.create({
      content,
      from: senderId,
      to: String(room),
      time,
      date,
      timestamp: new Date(),
    });

    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessages(roomMessages);

    // Enviar los mensajes solo a la sala actual
    io.to(room).emit('room_messages', roomMessages);

    // 🔔 Enviar notificación SOLO a usuarios fuera de esa sala
    socket.broadcast.emit('notifications', { room });
  } catch (error) {
    console.error('❌ Error saving message:', error);
  }
});


  // Cuando un usuario se desconecta
  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    const members = await User.find().sort({ status: -1, createdAt: -1 });
    io.emit('new_user', members);
  });
});

// Endpoint para obtener las salas
app.get('/rooms', (req, res) => {
  res.json(rooms);
});

// Middleware de errores
app.use(notFound);
app.use(errorHandler);

// Conexión MongoDB + servidor
mongodb.initDb((err, db) => {
  if (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  } else {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  }
});
