import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase-config';
import Popup from '../Packagepopup';
import 'aos/dist/aos.css';
import AOS from 'aos';

const UserViewPage = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchItems();
    AOS.init();
  }, []);

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Package'));
      const fetchedItems = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedItem(null);
    setShowModal(false);
  };

  return (
    <div className="container mx-auto p-4 bg-white mb-10 mt-9">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#008080]">Packages</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-gray-300 rounded-md p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => handleItemClick(item)}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="relative">
              <img src={item.imageUrl} alt={item.name} className="mb-4 rounded-md object-cover w-full h-[200px]" />

              <div className="space-y-2 text-center">
                <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                <p className="text-lg font-semibold text-green-600">₱{item.price}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && <Popup item={selectedItem} onClose={handleModalClose} />}
    </div>
  );
};

export default UserViewPage;
