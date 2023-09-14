// import React from 'react';
// import { useStoreContext } from "../../../../utils/GlobalState";
// import { REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from "../../../../utils/actions";
// import { idbPromise } from "../../../../utils/helpers";

// const CartItem = ({ item }) => {

//   const [, dispatch] = useStoreContext();

//   const removeFromCart = item => {
//     dispatch({
//       type: REMOVE_FROM_CART,
//       _id: item._id
//     });
//     idbPromise('cart', 'delete', { ...item });

//   };

//   const onChange = (e) => {
//     const value = e.target.value;
//     if (value === '0') {
//       dispatch({
//         type: REMOVE_FROM_CART,
//         _id: item._id
//       });
//       idbPromise('cart', 'delete', { ...item });

//     } else {
//       dispatch({
//         type: UPDATE_CART_QUANTITY,
//         _id: item._id,
//         purchaseQuantity: parseInt(value)
//       });
//       idbPromise('cart', 'put', { ...item, purchaseQuantity: parseInt(value) });

//     }
//   }

//   return (
//     <div className="flex-row">
//       <div>
//         <img
//           src={`/images/${item.image}`}
//           alt=""
//         />
//       </div>
//       <div>
//         <div>{item.name}, ${item.price}</div>
//         <div>
//           <span>Qty:</span>
//           <input
//             type="number"
//             placeholder="1"
//             value={item.purchaseQuantity}
//             onChange={onChange}
//           />
//           <span
//             role="img"
//             aria-label="trash"
//             onClick={() => removeFromCart(item)}
//           >
//             🗑️
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CartItem;





import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        //logic to add an item to the cart
        setCart(prevCart => [...prevCart, item]);
    };

    const removeFromCart = (itemId) => {
        //logic to remove an item based on its id or some other unique property
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
