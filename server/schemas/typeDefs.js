const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    name: String
    email: String
    isAdmin: Boolean
    orders: [Order]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Product {
    _id: ID
    name: String
    animalType: String
    sizes: [String]
    colors: [String]
    description: String
    model: String
    price: Float
    reviews: [Review]
  }

  type Review {
    _id: ID
    name: User
    rating: Float
    text: String
    date: String
    ReviewReply: [ReviewReply]
  }
  
  type ReviewReply {
    adminId: ID
    reviewId: ID
    text: String
    date: String
  }

  type Order {
    _id: ID
    purchaseDate: String
    status: String
    products: [Product]
  }
  
  type OrderedProduct {
    product: Product
    quantity: Int
  }

  type Checkout {
    session: ID
  }

  type Message {
    _id: ID
    user: User
    subject: String
    content: String
    date: String
  }

  type MessageReply {
    adminId: ID
    messageId: ID
    content: String
    date: String
  }

  type Task {
    id: ID
    text: String
    completed: Boolean
  }

  input ProductInput {
    _id: ID
    purchaseQuantity: Int
    name: String
    image: String
    price: Float
    quantity: Int
  }

  input OrderedProductInput {
   productId: ID
   quantity: Int
 }

  type Query {
    getAllUsers: [User]
    getUserProfile: User
    isAdmin: Boolean

    getAllProducts: [Product]
    productById(_id: ID!): Product
    products(name: String): [Product]

    getAllOrders: [Order]
    order(_id: ID!): Order
    getOrdersByUser(userId: ID!): [Order]
    checkout(products: [ProductInput]): Checkout

    getAllMessages: [Message]

    getAllReviews: [Review]
    reviewById(id: ID!): Review

    tasks: [Task]
  }

  type Mutation {
    addUser(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    logout: Boolean
    updateUser(name: String, email: String, password: String, isAdmin: Boolean): User
    removeUser: User
    addAdmin(userId: ID!): User
  
  createProduct(
    name: String!, 
    animalType: String!, 
    size: String!, 
    color: String!, 
    description: String!, 
    model: String, 
    price: Float!
  ): Product

  editProduct(
    id: ID!, 
    name: String, 
    animalType: String, 
    size: String, 
    color: String, 
    description: String, 
    model: String, 
    price: Float
  ): Product
  
  addOrder(products: [ID]!): Order
  adminUpdateOrderStatus(orderId: ID!, status: String!): Order

  createReviewReply(reviewId: ID!, text: String!): ReviewReply  
  updateReviewReply(id: ID!, text: String!): ReviewReply        
  deleteReviewReply(id: ID!): ID

  addTask(text: String!): Task
  deleteTask(id: ID!): ID
  toggleTaskCompletion(id: ID!): Task

 addMessage(userId: ID!, subject: String!, content: String!): Message
  replyToMessage(messageId: ID!, content: String!): MessageReply
 
  }
  

    type Subscription {
      messageCreated(topic: String!, userId: ID): Message
    }
  
`;

module.exports = typeDefs;