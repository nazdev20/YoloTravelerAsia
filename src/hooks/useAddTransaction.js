import { useAuth } from './useAuth';
import { supabase } from '../config/supabase';

export const useAddTransaction = () => {
  const { user } = useAuth();

  const addTransaction = async ({
    itemId,
    type,
    amountToPay,
    quantity,
    details,
  }) => {
    if (!user) throw new Error('Please sign in before adding items to your cart.');
    if (!itemId || !['product', 'package'].includes(type)) throw new Error('Invalid cart item.');

    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .upsert({ user_id: user.id }, { onConflict: 'user_id' })
      .select('id')
      .single();
    if (cartError) throw cartError;

    const { error } = await supabase.from('cart_items').insert({
      cart_id: cart.id,
      product_id: type === 'product' ? itemId : null,
      package_id: type === 'package' ? itemId : null,
      quantity,
      amount_to_pay: amountToPay,
      details,
    });
    if (error) throw error;
    return { success: true };
  };

  return { addTransaction };
};
