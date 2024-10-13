import config from 'config';
import { Server } from 'http';
import app from './app';
import logger from './config/logger';
import { initDB } from './config';

process.on('uncaughtException', (err) => {
  logger.info('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.message, { errorName: err.name });
  process.exit(1);
});

let server: Server;
const startServer = async () => {
  const PORT: number = config.get('server.port') ?? 5500;

  try {
    await initDB();
    logger.info('Database connected successfully 😊');

    server = app.listen(PORT, () =>
      logger.info(`Catalog Service running on port ${PORT}`, {
        success: 'Catalog Service started successfully 😊😊'
      })
    );
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.name === 'MongoServerError' ||
        error.name === 'MongooseServerSelectionError' ||
        error.name === 'MongoNetworkError' ||
        error.name === 'MongoAuthError'
      ) {
        logger.error('Database connection failed 😟😟', {
          errorName: error.name,
          message: error.message
        });
      } else {
        logger.error(error.message, { errorName: error.name });
      }
    }
    setTimeout(() => process.exit(1), 1000);
  }
};

void startServer();

process.on('unhandledRejection', (err: Error) => {
  logger.error(err.message, { errorName: err.name });
  logger.info('UnhandledRejection , shutting down 😶');

  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM RECIEVED, shutting down gracefully 👋');
  server.close((error) => {
    logger.error('💥 Process Terminated', {
      errorName: error?.name
    });
  });
});
