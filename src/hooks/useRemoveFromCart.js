/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// useRemoveFromCart.js
import { useState } from 'react';
import { deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config'; // Assuming you have a Firebase configuration file

const useRemoveFromCart = () => {
  const removeFromCart = async (userID) => {
    try {
      const q = query(collection(db, 'cart'), where('userID', '==', userID));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        console.log(`Removed item from cart for userID: ${userID}`);
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  return { removeFromCart };
};

export default useRemoveFromCart;
