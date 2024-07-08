import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase-config';
import { Timestamp } from 'firebase/firestore';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]); 
  const [selectedReceipt, setSelectedReceipt] = useState(null); 


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
  
        const querySnapshot = await getDocs(collection(db, 'checkout'));
      
        const transactionData = querySnapshot.docs.map(doc => doc.data());
        setTransactions(transactionData.map(transaction => {
          const formattedTransaction = formatTransactionDates(transaction);
          return formattedTransaction;
        }));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);


  const formatTransactionDates = (transaction) => {
    try {
      
      const formattedStartDate = transaction.startDate instanceof Timestamp ? transaction.startDate.toDate().toLocaleString() : 'N/A';
      const formattedEndDate = transaction.endDate instanceof Timestamp ? transaction.endDate.toDate().toLocaleString() : 'N/A';

      return {
        ...transaction,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      };
    } catch (error) {
      console.error('Error formatting transaction dates:', error);
      return transaction;
    }
  };


  const handleViewReceipt = (selectedOrders, startDate, endDate, totalAmount) => {
    const formattedDates = formatTransactionDates({ startDate, endDate });
    setSelectedReceipt({ selectedOrders, ...formattedDates, totalAmount });
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
