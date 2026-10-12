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
    const normalizedQuantity = Number(quantity);
    const normalizedAmount = Number(amountToPay);
    if (!Number.isSafeInteger(normalizedQuantity) || normalizedQuantity < 1) {
      throw new Error('Quantity must be a whole number greater than zero.');
    }
    if (!Number.isFinite(normalizedAmount) || normalizedAmount < 0) {
      throw new Error('The item price is invalid. Please review the booking total.');
    }

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
      quantity: normalizedQuantity,
      amount_to_pay: normalizedAmount,
      details,
    });
    if (error) throw error;
    return { success: true };
  };

  return { addTransaction };
};
