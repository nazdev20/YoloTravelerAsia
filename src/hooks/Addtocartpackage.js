import { addDoc, collection, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

export const useAddTransaction = () => {
  const transactionCollectionRef = collection(db, "cart");
  const { userID } = useGetUserInfo();

  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    if (isNaN(date)) {
      throw new Error("Invalid date value");
    }
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  const addTransaction = async ({
    name,
    description,
    imageUrl,
    category,
    price, 
    amountToPay,
    date,
    quantity,
  }) => {
    try {
      const formattedDate = formatDate(date);

      const q = query(transactionCollectionRef,
        where("userID", "==", userID),
        where("name", "==", name),
        where("category", "==", category),
        where("date", "==", formattedDate)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return { success: false, message: 'Already added to cart.' };
      } else {
        await addDoc(transactionCollectionRef, {
          userID,
          name,
          description,
          imageUrl,
          category,
          price,
          amountToPay,
          date: formattedDate,
          quantity,
          createdAt: serverTimestamp(),
        });

        return { success: true, message: 'Transaction added successfully.' };
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      return { success: false, message: 'Error adding transaction.' };
    }
  };

  return { addTransaction };
};
