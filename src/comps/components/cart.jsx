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

  const updateQuantity = async (itemId, requestedQuantity) => {
    try {
      const updatedItem = cartItems.find(item => item.id === itemId);
      if (!updatedItem) throw new Error('Item not found in cart.');
      // Product bookings contain an age-bracket breakdown, so their participant
      // count must be changed in the booking form rather than independently here.
      if (updatedItem.productId) return;

      const newQuantity = Math.max(1, Math.floor(Number(requestedQuantity) || 1));
      const addonsTotal = (updatedItem.selectedAddOns ?? []).reduce(
        (sum, addon) => sum + Number(addon.price || 0) * Number(addon.quantity || 0), 0
      );
      const nextDetails = { ...updatedItem };
      delete nextDetails.id;
      delete nextDetails.productId;
      delete nextDetails.packageId;
      delete nextDetails.quantity;
      delete nextDetails.amountToPay;
      nextDetails.bookingTotal = Number(updatedItem.amountToPay) * newQuantity + addonsTotal;

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity, details: nextDetails })
        .eq('id', itemId);
      if (error) throw error;

      setCartItems(prevCartItems => prevCartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity, bookingTotal: nextDetails.bookingTotal } : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Could not update quantity. Please try again.');
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

  const calculateItemTotal = (item) => {
    const unitPrice = Number(item.amountToPay) || 0;
    const quantity = Number(item.quantity) || 0;
    const addonsTotal = (item.selectedAddOns ?? []).reduce(
      (sum, addon) => sum + Number(addon.price || 0) * Number(addon.quantity || 0), 0
    );
    return unitPrice * quantity + addonsTotal;
  };

  const calculateTotalAmount = () => selectedItems.reduce((total, itemId) => {
    const item = cartItems.find(cartItem => cartItem.id === itemId);
    return total + (item ? calculateItemTotal(item) : 0);
  }, 0);

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
                    <div key={item.id} className="flex flex-col gap-4 border-t border-b py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" checked={selectedItems.includes(item.id)} onChange={() => handleCheckboxChange(item.id)} />
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                        <div>
                          <h3 className="text-lg font-bold">{item.name}</h3>
                          <p className="text-gray-700">Unit price: ₱{Number(item.amountToPay).toFixed(2)}</p>
                          {item.startDate && <p className="text-gray-700">Start Date: {new Date(item.startDate).toLocaleDateString()}</p>}
                          {item.endDate && <p className="text-gray-700">End Date: {new Date(item.endDate).toLocaleDateString()}</p>}
                          {item.selectedDate && <p className="text-gray-700">Date: {new Date(item.selectedDate).toLocaleDateString()}</p>}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                        <div className="flex items-center gap-2">
                          <label htmlFor={`quantity-${item.id}`} className="text-gray-700">Qty:</label>
                          {item.packageId ? (
                            <input type="number" id={`quantity-${item.id}`} value={item.quantity} onChange={(e) => updateQuantity(item.id, e.target.value)} min="1" step="1" className="w-16 rounded-md border border-gray-300 px-2 py-2" />
                          ) : (
                            <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Line total: ₱{calculateItemTotal(item).toFixed(2)}</p>
                        <button onClick={() => removeFromCart(item.id)} className="rounded px-2 py-1 text-red-600 hover:bg-red-50">Remove</button>
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
