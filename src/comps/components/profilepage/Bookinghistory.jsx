import { useEffect, useState } from 'react';
import { supabase } from '../../../config/supabase';
import { useGetUserInfo } from '../../../hooks/useGetUserInfo';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]); 
  const [selectedReceipt, setSelectedReceipt] = useState(null); 
  const { userID } = useGetUserInfo();


  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userID) {
        setTransactions([]);
        return;
      }
      const { data, error } = await supabase.from('orders')
        .select('id,total_amount,selected_date,created_at,status,order_items(id,product_name,quantity,amount_to_pay,details,order_item_addons(addon_name,addon_price,quantity))')
        .eq('user_id', userID)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }
      setTransactions(data.map((order) => ({
        id: order.id,
        totalAmount: Number(order.total_amount),
        startDate: order.selected_date ? new Date(order.selected_date).toLocaleString() : 'N/A',
        status: order.status,
        selectedOrders: (order.order_items ?? []).map((item) => ({
          ...item.details,
          name: item.product_name,
          quantity: item.quantity,
          price: Number(item.amount_to_pay) * item.quantity + (item.order_item_addons ?? []).reduce((sum, addon) => sum + Number(addon.addon_price) * addon.quantity, 0),
          addons: item.order_item_addons ?? [],
          imageUrl: item.details?.imageUrl,
        })),
      })));
    };

    fetchTransactions();
  }, [userID]);


  const handleViewReceipt = (selectedOrders, startDate, endDate, totalAmount) => {
    setSelectedReceipt({ selectedOrders, startDate, endDate, totalAmount });
  };

  
  const handleCloseReceipt = () => {
    setSelectedReceipt(null);
  };

  return (
    <div className="container mx-auto mt-10 max-h-screen overflow-auto relative">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
      <table className="border-collapse w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Item</th>
            <th className="border border-gray-300 px-4 py-2">Price</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="border-b border-gray-300">
              <td className="border border-gray-300 px-4 py-2">
                {transaction.selectedOrders.map((order, orderIndex) => (
                  <div key={orderIndex} className="flex items-center">
                    <img src={order.imageUrl} alt={order.name} className="w-12 h-12 object-cover mr-2 mb-1" />
                    <span>{order.name}</span> <span>{order.quantity}</span> <span>{order.totalAmount}</span>
                  </div>
                ))}
              </td>
              <td className="border border-gray-300 px-4 py-2">{transaction.totalAmount}</td>
              <td className="border border-gray-300 px-4 py-2">
                {transaction.status && <span className="mr-2 capitalize">{transaction.status}</span>}
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleViewReceipt(transaction.selectedOrders, transaction.startDate, transaction.endDate, transaction.totalAmount)}> 
                 View Receipt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedReceipt && (
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto flex items-center justify-center bg-gray-700 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md max-w-md">
            <h2 className="text-lg font-bold mb-2">Receipt</h2>
            <ul>
              {selectedReceipt.selectedOrders.map((order, index) => (
                <li key={index} className="mb-3">
                  <img src={order.imageUrl} className='w-12 h-12 object-cover mr-2 mb-1' alt={order.name} />
                  <p>Name: {order.name}</p>
                  <p>Price: ${order.price}</p>
                  <p>Quantity: {order.quantity}</p>
                </li>
              ))}
              <li>  
                <p>Total Amount: ${selectedReceipt.totalAmount}</p>
              </li>
            </ul>
        
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleCloseReceipt}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
