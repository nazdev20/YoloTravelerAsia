import { supabase } from '../config/supabase';

const useRemoveFromCart = () => {
  const removeFromCart = async (userID) => {
    try {
      const { error } = await supabase.from('carts').delete().eq('user_id', userID);
      if (error) throw error;
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  return { removeFromCart };
};

export default useRemoveFromCart;
