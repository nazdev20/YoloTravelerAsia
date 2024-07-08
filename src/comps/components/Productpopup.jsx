import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmationModal from './confirmationmodal'; // Corrected import name
import { useAddTransaction } from '../../hooks/useAddTransaction';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth, provider } from '../../config/firebase-config';
import { FaMapMarkerAlt } from 'react-icons/fa';

const Popup = ({ item, onClose }) => {
  const navigate = useNavigate();
  const { addTransaction } = useAddTransaction();
  const { user } = useAuth();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [prices, setPrices] = useState({
    adult: 0,
    child: 0,
    senior: 0,
  });
  const [quantities, setQuantities] = useState({
    adult: 0,
    child: 0,
    senior: 0,
  });
  const [showSignInConfirmation, setShowSignInConfirmation] = useState(false);
  const [amountToPay, setAmountToPay] = useState(0);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const productsRef = collection(db, 'Product');
      const querySnapshot = await getDocs(productsRef);
      querySnapshot.forEach((doc) => {
        const product = doc.data();
        if (product.name === item.name) {
          setPrices({
            adult: product.adultPrice,
            child: product.childPrice,
            senior: product.seniorPrice,
          });
        }
      });
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const authInfo = {
        userID: user.uid,
        name: user.displayName,
        profilePhoto: user.photoURL,
        isAuth: true,
      };
      localStorage.setItem("auth", JSON.stringify(authInfo));
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date > endDate) {
      setEndDate(date);
    }
    calculateAmountToPay(date, endDate, quantities);
  };

  const handleEndDateChange = (date) => {
    if (date < startDate) {
      setStartDate(date);
    }
    setEndDate(date);
    calculateAmountToPay(startDate, date, quantities);
  };

  const calculateAmountToPay = (start, end, qty) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    let daysDifference = Math.ceil((endDateObj - startDateObj) / oneDay) + 1;

    if (daysDifference <= 0) {
      daysDifference = 1;
    }

    const total = (prices.adult * qty.adult + prices.child * qty.child + prices.senior * qty.senior) * daysDifference;
    setAmountToPay(total);
  };

  const handleQuantityChange = (category, value) => {
    const newQuantities = { ...quantities, [category]: value ? 1 : 0 };
    setQuantities(newQuantities);
    calculateAmountToPay(startDate, endDate, newQuantities);
  };

  const handleAddToCart = async () => {
    try {
      if (!user) {
        setShowSignInConfirmation(true);
        return;
      }

      const hasSelectedBracket = Object.values(quantities).some(qty => qty > 0);
      if (!hasSelectedBracket) {
        alert('Please select at least one age bracket.');
        return;
      }

      const totalPrice = Object.keys(quantities).reduce((total, category) => {
        return total + quantities[category] * prices[category];
      }, 0);

      const category = {};
      Object.keys(quantities).forEach((key) => {
        if (quantities[key] > 0) {
          category[key] = quantities[key];
        }
      });

      await addTransaction({
        name: item.name,
        description: item.description,
        price: totalPrice,
        totalAmountToPay: amountToPay,
        imageUrl: item.imageUrl,
        startDate: startDate,
        endDate: endDate,
        Agebracket: category,
        amountToPay: amountToPay,
        quantity: Object.values(quantities).reduce((a, b) => a + b, 0),
      });
      alert(`Added ${item.name} to cart`);
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-full w-full sm:max-w-lg sm:w-full h-full max-h-[80%] z-50">
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Product Confirmation</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-auto mt-4">
            <form className="w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="mt-4">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-10 object-cover rounded-md" />
                </div>
                <div className="mt-4">
                  <label htmlFor="name" className="text-sm text-gray-500">{item.name}</label>
                </div>
                <div className="mt-4 col-span-2">
                  <label className="text-sm text-gray-500">Age Bracket:</label>
                  <div className="flex flex-col">
                    {['adult', 'child', 'senior'].map((category) => (
                      <div key={category} className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id={`${category}-checkbox`}
                          className="mr-2"
                          checked={quantities[category] > 0}
                          onChange={(e) => handleQuantityChange(category, e.target.checked)}
                        />
                        <label htmlFor={`${category}-checkbox`} className="mr-2 text-gray-500">
                          {category.charAt(0).toUpperCase() + category.slice(1)} (₱{prices[category].toFixed(2)})
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={quantities[category]}
                          onChange={(e) => handleQuantityChange(category, e.target.value)}
                          className="w-20 p-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          disabled={quantities[category] <= 0}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 col-span-2">
                  <label htmlFor="description" className="text-sm text-gray-500">
                    Description: {item.description}
                  </label>
                </div>
                <div className="mt-4">
                  <label htmlFor="start-date" className="text-sm text-gray-500">Select start date:</label>
                  <DatePicker
                    id="start-date"
                    selected={startDate}
                    onChange={handleStartDateChange}
                    className="block w-full mt-1 p-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="end-date" className="text-sm text-gray-500">Select end date:</label>
                  <DatePicker
                    id="end-date"
                    selected={endDate}
                    onChange={handleEndDateChange}
                    className="block w-full mt-1 p-2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  />
                </div>
                <div className="mt-4 col-span-2">
                  <label htmlFor="amount-to-pay" className="text-md text-gray-500 font-bold ">Amount to pay: ₱{amountToPay.toFixed(2)}</label>
                </div>
                <div className="flex flex-col mt-2 col-span-2">
                  <span className="font-semibold">Highlights:</span>
                  {item.inputs && item.inputs.map((input, index) => (
                    <div key={index} className="flex items-center">
                      <FaMapMarkerAlt className="mr-1" />
                      <span>{input}</span>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
          <div className="bg-gray-100 px-4 py-3 flex justify-end">
            <button onClick={handleAddToCart} className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      {showSignInConfirmation && (
        <ConfirmationModal
          message="You need to sign in before adding to cart."
          onConfirm={signInWithGoogle}
          onCancel={() => setShowSignInConfirmation(false)}
          zIndex={60}
        />
      )}
    </div>
  );
};

export default Popup;