import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import Driver from './models/Driver.js';
import Level from './models/Level.js';
import sampleDrivers from './data/sampleDrivers.js';
import { sampleLevels } from './data/sampleLevels.js';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';

dotenv.config();

const app = express();

// Basic Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// REST API Routes
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/drivers', driverRoutes);

// Add a test route to verify server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

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

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB Connected: ' + mongoose.connection.host);

    // Add sample drivers if none exist
    const driverCount = await Driver.countDocuments();
    if (driverCount === 0) {
      await Driver.insertMany(sampleDrivers);
      logger.info('Sample drivers added successfully');
    }

    // Add sample levels if none exist
    const levelCount = await Level.countDocuments();
    if (levelCount === 0) {
      await Level.insertMany(sampleLevels);
      logger.info('Sample levels added successfully');
    }

    // Start Apollo Server
    await apolloServer.start();
    logger.info('Apollo Server started successfully');

    // Apply Apollo GraphQL middleware
    apolloServer.applyMiddleware({ 
      app,
      path: '/graphql',
      cors: false // Disable CORS here since we're handling it at the Express level
    });
    logger.info('Apollo middleware applied at /graphql');

    // Error handling middleware should be last
    app.use(notFound);
    app.use(errorHandler);

    // Start Express Server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`GraphQL endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`);
      logger.info(`GraphQL playground available at: http://localhost:${PORT}/graphql`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
