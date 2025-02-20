import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Driver {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    profilePicture: String
    vehicleType: String!
    vehicleNumber: String!
    vehicleCapacity: Float
    status: String!
    isVerified: Boolean!
    currentLocation: Location
    rating: Float
    totalTrips: Int
    currentLevel: Level
    createdAt: String
    updatedAt: String
    role: String!
  }

  type Level {
    _id: ID!
    name: String!
    requiredTrips: Int!
    rewards: String!
    description: String!
    createdAt: String
    updatedAt: String
  }

  type Location {
    type: String!
    coordinates: [Float!]!
  }

  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: String!
    createdAt: String
    updatedAt: String
  }

  type Query {
    searchDrivers(
      query: String
      vehicleType: String
      status: String
      page: Int
      limit: Int
    ): DriverSearchResult!
    
    getLevels: [Level!]!
    getCurrentUserLevel: Level
    getNextLevel: Level
  }

  type DriverSearchResult {
    drivers: [Driver!]!
    totalCount: Int!
    hasMore: Boolean!
  }

  input CreateDriverInput {
    firstName: String!
    lastName: String!
    phone: String!
    vehicleType: String!
    vehicleNumber: String!
    password: String!
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Mutation {
    createDriver(input: CreateDriverInput!): Driver!
    updateDriverStatus(id: ID!, status: String!): Driver!
    updateDriverLocation(id: ID!, coordinates: [Float!]!): Driver!
    createUser(input: CreateUserInput!): User!
  }

  enum VehicleType {
    bike
    car
    van
    truck
  }

  enum DriverStatus {
    available
    busy
    offline
  }

  enum UserRole {
    ADMIN
    DRIVER
    USER
  }
`;
