/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../../config/firebase-config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './admin.css'

const Package = () => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [newCategory, setNewCategory] = useState(''); // New state for adding a new category
  const [itemDescription, setItemDescription] = useState('');
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState(['Boracay', 'Palawan', 'Bohol', 'Mayon']); // Default categories
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemPrice, setEditItemPrice] = useState('');
  const [editItemCategory, setEditItemCategory] = useState('');
  const [editItemDescription, setEditItemDescription] = useState('');
  const [inputFields, setInputFields] = useState(['']);
  const [addModeDatesAvailable, setAddModeDatesAvailable] = useState(['']); 
  const [editModeDatesAvailable, setEditModeDatesAvailable] = useState(['']); 
  const [selectedCategory, setSelectedCategory] = useState('');
  const [goodForStocks, setGoodForStocks] = useState('');
  const [placesToVisit, setPlacesToVisit] = useState(['']);
  const [note, setNote] = useState('');


  useEffect(() => {
    fetchItems();
  }, []);

  const handleNoteChange = (value) => {
    setNote(value);
  };
  const handleEditItem = (item) => {
    setEditingItemId(item.id);
    setEditItemName(item.name);
    setEditItemPrice(item.price.toString());
    setEditItemCategory(item.category);
    setEditItemDescription(item.description);
    setInputFields(item.inputs || ['']);
    setEditModeDatesAvailable(item.datesAvailable || ['']);
    setGoodForStocks(item.goodForStocks || '');
    setPlacesToVisit(item.placesToVisit || '');
  };
  

  const handleInputChange = (index, value) => {
    const newInputFields = [...inputFields];
    newInputFields[index] = value;
    setInputFields(newInputFields);
  };
  const handleAddInput = () => {
    setInputFields([...inputFields, '']);
  };
  
  const handleRemoveInput = (index) => {
    const newInputFields = [...inputFields];
    newInputFields.splice(index, 1);
    setInputFields(newInputFields);
  };

  const handleDateChange = (index, value) => {
    const newDatesAvailable = [...addModeDatesAvailable];
    newDatesAvailable[index] = value;
    setAddModeDatesAvailable(newDatesAvailable);
  };

  const handleAddDate = () => {
    setAddModeDatesAvailable([...addModeDatesAvailable, '']);
  };

  const handleRemoveDate = (index) => {
    const newAddModeDatesAvailable = [...addModeDatesAvailable];
    newAddModeDatesAvailable.splice(index, 1);
    setAddModeDatesAvailable(newAddModeDatesAvailable);
  };

  const handleEditDate = (index, value) => {
    const newDatesAvailable = [...editModeDatesAvailable];
    newDatesAvailable[index] = value;
    setEditModeDatesAvailable(newDatesAvailable);
  };

  const handleEditAddDate = () => {
    setEditModeDatesAvailable([...editModeDatesAvailable, '']);
  };

  const handleEditRemoveDate = (index) => {
    const newEditModeDatesAvailable = [...editModeDatesAvailable];
    newEditModeDatesAvailable.splice(index, 1);
    setEditModeDatesAvailable(newEditModeDatesAvailable);
  };

  const updateItem = async () => {
    try {
      const updatedItem = {
        name: editItemName,
        price: parseFloat(editItemPrice),
        category: editItemCategory,
        description: editItemDescription,
        inputs: inputFields,
        datesAvailable: editModeDatesAvailable, 
        goodForStocks: parseInt(goodForStocks),
        placesToVisit: placesToVisit,
        note: note 
      };
  
      await updateDoc(doc(db, 'Package', editingItemId), updatedItem);
      console.log('Item updated successfully');
  

      setEditingItemId(null);
      setEditItemName('');
      setEditItemPrice('');
      setEditItemCategory('');
      setEditItemDescription('');
      setGoodForStocks('');
      setPlacesToVisit('');
      setInputFields(['']);
      setEditModeDatesAvailable(['']);
  
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };
  

  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Package'));
      const fetchedItems = [];
      querySnapshot.forEach((doc) => {
        fetchedItems.push({ id: doc.id, ...doc.data() });
      });
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const uploadImage = async (file) => {
    try {
      const storageRef = ref(storage, 'images/' + file.name);
      const snapshot = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const addItem = async () => {
    try {
     
      if (!itemName || !itemPrice || (!itemCategory && !newCategory) || !itemDescription || !image || !addModeDatesAvailable) {
        alert('Please fill out all required fields');
        return;
      }

      const imageUrl = await uploadImage(image);
      const categoryToAdd = newCategory ? newCategory : itemCategory;
      const newItem = {
        name: itemName,
        price: parseFloat(itemPrice),
        category: categoryToAdd,
        description: itemDescription,
        imageUrl: imageUrl,
        inputs: inputFields,
        datesAvailable: addModeDatesAvailable,
        goodForStocks: parseInt(goodForStocks),
        placesToVisit: placesToVisit,
        note: note 
      };

      await addDoc(collection(db, 'Package'), newItem);
      console.log('Item added successfully to the database');

      if (newCategory) {
        setCategories([...categories, newCategory]);
        setNewCategory('');
      }

      setItemName('');
      setItemPrice('');
      setItemCategory('');
      setItemDescription('');
      setGoodForStocks('');
      setPlacesToVisit('');

      const fileInput = document.getElementById('file-input');
      if (fileInput) {
        fileInput.value = '';
      }

      setInputFields(['']);
      setAddModeDatesAvailable(['']);

      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'Package', id));
      console.log('Item deleted successfully');
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  

  const renderDatesAvailableInputs = () => {
    if (editingItemId !== null) {
      return (
        <div>
          <h3 className="text-lg font-bold mb-2">Dates Available</h3>
          {editModeDatesAvailable.map((date, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]} 
                onChange={(e) => handleEditDate(index, e.target.value)}
                className="border border-gray-300 rounded-md py-1 px-2 mr-2"
              />
              {index === editModeDatesAvailable.length - 1 && (
                <button onClick={handleEditAddDate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">
                  + Add Date
                </button>
              )}
              {index !== editModeDatesAvailable.length - 1 && (
                <button onClick={() => handleEditRemoveDate(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                  - Remove Date
                </button>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div>
          <h3 className="text-lg font-bold mb-2">Dates Available</h3>
          {addModeDatesAvailable.map((date, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]} 
                onChange={(e) => handleDateChange(index, e.target.value)}
                className="border border-gray-300 rounded-md py-1 px-2 mr-2"
              />
              {index === addModeDatesAvailable.length - 1 && (
                <button onClick={handleAddDate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">
                  + Add Date
                </button>
              )}
              {index !== addModeDatesAvailable.length - 1 && (
                <button onClick={() => handleRemoveDate(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                  - Remove Date
                </button>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  const renderInputFields = () => {
    return (
      <div>
        <h3 className="text-lg font-bold mb-2">Highlights</h3>
        {inputFields.map((input, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={input}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="border border-gray-300 rounded-md py-1 px-2 mr-2"
              placeholder="Input field"
            />
            {index === inputFields.length - 1 && (
              <button onClick={handleAddInput} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded">
                + Add Highlights
              </button>
            )}
            {index !== inputFields.length - 1 && (
              <button onClick={() => handleRemoveInput(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">
                - Remove Highlights
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="package-management    ml-12 ">
      <h1 className="text-2xl font-bold mb-4">Package Management</h1>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Add Item</h2>
        <div className="mb-2">
          <label className="block font-bold mb-1">Item Name:</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-2"
          />
        </div>
        <div className="mb-2">
          <label className="block font-bold mb-1">Item Price:</label>
          <input
            type="number"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-2"
          />
        </div>
        <div className="mb-2">
          <label className="block font-bold mb-1">Category:</label>
          <div className="flex">
            <select
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              className="border border-gray-300 rounded-md py-1 px-2 mr-2"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border border-gray-300 rounded-md py-1 px-2"
            />
          </div>
        </div>
        <div className="mb-2">
          <label className="block font-bold mb-1">Item Description:</label>
          <textarea
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-2"
          />
        </div>
        <div className="mb-2">
          <label className="block font-bold mb-1">Image:</label>
          <input
            id="file-input"
            type="file"
            onChange={handleImageChange}
            className="border border-gray-300 rounded-md py-1 px-2"
          />
        </div>
        {renderDatesAvailableInputs()}
        {renderInputFields()}
        <div className="mb-2">
          <label className="block font-bold mb-1">Good For Stocks:</label>
          <input
            type="number"
            value={goodForStocks}
            onChange={(e) => setGoodForStocks(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-2"
          />
        </div>
        <div className="mb-2">
          <label className="block font-bold mb-1">Places to Visit:</label>
          <textarea
            value={placesToVisit}
            onChange={(e) => setPlacesToVisit(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-2"
          />
        </div>
        <div className="mb-2">
          <label className="block font-bold mb-1">Note:</label>
          <textarea
            value={note}
            onChange={(e) => handleNoteChange(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-2"
          />
        </div>
        <button onClick={addItem} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Add Item
        </button>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Items</h2>
        {items.map((item) => (
          <div key={item.id} className="border border-gray-300 rounded-md p-4 mb-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                <p className="text-gray-700 mb-1">Price: ${item.price}</p>
                <p className="text-gray-700 mb-1">Category: {item.category}</p>
                <p className="text-gray-700 mb-1">Description: {item.description}</p>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover mb-1" />
                )}
                {item.datesAvailable && (
                  <div>
                    <h4 className="font-bold">Dates Available:</h4>
                    <ul>
                      {item.datesAvailable.map((date, index) => (
                        <li key={index}>{date}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.inputs && (
                  <div>
                    <h4 className="font-bold">Highlights :</h4>
                    <ul>
                      {item.inputs.map((input, index) => (
                        <li key={index}>{input}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-gray-700 mb-1">Good For Stocks: {item.goodForStocks}</p>
                <p className="text-gray-700 mb-1">Places to Visit: {item.placesToVisit}</p>
                <p className="text-gray-700 mb-1">Note: {item.note}</p>
              </div>
              <div>
                <button
       onClick={() => handleEditItem(item)} 
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2"
    >
    Edit
   </button>
                  <button
                  onClick={() => deleteItem(item.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editingItemId && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Edit Item</h2>
          <div className="mb-2">
            <label className="block font-bold mb-1">Item Name:</label>
            <input
              type="text"
              value={editItemName}
              onChange={(e) => setEditItemName(e.target.value)}
              className="border border-gray-300 rounded-md py-1 px-2"
            />
          </div>
          <div className="mb-2">
            <label className="block font-bold mb-1">Item Price:</label>
            <input
              type="number"
              value={editItemPrice}
              onChange={(e) => setEditItemPrice(e.target.value)}
              className="border border-gray-300 rounded-md py-1 px-2"
            />
          </div>
          <div className="mb-2">
            <label className="block font-bold mb-1">Category:</label>
            <div className="flex">
              <select
                value={editItemCategory}
                onChange={(e) => setEditItemCategory(e.target.value)}
                className="border border-gray-300 rounded-md py-1 px-2 mr-2"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Add new category"
                value={editItemCategory}
                onChange={(e) => setEditNewCategory(e.target.value)}
                className="border border-gray-300 rounded-md py-1 px-2"
              />
            </div>
          </div>
          <div className="mb-2">
            <label className="block font-bold mb-1">Item Description:</label>
            <textarea
              value={editItemDescription}
              onChange={(e) => setEditItemDescription(e.target.value)}
              className="border border-gray-300 rounded-md py-1 px-2"
            />
          </div>
          <div className="mb-2">
            <label className="block font-bold mb-1">Image:</label>
            <input
              id="file-input"
              type="file"
              onChange={handleImageChange}
              className="border border-gray-300 rounded-md py-1 px-2"
            />
          </div>
          {renderDatesAvailableInputs()}
          {renderInputFields()}
          <div className="mb-2">
            <label className="block font-bold mb-1">Good For Stocks:</label>
            <input
              type="number"
              value={goodForStocks}
              onChange={(e) => setGoodForStocks(e.target.value)}
              className="border border-gray-300 rounded-md py-1 px-2"
            />
          </div>
          <div className="mb-2">
            <label className="block font-bold mb-1">Places to Visit:</label>
            <textarea
              value={placesToVisit}
              onChange={(e) => SetPlacesToVisit(e.target.value)}
              className="border border-gray-300 rounded-md py-1 px-2"
            />
          </div>
          <div className="mb-2">
            <label className="block font-bold mb-1">Note:</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border border-gray-300 rounded-md py-1 px-2"
            />
          </div>
          <button onClick={updateItem} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Update Item
          </button>
        </div>
      )}
    </div>
  );
};

export default Package;
