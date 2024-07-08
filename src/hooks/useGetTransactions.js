import { useEffect, useState } from "react";
import {collection,query,where,onSnapshot,} from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useGetUserInfo } from "./useGetUserInfo";

export const useGetTransactions = () => {
  const [cartItems, setCartItems] = useState([]);
  const { userID } = useGetUserInfo();
  const cartCollectionRef = collection(db, "cart");

  useEffect(() => {
    const fetchCartItems = async () => {
      const q = query(cartCollectionRef, where("userID", "==", userID));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(items);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchCartItems();

    return () => unsubscribe();
  }, [cartCollectionRef, userID]);

  return { cartItems };
};
