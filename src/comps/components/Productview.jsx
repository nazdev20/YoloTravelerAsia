import AOS from 'aos';
import 'aos/dist/aos.css';
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase-config';
import { getDocs, collection } from 'firebase/firestore';
import Popup from './Productpopup';

const ItemDisplay = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
    AOS.init();
  }, []);

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Product'));
      const fetchedItems = [];
      querySnapshot.forEach((doc) => {
        fetchedItems.push({ id: doc.id, ...doc.data() });
      });
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  return (
    <div className="container mx-auto p-4 bg-white mb-8 mt-9">
      <h1 className="text-2xl font-bold mb-4 text-[#008080] text-center">Product List</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-gray-300 rounded-md p-4 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
            onClick={() => handleItemClick(item)}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="relative">
              <img src={item.imageUrl} alt={item.name} className="mb-4 rounded-md object-cover w-full h-[200px]" />

              <div className="mt-4">
                <p className="text-lg font-semibold">Destination: {item.name}</p>
                <p className="text-md">{item.category}</p>
                <p className="text-md overflow-hidden max-h-16">
                  Description: {item.description.length > 100 ? (
                    <>
                      {item.description.slice(0, 100)}...
                      <span className="text-blue-500 cursor-pointer" onClick={() => handleItemClick(item)}> See more</span>
                    </>
                  ) : (
                    item.description
                  )}
                </p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="font-semibold">Price: ₱{item.childPrice} - {item.adultPrice}</p>
                <p className="font-semibold">{item.inputs}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <Popup item={selectedItem} onClose={handleClosePopup} />
      )}
    </div>
  );
}

export default ItemDisplay;
