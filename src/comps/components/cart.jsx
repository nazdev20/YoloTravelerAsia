import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase-config';
import { useGetUserInfo } from '../../hooks/useGetUserInfo';
import Navbar from '../Navbar/navbar';
import CheckoutForm from './CheckoutForm';

const TransactionList = () => {
  const { userID } = useGetUserInfo();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (userID) {
        console.log('Fetching cart items for userID:', userID);

        const cartQuery = query(collection(db, 'cart'), where('userID', '==', userID));

        try {
          const snapshot = await getDocs(cartQuery);
          console.log('Number of cart documents:', snapshot.size);

          const cartData = snapshot.docs.map(doc => {
            const data = doc.data();
            const {
              name,
              description,
              amountToPay,
              imageUrl,
              ageBracket,
              startDate,
              endDate,
              quantity,
              type,
              adultPrice,
              childPrice,
              seniorPrice,
              date
            } = data;

            const formattedStartDate = startDate instanceof Timestamp ? startDate.toDate() : new Date(startDate);
            const formattedEndDate = endDate instanceof Timestamp ? endDate.toDate() : new Date(endDate);
            const formattedDate = date instanceof Timestamp ? date.toDate() : new Date(date);

            return {
              id: doc.id,
              name,
              description,
              amountToPay,
              imageUrl,
              ageBracket,
              startDate: isValidDate(formattedStartDate) ? formattedStartDate : null,
              endDate: isValidDate(formattedEndDate) ? formattedEndDate : null,
              date: isValidDate(formattedDate) ? formattedDate : null,
              quantity,
              type,
              adultPrice,
              childPrice,
              seniorPrice
            };
          });

          setCartItems(cartData);
          console.log('Cart Data:', cartData);
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      }
    };

    fetchCartItems();
  }, [userID]);

  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  const removeFromCart = async (itemId) => {
    try {
      console.log('Attempting to remove item with ID:', itemId);

      const itemToRemove = cartItems.find(item => item.id === itemId);

      if (!itemToRemove) {
        console.error('Item not found in cart:', itemId);
        return;
      }

      const itemRef = doc(db, 'cart', itemId);

      await deleteDoc(itemRef);
      console.log(`Removed item from cart with ID: ${itemId}`);

      setCartItems(prevCartItems => prevCartItems.filter(item => item.id !== itemId));
      setSelectedItems(prevSelectedItems => prevSelectedItems.filter(selectedItem => selectedItem !== itemId));

      console.log('Item successfully removed and state updated');
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const cartDocRef = doc(db, 'cart', itemId);
      const updatedItem = cartItems.find(item => item.id === itemId);

      if (!updatedItem) {
        console.error('Item not found in cart:', itemId);
        return;
      }

      await updateDoc(cartDocRef, { quantity: newQuantity });

      setCartItems(prevCartItems =>
        prevCartItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleCheckboxChange = (itemId) => {
    setSelectedItems(prevSelectedItems => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter(selectedItem => selectedItem !== itemId);
      } else {
        return [...prevSelectedItems, itemId];
      }
    });
  };

  const handleCheckoutClick = () => {
    if (selectedItems.length > 0) {
      setIsCheckingOut(true);
    } else {
      alert('Please select at least one item to proceed to checkout.');
    }
  };

  const handleCheckout = async (checkoutData) => {
    try {
      await addDoc(collection(db, 'checkout'), checkoutData);
      console.log('Checkout successful');

      const updatedCartItems = cartItems.map(item => ({
        ...item,
        quantity: 0
      }));
      setCartItems(updatedCartItems);
      setSelectedItems([]);
      setIsCheckingOut(false);
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const calculateTotalAmount = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = cartItems.find(item => item.id === itemId);
      return total + (item ? item.amountToPay * item.quantity : 0);
    }, 0);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-28 px-4">
        {isCheckingOut ? (
          <CheckoutForm
            cartItems={cartItems.filter(item => selectedItems.includes(item.id))}
            totalAmount={calculateTotalAmount()}
            onCheckout={handleCheckout}
            onCancel={() => setIsCheckingOut(false)}
          />
        ) : (
          <>
            {cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <div className="w-full">
                <div className="bg-white shadow rounded p-4 mb-4">
                  <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
                  <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-2" checked={selectedItems.length === cartItems.length} onChange={() => {
                        if (selectedItems.length === cartItems.length) {
                          setSelectedItems([]);
                        } else {
                          setSelectedItems(cartItems.map(item => item.id));
                        }
                      }} />
                      <p className="text-gray-700">Select All</p>
                    </div>
                    <p className="text-xl font-semibold">Subtotal: ₱{calculateTotalAmount().toFixed(2)}</p>
                  </div>
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between border-t border-b py-4">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" checked={selectedItems.includes(item.id)} onChange={() => handleCheckboxChange(item.id)} />
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                        <div>
                          <h3 className="text-lg font-bold">{item.name}</h3>
                          <p className="text-gray-700">Price: ₱{item.amountToPay}</p>
                          {item.startDate && isValidDate(item.startDate) && (
                            <p className="text-gray-700">Start Date: {item.startDate.toLocaleDateString()}</p>
                          )}
                          {item.endDate && isValidDate(item.endDate) && (
                            <p className="text-gray-700">End Date: {item.endDate.toLocaleDateString()}</p>
                          )}
                          {item.date && isValidDate(item.date) && (
                            <p className="text-gray-700">Date: {item.date.toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <label htmlFor={`quantity-${item.id}`} className="text-gray-700 mr-2">Qty:</label>
                        <input type="number" id={`quantity-${item.id}`} value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} min="1" className="w-12 border border-gray-300 rounded-md py-1 px-2 mr-4" />
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button onClick={handleCheckoutClick} className="bg-orange-500 text-white font-bold py-2 px-4 rounded">Proceed to Checkout</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default TransactionList;
