/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '/Users/mmts5/web/src/config/firebase-config';
import { useGetUserInfo } from '/Users/mmts5/web/src/hooks/useGetUserInfo';
import { Timestamp } from 'firebase/firestore';

const TransactionList = () => {
  const { userID } = useGetUserInfo();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (userID) {
        const q = query(collection(db, 'cart'), where('userID', '==', userID));
  
        try {
          const querySnapshot = await getDocs(q);
          const cartData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const { id } = doc;
            const { name, description, amountToPay, imageUrl, category, startDate, endDate, quantity } = data; 
            const formattedStartDate = startDate instanceof Timestamp ? startDate.toDate() : startDate;
            const formattedEndDate = endDate instanceof Timestamp ? endDate.toDate() : endDate;
        
            return {
                id,
                name,
                description,
                amountToPay,
                imageUrl,
                category,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                quantity
            };
          });
  
          setCartItems(cartData);
          setTotalAmount(calculateTotalAmount(cartData));
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      }
    };
  
    fetchCartItems();
  }, [userID]);
  

  const removeFromCart = async (itemId) => {
    try {
      const itemToRemove = cartItems.find(item => item.id === itemId);
      const updatedTotalAmount = totalAmount - (itemToRemove.amountToPay * itemToRemove.quantity);
  
      await deleteDoc(doc(db, 'cart', itemId));
      console.log(`Removed item from cart`);
  
      setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== itemId));
      setTotalAmount(prevTotalAmount => updatedTotalAmount);
      setSelectedItems(prevSelectedItems => prevSelectedItems.filter(selectedItem => selectedItem !== itemId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };
  
  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const cartDocRef = doc(db, 'cart', itemId);
      await updateDoc(cartDocRef, { quantity: newQuantity });
  
      setCartItems(prevCartItems =>
        prevCartItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
  
      const updatedTotalAmount = calculateTotalAmount(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
  
      setTotalAmount(prevTotalAmount => updatedTotalAmount);
  
      await updateTotalAmountInDatabase(itemId, updatedTotalAmount);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  
  const handleCheckboxChange = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(prevSelectedItems => prevSelectedItems.filter(selectedItem => selectedItem !== itemId));
    } else {
      setSelectedItems(prevSelectedItems => [...prevSelectedItems, itemId]);
    }
  };

  const handleCheckout = async () => {
    try {


      const checkoutData = {
        totalAmount: selectedItems.reduce((total, itemId) => 
          total + (cartItems.find(item => item.id === itemId).amountToPay * cartItems.find(item => item.id === itemId).quantity), 0),
        totalQuantity: selectedItems.reduce((total, itemId) => 
          total + cartItems.find(item => item.id === itemId).quantity, 0),
        selectedOrders: selectedItems.map(itemId => {
          const selectedItem = cartItems.find(item => item.id === itemId);
          return {
            name: selectedItem.name,
            price: selectedItem.amountToPay * selectedItem.quantity,
            quantity: selectedItem.quantity,
            imageUrl: selectedItem.imageUrl
          };
        })
      };
      const updatedCartItems = cartItems.map(item => ({
        ...item,
        quantity: 0
      }));  setCartItems(updatedCartItems);    setTotalAmount(0);
    
      
      await addDoc(collection(db, 'checkout'), checkoutData);
      

      setSelectedItems([]);
      
      console.log('Checkout successful');
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };
  
  
  
  

  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + (item.amountToPay * item.quantity), 0);
  };

  const updateTotalAmountInDatabase = async (itemId) => {
    try {
      const cartDocRef = doc(db, 'cart', itemId);
      await updateDoc(cartDocRef, {  });
      console.log('Total amount updated in the database.');
    } catch (error) {
      console.error('Error updating total amount in the database:', error);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-white p-4 shadow rounded mb-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`select-${item.id}`} 
                  checked={selectedItems.includes(item.id)} 
                  onChange={() => handleCheckboxChange(item.id)} 
                  className="mr-4"
                />
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                <div>
                  <h2 className="text-lg font-bold">{item.name}</h2>
                  <p className="text-gray-700 mb-2">Price: {item.amountToPay}$</p>
                 
              <p className="text-gray-700 mb-2">Category: {item.category}</p>
              
                  <div className="flex items-center">
                    <label htmlFor={`quantity-${item.id}`} className="text-gray-700 mr-2">Quantity:</label>
                    <input 
                      type="number" 
                      id={`quantity-${item.id}`} 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      min='1'
                      className="w-16 border border-gray-300 rounded-md py-1 px-2"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <p className="text-gray-700 mr-4">${item.amountToPay * item.quantity}</p>
                <button onClick={() => removeFromCart(item.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="bg-gray-200 p-4 shadow rounded">
            <h2 className="text-lg font-bold">
              Selected Items Total: {selectedItems.reduce((total, itemId) => 
                total + (cartItems.find(item => item.id === itemId).amountToPay * cartItems.find(item => item.id === itemId).quantity), 0)}$
            </h2>
            <button onClick={handleCheckout} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
