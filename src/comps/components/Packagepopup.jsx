/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import ConfirmationModal from '../components/confirmationmodal';
import { useAddTransaction } from '../../hooks/Addtocartpackage';
import { useAuth } from '../../hooks/useAuth';
import { auth, provider, db } from '../../config/firebase-config';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

export default function Popup({ item, onClose }) {
  const navigate = useNavigate();
  const { addTransaction } = useAddTransaction();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('adult');
  const [quantity, setQuantity] = useState(0);
  const [showSignInConfirmation, setShowSignInConfirmation] = useState(false);
  const [totalAmountToPay, setTotalAmountToPay] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [goodForStocks, setGoodForStocks] = useState('');
  const discountPercentage = 5;

  useEffect(() => {
    fetchItemDetails();
  }, []);

  useEffect(() => {
    calculateAmountToPay();
  }, [selectedCategory, quantity, item.price, selectedDate]);

  const fetchItemDetails = async () => {
    const itemRef = doc(db, 'items', item.id);
    const itemSnapshot = await getDoc(itemRef);

    if (itemSnapshot.exists()) {
      const itemData = itemSnapshot.data();
      setGoodForStocks(itemData.goodforstocks);
    } else {
      console.log("No such document!");
    }
  };

  const calculateAmountToPay = () => {
    let pricePerDay = item.price;
    let totalAmount = pricePerDay * quantity;

    if (totalAmount === 0 || quantity === 0) {
      setTotalAmountToPay(0);
    } else {
      if (selectedCategory !== 'adult') {
        const discountAmount = (totalAmount * discountPercentage) / 100;
        totalAmount -= discountAmount;
      }

      setTotalAmountToPay(totalAmount);
    }
  };

  const checkExistingRecord = async (itemName, date, category) => {
    const transactionsRef = collection(db, 'cart');
    const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
    const q = query(
      transactionsRef,
      where('name', '==', itemName),
      where('date', '==', formattedDate),
      where('category', '==', category)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleAddToCart = async (itemName, imageUrl, pricePerDay) => {
    try {
      if (!user) {
        setShowSignInConfirmation(true);
        return;
      }

      let amountToPay = totalAmountToPay;
      if (isNaN(amountToPay) || amountToPay <= 0) {
        throw new Error('Invalid amount to pay');
      }

      if (!selectedDate) {
        throw new Error('Please select a date');
      }

      const dateObj = new Date(selectedDate);

      const existingRecord = await checkExistingRecord(itemName, selectedDate, selectedCategory);
      if (existingRecord) {
        alert('Record already exists');
        return;
      }

      const result = await addTransaction({
        name: itemName,
        description: 'Added to cart',
        imageUrl: imageUrl,
        category: selectedCategory,
        price: pricePerDay,
        amountToPay: amountToPay,
        date: dateObj,
        quantity: quantity,
      });

      if (result.success) {
        alert(`Added ${itemName} to cart`);
        onClose();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const results = await signInWithPopup(auth, provider);
      const authInfo = {
        userID: results.user.uid,
        name: results.user.displayName,
        profilePhoto: results.user.photoURL,
        isAuth: true,
      };
      localStorage.setItem("auth", JSON.stringify(authInfo));
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignInConfirmation = async () => {
    setShowSignInConfirmation(false);
    await signInWithGoogle();
  };

  const handleCancelSignInConfirmation = () => {
    setShowSignInConfirmation(false);
  };

  const handleQuantityChange = (e) => {
    const count = Number(e.target.value);
    setQuantity(count);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-full w-full sm:max-w-lg sm:w-full h-full max-h-[80%] z-50">
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Package Confirmation</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-auto mt-4 flex flex-col sm:flex-row">
            <div className="sm:w-1/2 flex justify-center sm:items-center">
              <img src={item.imageUrl} alt={item.name} className="w-full sm:w-40 h-auto object-cover rounded-md" />
            </div>
            <div className="sm:w-1/2 sm:pl-4 flex flex-col sm:justify-center">
              <label htmlFor="name" className="text-sm text-gray-500">{item.name}</label>
              <div className="mt-4">
                <label className="text-sm text-gray-500">Age Bracket:</label>
                <select
                  className="block w-full mt-1 p-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="adult">Adult</option>
                  <option value="child">Child</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
              <div className="mt-4">
                <label htmlFor="description" className="text-sm text-gray-500">
                  Description: {item.description}
                </label>
              </div>
              <div className="mt-4">
                <label htmlFor="goodForStocks" className="text-sm text-gray-500">
                  Good for Stocks: {goodForStocks}
                </label>
              </div>
              <div className="mt-4">
                <label htmlFor="quantity" className="text-sm text-gray-500">Quantity:</label>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="date" className="text-sm text-gray-500">Select Date:</label>
                <select
                  className="block w-full mt-1 p-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value="">Select available date</option>
                  {item.datesAvailable.map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center mt-4">
                <label htmlFor="totalAmountToPay" className="text-sm text-gray-500">
                  Total Amount to Pay:
                </label>
                <span className="ml-2 text-lg font-semibold text-gray-800">₱{totalAmountToPay.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="mt-auto bg-gray-100 px-4 py-3 flex justify-end">
            <button onClick={() => handleAddToCart(item.name, item.imageUrl, item.price)} className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      {showSignInConfirmation && (
        <ConfirmationModal
          message="Please sign in to add items to the cart."
          onConfirm={handleSignInConfirmation}
          onCancel={handleCancelSignInConfirmation}
        />
      )}
    </div>
  );
}