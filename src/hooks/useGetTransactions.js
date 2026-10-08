import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { useGetUserInfo } from './useGetUserInfo';

export const useGetTransactions = () => {
  const [cartItems, setCartItems] = useState([]);
  const { userID } = useGetUserInfo();
  useEffect(() => {
    if (!userID) {
      setCartItems([]);
      return undefined;
    }

    let active = true;
    const fetchCartItems = async () => {
      const { data, error } = await supabase
        .from('carts')
        .select('cart_items(id,product_id,package_id,quantity,amount_to_pay,details,products(name,image_url,description),packages(name,image_url,description))')
        .eq('user_id', userID)
        .maybeSingle();
      if (error) {
        console.error('Error fetching cart items:', error);
        return;
      }
      if (active) setCartItems((data?.cart_items ?? []).map((row) => ({
        id: row.id,
        productId: row.product_id,
        packageId: row.package_id,
        quantity: row.quantity,
        amountToPay: Number(row.amount_to_pay),
        ...(row.details ?? {}),
        name: row.details?.name ?? row.products?.name ?? row.packages?.name,
        imageUrl: row.details?.imageUrl ?? row.products?.image_url ?? row.packages?.image_url,
        description: row.details?.description ?? row.products?.description ?? row.packages?.description,
      })));
    };

    fetchCartItems();
    return () => { active = false; };
  }, [userID]);

  return { cartItems };
};
