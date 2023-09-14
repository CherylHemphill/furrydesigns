const { PubSub, withFilter } = require("graphql-subscriptions") 
const {  User, Product, Review, Task, Message, Order } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { protect, isAdmin } = require('../utils/helpers');
const { generateToken } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const pubsub = new PubSub();
const MESSAGE_CREATED = 'MESSAGE_CREATED';


const resolvers = {
  Query: {
    getAllUsers: async (_, args, context) => {
      protect(context);
      return User.find();
    
    },
    
    isAdmin: async (_, args, context) => {
      protect(context);
      const user = await User.findOne({ _id: context.user._id });
      return user.isAdmin;
      
    },


    getUserProfile: async (_, args, context) => {
      protect(context);
      const user = await User.findById(context.user._id).populate('orders');
      user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);
      return user;
    },

 getAllProducts: async () => {
      try {
        const products = await Product.find();
        if (!products) {
          throw new Error('No Products found');
        } 
        return products;
      } catch (error) {
        console.error("Error retrieving products:", error);
        throw new Error(`Unable to fetch the products: ${error.message}`);
      }
    },

    productById: async (_, { _id }) => {
      try {
        const product = await Product.findOne({ _id });
        if (!product) {
          throw new Error('Product not found');
        }
        return product;
      } catch (error) {
        console.error("Error retrieving product:", error);
        throw new Error(`Unable to fetch the product: ${error.message}`);
      }
     
    },

    products: async (_, { name }) => {
      const params = {};

      if (name) {
        params.name = {
          $regex: name
        };
      }

      return await Product.find(params);
    },

   getAllOrders: async (_, args, context) => {
      protect(context);
      return Order.find({});
      
    },

     order: async (_, { _id }, context) => {
    protect(context);
    return Order.findById(_id);
  },

    getOrdersByUser: async (_, { userId }, context) => {
      try {
        protect(context);
        const orders = await Order.find({ userId }); 
        return orders;
      } catch (error) {
        throw new Error('Error fetching orders by user');
      }
  },

    checkout: async (_, args, context) => {
      const url = new URL(context.headers.referer).origin;
      await new Order({ products: args.products });
     
      const line_items = [];
      for (const product of args.products) {
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
              images: [`${url}/images/${product.image}`]
            },
            unit_amount: product.price * 100,
          },
          quantity: product.purchaseQuantity,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`,
      });

      return { session: session.id };
    },


    getAllMessages: async (_, args, context) => {
      protect(context);
      return Message.find({});
     
    },
 
    getAllReviews: async () => {
      return Review.find();
    },
  
    reviewById: async (_, { _id }) => {
      try {
        const review = await Review.findById(_id);
        if (!review) {
          throw new Error('Review not found')
        }
        return review;
      } catch (error) {
        console.error("Error retrieving review:", error);
          throw new Error(`Unable to fetch the review: ${error.message}`);
      }
    
    },

    tasks: async () => {
      return await Task.find();
    },
    
    

  },



  Mutation: {
    addUser: async (_, { name, email, password }) => {
    
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
          throw new Error("Email already in use");
      }
  
      const user = await User.create({ name, email, password });
      const token = generateToken(user);
  
      return { token, user };
  },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user with this email found!');
      }

      const correctPw = await user.matchPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = generateToken(user);
      return { token, user };
    },

    async logout(_, __, context) {
    
      return true;
    },

    updateUser: async (_, { name, email, password, isAdmin  }, context) => {
        protect(context);
  
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { name, email, password, isAdmin },
          { new: true }
        );
        return user;
    },

    removeUser: async (_, args, context) => {
      if (context.user) {
        return User.findOneAndDelete({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    addAdmin: async (_, { userId }) => {
      try {
        const user = await User.findByIdAndUpdate(userId, {isAdmin: true }, { new: true });
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      }  catch (error) {
        console.log('Error adding user to admin');
        throw new Error(`Unable to add user to admin: ${error.message}`);
      }
    },

    createProduct: async (_, { name, animalType, size, color, description, model, price }, context) => {
      protect(context);
      const product = await Product.create({ name, animalType, size, color, description, model, price });
      return product;
     
    },

    editProduct: async (_, { id, name, animalType, size, color, description, model, price }, context) => {
      protect(context);
      const product = await Product.findOneAndUpdate(
        { _id: id },
        { name, animalType, size, color, description, model, price },
        { new: true }
      );
      return product;
     
    },

    addOrder: async (_, { products }, context) => {
      console.log(context);
      if (context.user) {
        const newOrder = new Order({ products });

        await User.findByIdAndUpdate(context.user._id, { $push: { orders: newOrder } });

        return newOrder;
      }

      throw new AuthenticationError('Not logged in');
    },
    
    adminUpdateOrderStatus: async (_, { orderId, status }) => {
      try {
        if (status !== "shipped") {
          throw new Error("Invalid status. Only 'shipped' status is allowed.");
        }
        const order = await Order.findById(orderId);

        if (!order) {
          throw new Error("Order not found.");
        }
        if (order.status !== "pending") {
          throw new Error("Order status is not 'pending', so it cannot be updated.");
        }
        order.status = status;
        await order.save();
        return order;
      } catch (error) {
        throw new Error(`Failed to update order status: ${error.message}`);
      }
    }, 
  

    createReviewReply: async (_, { reviewId, text }, context) => {
      const review = await Review.findById(reviewId);
      if (!review) {
        throw new Error('Review not found');
      }
      const reply = {
        adminId: context.user._id, 
        text: text,
        date: Date.now()  
      };
    
      review.replies.push(reply);
      await review.save();
      return review;
    },

    updateReviewReply: async (_, { id, text }, context) => {
      const updatedReview = await Review.findOneAndUpdate(
        { "replies._id": id }, 
        { "$set": { "replies.$.text": text } },
        { new: true }
      );
      if (!updatedReview) {
        throw new Error('Review reply not found');
      }
      return updatedReview;
    },

    deleteReviewReply: async (_, { id }, context) => {
      const updatedReview = await Review.findOneAndUpdate(
        {}, 
        { "$pull": { "replies": { "_id": id } } },
        { new: true }
      );
      if (!updatedReview) {
        throw new Error('Review reply not found');
      }
      return id;
    },

    addTask: async (_, { text }, context) => {
      const adminId = context.user.id; 
      const task = new Task({ text, admin: adminId });
      await task.save();
      return task;
    },

    deleteTask: async (_, { id }) => {
      await Task.findByIdAndDelete(id);
      return "Task deleted successfully";
    },

    toggleTaskCompletion: async (_, { id }) => {
      const task = await Task.findById(id);
      task.completed = !task.completed;
      await task.save();
      return task;
    },
addMessage: async (_, { userId, subject, content, date }, context) => {
      const message = new Message({ userId, subject, content, date });
      await message.save();
      pubsub.publish(MESSAGE_CREATED, { messageCreated: message });
      return message;
    },

    replyToMessage: async (_, { messageId, content, date }, context) => {
    
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }
    
      const reply = {
        adminId: context.user._id,
        content: content,
        date: date || Date.now()  
      };
    
      message.messageReply.push(reply);
      await message.save()
      return message;
    },

  },
    
    Subscription: {
      messageCreated: {
        subscribe: withFilter(
          () => pubsub.asyncIterator([MESSAGE_CREATED]),
          (payload, variables, context) => {
            return context.user.isAdmin; 
          }
        ),
      },
    },
  
};

module.exports = resolvers;


 