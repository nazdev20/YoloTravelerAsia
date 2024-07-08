import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useGetUserInfo } from './useGetUserInfo';

export const useAddTransaction = () => {
  const transactionCollectionRef = collection(db, 'cart');
  const { userID } = useGetUserInfo();

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const addTransaction = async ({
    name,
    description,
    price,
    totalAmountToPay,
    imageUrl,
    startDate,
    endDate,
    Agebracket,
    amountToPay,
    quantity,
  }) => {
    if (!userID) {
      throw new Error('User is not authenticated');
    }

    try {
      await addDoc(transactionCollectionRef, {
        userID,
        name,
        description,
        price,
        totalAmountToPay,
        imageUrl,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        Agebracket,
        amountToPay,
        quantity,
        createdAt: serverTimestamp(),
      });
      console.log('Transaction added successfully');
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  return { addTransaction };
};
