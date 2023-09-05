import React, { useState } from 'react';
import { 
  ApolloProvider, 
  ApolloClient,
  InMemoryCache, 
  createHttpLink,
 } from '@apollo/client';
 import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { CartProvider } from './userFront/component/Products/Cart/cartContext'; // Make sure this is the correct path

import Home from './userFront/component/Pages/Home';
import About from './userFront/component/Pages/About';
import Shop from './userFront/component/Pages/Shop';
import AdminDashboard from './components/adminDashboard';



import ProductContext from './userFront/component/Products/ProductDisplay/ProductContext';
import LoginScreen from './userFront/component/Pages/LoginScreen';
import RegisterScreen from './userFront/component/Pages/RegisterScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserPage from './userFront/component/Pages/UserPage';

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const [selectedProductId, setSelectedProductId] = useState(null);

  return (
    <ApolloProvider client={client}>
      <Router>
        <CartProvider>
        <ToastContainer />

        <ProductContext.Provider value={{ selectedProductId, setSelectedProductId }}>
            <Routes>
              <Route 
              path="/"
              element={<Home />} 
              />
              <Route 
              path="/about" 
              element={<About />} 
              />
              <Route 
              path="/Shop" 
              element={<Shop />} 
              />
              <Route 
              path="/adminDashboard//*" 
              element={<AdminDashboard />} 
              />
              <Route 
              path="/UserPage" 
              element={<UserPage />} 
              />
              <Route 
              path="/login" 
              element={<LoginScreen />} 
              />
              <Route 
              path="/register" 
              element={<RegisterScreen />} 
              />
            </Routes>
            
            </ProductContext.Provider>
            
        </CartProvider>
      </Router>
    </ApolloProvider>
  );
}

export default App;