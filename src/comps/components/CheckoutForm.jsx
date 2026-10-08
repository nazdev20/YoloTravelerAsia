import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';

const CheckoutForm = ({ cartItems, totalAmount, onCancel }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [paymentImage, setPaymentImage] = useState(null);
  const [termsChecked, setTermsChecked] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showDeposit, setShowDeposit] = useState(false); 
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      setEmail(user.email ?? '');
      setName(user.user_metadata?.full_name ?? user.user_metadata?.name ?? '');
    }
  }, [user]);

  useEffect(() => {
    if (cartItems.length > 0) {
      const selectedItem = cartItems[0];
      const dateToFormat = selectedItem.selectedDate || selectedItem.date || selectedItem.startDate;
      if (dateToFormat) {
        setSelectedDate(new Date(dateToFormat).toISOString());
      }
    }
  }, [cartItems]);

  const handlePaymentImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentImage(file);
    }
  };

  const handleTermsCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setTermsChecked(isChecked);
    setShowDeposit(isChecked); 
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!termsChecked) {
      alert('Please accept the terms and conditions to proceed.');
      return;
    }
  
    if (!paymentImage) {
      alert('Please upload your payment confirmation screenshot.');
      return;
    }
  
    if (!name.trim() || !address.trim() || !email.trim() || cartItems.length === 0 || !totalAmount || !selectedDate.trim()) {
      alert('One or more fields are missing');
      return;
    }
  
    try {
      if (!user) throw new Error('Please sign in before checking out.');
      let paymentImagePath = '';
  
      if (paymentImage) {
        const path = `${user.id}/${crypto.randomUUID()}-${paymentImage.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
        const { error: uploadError } = await supabase.storage.from('payment-images').upload(path, paymentImage);
        if (uploadError) throw uploadError;
        paymentImagePath = path;
      }
  
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        user_id: user.id,
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_address: address.trim(),
        payment_method: selectedPaymentMethod,
        total_amount: totalAmount,
        payment_image_url: paymentImagePath,
        selected_date: selectedDate ? new Date(selectedDate).toISOString() : null,
      }).select('id').single();
      if (orderError) throw orderError;

      for (const item of cartItems) {
        const { data: orderItem, error: itemError } = await supabase.from('order_items').insert({
          order_id: order.id,
          product_id: item.productId ?? null,
          package_id: item.packageId ?? null,
          product_name: item.name,
          quantity: item.quantity,
          amount_to_pay: item.amountToPay,
          details: item,
        }).select('id').single();
        if (itemError) throw itemError;

        const selectedAddOns = item.selectedAddOns ?? [];
        if (selectedAddOns.length) {
          const { error: addonsError } = await supabase.from('order_item_addons').insert(selectedAddOns.map((addon) => ({
            order_item_id: orderItem.id,
            addon_id: addon.id,
            addon_name: addon.name,
            addon_price: addon.price,
            quantity: addon.quantity,
          })));
          if (addonsError) throw addonsError;
        }

        const inputValues = item.inputValues ?? [];
        if (inputValues.length) {
          const { error: inputsError } = await supabase.from('order_item_inputs').insert(inputValues.map((input) => ({
            order_item_id: orderItem.id,
            input_name: input.name,
            input_value: input.value,
          })));
          if (inputsError) throw inputsError;
        }
      }

      alert('Thank you for booking. Please wait until we process your needs.');
      for (const item of cartItems) {
        const { error: deleteError } = await supabase.from('cart_items').delete().eq('id', item.id);
        if (deleteError) throw deleteError;
      }
  
      window.location.reload(); 
    } catch (error) {
      console.error('Error creating order in Supabase: ', error);
      alert('There was an error processing your checkout. Please try again.');
    }
  };
  
  return (
    <div className="flex items-center justify-center lg:flex-row lg:space-x-8 p-8 ml-16 w-[80%]">
      <div className="lg:w-3/5 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Booking Checkout</h2>
        <div className="mb-4 border rounded-lg overflow-hidden">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center p-4 border-b">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover mr-4" />
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-700">{item.location}</p>
                <p className="text-gray-700">Quantity: {item.quantity}</p>
                <p className="text-gray-700">Price: ₱{item.amountToPay}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6">Booking Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                readOnly
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentMethod">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={selectedPaymentMethod}
                onChange={handlePaymentMethodChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select Payment Method</option>
                <option value="GCash">GCash</option>
                <option value="PayPal">PayPal</option>
                <option value="PayMaya">PayMaya</option>
                <option value="CreditCard">Credit Card</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="selectedDate">
                Selected Date
              </label>
              <input
                type="text"
                id="selectedDate"
                value={selectedDate}
                readOnly
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentImage">
                Upload Payment Confirmation Screenshot
              </label>
              <input
                type="file"
                id="paymentImage"
                onChange={handlePaymentImageChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Terms and Conditions
              </label>
              <p className="text-gray-600 mb-2">
                Thank you for choosing to book with us! Here’s what you need to know:
              </p>
              <ul className="list-disc pl-5 text-gray-600">
                <li className="mb-1">
                  A refundable deposit of 10% of the total amount is required to secure your booking. This deposit will be deducted from your overall balance.
                </li>
                <li className="mb-1">
                  The remaining balance must be paid after we process your booking.
                </li>
              </ul>
            
              <h2 className="text-lg font-semibold mt-2">We look forward to hosting you! If you have any questions, feel free to reach out to our support team.</h2>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsChecked}
                  onChange={handleTermsCheckboxChange}
                  className="mr-2 leading-tight"
                  required
                />
                <label className="text-sm" htmlFor="terms">
                  I have read and agree to the terms and conditions.
                </label>
              </div>
            </div>
            {showDeposit && (
                <p className="text-gray-700 mt-2 font-bold">Deposit Amount you need to Pay first: ₱{totalAmount * 0.1}</p>
              )}
            <div className="flex items-center justify-between mt-6">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Checkout
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
