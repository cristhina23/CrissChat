// middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
  try {
    console.error(' Error capturado:', err);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // 🧩 Mongoose: ID inválido o recurso no encontrado
    if (err.name === 'CastError') {
      statusCode = 404;
      message = `Resource not found with id: ${err.value}`;
    }

    //  Mongoose: Duplicated key (ej: email ya registrado)
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      statusCode = 400;
      message = `The ${field} "${err.keyValue[field]}" is already in use. Please use another.`;
    }

    //  Mongoose: Validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      statusCode = 400;
      message = `Validation failed: ${messages.join(', ')}`;
    }

    //  JWT errors
    if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token. Please log in again.';
    }

    if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Your session has expired. Please log in again.';
    }

    //  MongoDB connection issues
    if (err.name === 'MongoNetworkError' || err.message.includes('ECONNREFUSED')) {
      statusCode = 503;
      message = 'Database connection failed. Please try again later.';
    }

    //  Enviar respuesta final
    res.status(statusCode).json({
      success: false,
      status: statusCode,
      message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  } catch (handlerError) {
    console.error('Error dentro del errorHandler:', handlerError);
    res.status(500).json({
      success: false,
      message: 'Unexpected error occurred in error handler.',
    });
  }
};

//  Middleware para rutas no encontradas
const notFound = (req, res, next) => {
  const message = `The requested URL "${req.originalUrl}" was not found on this server.`;
  res.status(404);
  next(new Error(message));
};

module.exports = {
  errorHandler,
  notFound,
};
