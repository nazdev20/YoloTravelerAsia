import { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import { useGetTransactions } from '../../hooks/useGetTransactions';
import Navbar from '../Navbar/navbar';
import CheckoutForm from './CheckoutForm';

const TransactionList = () => {
  const { cartItems: loadedCartItems } = useGetTransactions();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => setCartItems(loadedCartItems), [loadedCartItems]);

  const removeFromCart = async (itemId) => {
    try {
      console.log('Attempting to remove item with ID:', itemId);

      const itemToRemove = cartItems.find(item => item.id === itemId);

      if (!itemToRemove) {
        console.error('Item not found in cart:', itemId);
        return;
      }

      const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
      if (error) throw error;
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
      const updatedItem = cartItems.find(item => item.id === itemId);

      if (!updatedItem) {
        console.error('Item not found in cart:', itemId);
        return;
      }

      const { error } = await supabase.from('cart_items').update({ quantity: newQuantity }).eq('id', itemId);
      if (error) throw error;

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

  const calculateTotalAmount = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = cartItems.find(item => item.id === itemId);
      if (!item) return total;
      const addonsTotal = (item.selectedAddOns ?? []).reduce((sum, addon) => sum + Number(addon.price) * addon.quantity, 0);
      return total + Number(item.amountToPay) * item.quantity + addonsTotal;
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
                          {item.startDate && <p className="text-gray-700">Start Date: {new Date(item.startDate).toLocaleDateString()}</p>}
                          {item.endDate && <p className="text-gray-700">End Date: {new Date(item.endDate).toLocaleDateString()}</p>}
                          {item.selectedDate && <p className="text-gray-700">Date: {new Date(item.selectedDate).toLocaleDateString()}</p>}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <label htmlFor={`quantity-${item.id}`} className="text-gray-700 mr-2">Qty:</label>
                        <input type="number" id={`quantity-${item.id}`} value={item.quantity} onChange={(e) => updateQuantity(item.id, Math.max(1, Number.parseInt(e.target.value, 10) || 1))} min="1" className="w-12 border border-gray-300 rounded-md py-1 px-2 mr-4" />
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
