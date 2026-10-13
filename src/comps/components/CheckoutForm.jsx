import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../hooks/useAuth';

const CheckoutForm = ({ cartItems, totalAmount, onCancel }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
      if (dateToFormat) setSelectedDate(new Date(dateToFormat).toISOString());
    }
  }, [cartItems]);

  const depositAmount = Math.round(Number(totalAmount) * 10) / 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!termsChecked) return setErrorMessage('Please accept the terms and conditions to continue.');
    if (!name.trim() || !address.trim() || !email.trim() || cartItems.length === 0 || !(Number(totalAmount) > 0)) {
      return setErrorMessage('Please check your booking details and try again.');
    }
    if (!user) return setErrorMessage('Please sign in before checking out.');

    setIsSubmitting(true);
    let orderId;
    let paymentId;

    try {
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        user_id: user.id,
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_address: address.trim(),
        total_amount: Number(totalAmount),
        selected_date: selectedDate ? new Date(selectedDate).toISOString() : null,
      }).select('id').single();
      if (orderError) throw orderError;
      orderId = order.id;

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
          const { error } = await supabase.from('order_item_addons').insert(selectedAddOns.map((addon) => ({
            order_item_id: orderItem.id, addon_id: addon.id, addon_name: addon.name,
            addon_price: addon.price, quantity: addon.quantity,
          })));
          if (error) throw error;
        }

        const inputValues = item.inputValues ?? [];
        if (inputValues.length) {
          const { error } = await supabase.from('order_item_inputs').insert(inputValues.map((input) => ({
            order_item_id: orderItem.id, input_name: input.name, input_value: input.value,
          })));
          if (error) throw error;
        }
      }

      const { data: payment, error: paymentError } = await supabase.from('payments').insert({
        order_id: order.id,
        provider: 'paymongo',
        amount: depositAmount,
        currency: 'PHP',
        status: 'pending',
        metadata: { customer_email: email.trim() },
      }).select('id').single();
      if (paymentError) throw paymentError;
      paymentId = payment.id;

      const response = await fetch('/api/payments/test-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: String(order.id),
          paymentId: String(payment.id),
          amount: depositAmount,
          customerEmail: email.trim(),
          itemNames: cartItems.map((item) => item.name),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.checkoutUrl) throw new Error(result.error || 'Could not start PayMongo checkout.');

      const { error: updateError } = await supabase.from('payments').update({
        checkout_session_id: result.checkoutSessionId,
      }).eq('id', payment.id);
      if (updateError) throw updateError;

      window.location.assign(result.checkoutUrl);
    } catch (error) {
      console.error('PayMongo checkout failed:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Checkout failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl items-center justify-center px-3 py-4 sm:px-6">
      <div className="w-full rounded-lg bg-white p-4 shadow sm:p-6">
        <h2 className="mb-2 text-2xl font-bold">Booking Checkout</h2>
        <p className="mb-6 text-sm text-gray-600">Complete your booking details, then pay the required 10% deposit securely on PayMongo.</p>
        <div className="mb-4 overflow-hidden rounded-lg border">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center border-b p-4 last:border-b-0">
              <img src={item.imageUrl} alt={item.name} className="mr-4 h-20 w-20 rounded object-cover" />
              <div><h3 className="font-semibold">{item.name}</h3><p className="text-gray-700">{item.location}</p><p className="text-gray-700">Quantity: {item.quantity}</p><p className="text-gray-700">₱{Number(item.amountToPay).toFixed(2)} each</p></div>
            </div>
          ))}
          <div className="flex justify-between border-t bg-gray-50 p-4 font-semibold"><span>Booking total</span><span>₱{Number(totalAmount).toFixed(2)}</span></div>
          <div className="flex justify-between p-4 text-lg font-bold"><span>10% deposit due now</span><span>₱{depositAmount.toFixed(2)}</span></div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4"><label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="name">Name</label><input id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded border px-3 py-2 text-gray-700" required /></div>
          <div className="mb-4"><label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="address">Address</label><input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded border px-3 py-2 text-gray-700" required /></div>
          <div className="mb-4"><label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="email">Email</label><input id="email" type="email" value={email} readOnly className="w-full rounded border bg-gray-100 px-3 py-2 text-gray-700" required /></div>
          <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50 p-4"><h3 className="font-semibold text-blue-900">Payment powered by PayMongo</h3><p className="mt-1 text-sm text-blue-800">You will be redirected to PayMongo's secure hosted checkout to choose an available payment method such as GCash, Maya, card, or QRPh. No screenshot upload is required.</p></div>
          <div className="mb-5"><h3 className="mb-2 font-semibold">Terms and Conditions</h3><p className="mb-2 text-gray-600">A refundable deposit of 10% of the total amount is required to secure your booking. The remaining balance is due after the booking is processed.</p><label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={termsChecked} onChange={(e) => setTermsChecked(e.target.checked)} className="mt-1" required /><span>I have read and agree to the terms and conditions.</span></label></div>
          {errorMessage && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>}
          <div className="mt-6 flex items-center justify-between gap-3"><button type="submit" disabled={isSubmitting} className="rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Preparing PayMongo checkout…' : 'Pay deposit with PayMongo'}</button><button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded bg-gray-200 px-4 py-2 font-bold text-gray-800 hover:bg-gray-300 disabled:opacity-60">Cancel</button></div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
