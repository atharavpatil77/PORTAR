import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import routes from './routes/index.js';
import logger from './utils/logger.js';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';

// Load environment variables
config();

const startServer = async () => {
  try {
    const app = express();

    // Connect to MongoDB
    await connectDB();

    // Basic Middleware
    app.use(cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    }));
    app.use(morgan('dev'));

    // Test route to verify server is running
    app.get('/test', (req, res) => {
      res.json({ message: 'Server is running' });
    });

    // REST API Routes
    app.use('/api', routes);

    // Initialize Apollo Server
    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        const token = req.headers.authorization || '';
        return { token };
      },
      introspection: true,
      playground: true
    });

    // Start Apollo Server
    await apolloServer.start();
    logger.info('Apollo Server started successfully');

    // Apply Apollo GraphQL middleware
    apolloServer.applyMiddleware({
      app,
      path: '/graphql',
      cors: false // We're already handling CORS at the Express level
    });
    logger.info('Apollo middleware applied at /graphql');

    // Error handling middleware should be last
    app.use(notFound);
    app.use(errorHandler);

    // Start Express Server
    const PORT = process.env.PORT || 5001;

    // Check if port is in use
    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`GraphQL endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`);
      logger.info(`GraphQL playground: http://localhost:${PORT}/graphql`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use. Please stop any existing server or choose a different port.`);
        process.exit(1);
      }
      throw error;
    });

    // Handle process termination
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully');
      server.close(() => {
        logger.info('Process terminated');
      });
    });

  } catch (error) {
    logger.error('Server startup failed:', error);
    process.exit(1);
  }
};

// Start the server
startServer().catch(error => {
  logger.error('Server startup failed:', error);
  process.exit(1);
});