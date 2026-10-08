import { useState, useEffect } from 'react';
import { deleteProduct, loadCategories, loadProducts, saveProduct, uploadCatalogImage } from '../../../lib/catalog';

const AdminPage = () => {
  const [itemName, setItemName] = useState('');
  const [adultPrice, setAdultPrice] = useState('');
  const [seniorPrice, setSeniorPrice] = useState('');
  const [childPrice, setChildPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editItemName, setEditItemName] = useState('');
  const [editAdultPrice, setEditAdultPrice] = useState('');
  const [editSeniorPrice, setEditSeniorPrice] = useState('');
  const [editChildPrice, setEditChildPrice] = useState('');
  const [editItemCategory, setEditItemCategory] = useState('');
  const [editItemDescription, setEditItemDescription] = useState('');
  const [inputFields, setInputFields] = useState(['']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [addOns, setAddOns] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [editHighlights, setEditHighlights] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editNewCategory, setEditNewCategory] = useState('');

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await loadCategories();
      setCategories(fetchedCategories.map((category) => category.name));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleEditItem = (item) => {
    setEditingItemId(item.id);
    setEditItemName(item.name);
    setEditAdultPrice(item.adultPrice.toString());
    setEditSeniorPrice(item.seniorPrice.toString());
    setEditChildPrice(item.childPrice.toString());
    setEditItemCategory(item.category);
    setEditItemDescription(item.description);
    setInputFields(item.inputs || ['']);
    setAddOns(item.addOns || []);
    setEditHighlights(item.highlights || []);
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

  const handleAddOnsChange = (index, value, field) => {
    setAddOns((current) => current.map((addon, addonIndex) => (
      addonIndex === index ? { ...addon, [field]: value } : addon
    )));
  };

  const handleAddAddOn = () => {
    setAddOns([...addOns, { name: '', addOnsPrice: '' }]);
  };

  const handleRemoveAddOn = (index) => {
    const newAddOns = [...addOns];
    newAddOns.splice(index, 1);
    setAddOns(newAddOns);
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...highlights];
    newHighlights[index] = value;
    setHighlights(newHighlights);
  };

  const handleAddHighlight = () => {
    setHighlights([...highlights, '']);
  };

  const handleRemoveHighlight = (index) => {
    const newHighlights = [...highlights];
    newHighlights.splice(index, 1);
    setHighlights(newHighlights);
  };

  const handleEditHighlightChange = (index, value) => {
    const newEditHighlights = [...editHighlights];
    newEditHighlights[index] = value;
    setEditHighlights(newEditHighlights);
  };

  const handleAddEditHighlight = () => {
    setEditHighlights([...editHighlights, '']);
  };

  const handleRemoveEditHighlight = (index) => {
    const newEditHighlights = [...editHighlights];
    newEditHighlights.splice(index, 1);
    setEditHighlights(newEditHighlights);
  };

  const updateItem = async () => {
    try {
      const existingItem = items.find((item) => item.id === editingItemId);
      await saveProduct({
        id: editingItemId,
        name: editItemName,
        adultPrice: Number(editAdultPrice),
        seniorPrice: Number(editSeniorPrice),
        childPrice: Number(editChildPrice),
        categoryName: editNewCategory || editItemCategory,
        description: editItemDescription,
        inputs: inputFields,
        addOns,
        highlights: editHighlights,
        imageUrl: existingItem?.imageUrl,
      });
      console.log('Item updated successfully');

      setEditingItemId(null);
      setEditItemName('');
      setEditAdultPrice('');
      setEditSeniorPrice('');
      setEditChildPrice('');
      setEditItemCategory('');
      setEditItemDescription('');
      setEditHighlights([]);
      setAddOns([]);
      setEditNewCategory('');
      await Promise.all([fetchItems(), fetchCategories()]);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const fetchItems = async () => {
    try {
      setItems(await loadProducts());
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
      return await uploadCatalogImage(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const addItem = async () => {
    try {
      if (!itemName || !adultPrice || !seniorPrice || !childPrice || !itemDescription || !image) {
        alert('Please fill out all required fields');
        return;
      }
  
     
      const categoryValue = newCategory || itemCategory;
      const imageUrl = await uploadImage(image);
      await saveProduct({
        name: itemName,
        adultPrice: parseFloat(adultPrice),
        seniorPrice: parseFloat(seniorPrice),
        childPrice: parseFloat(childPrice),
        categoryName: categoryValue,
        description: itemDescription,
        imageUrl,
        inputs: inputFields,
        addOns,
        highlights: highlights,
      });
      console.log('Item added successfully to the database');
  
      setItemName('');
      setAdultPrice('');
      setSeniorPrice('');
      setChildPrice('');
      setItemCategory('');
      setItemDescription('');
  
      const fileInput = document.getElementById('file-input');
      if (fileInput) {
        fileInput.value = '';
      }
  
      setInputFields(['']);
      setAddOns([]);
      setHighlights([]);
      setNewCategory('');
  
      await Promise.all([fetchItems(), fetchCategories()]);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteProduct(id);
      console.log('Item deleted successfully');
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;
        
    return (
      <div className="container bg-white mx-auto mt-10 p-6 border rounded-lg shadow-lg h-[900px] overflow-y-scroll">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <div className="flex space-x-6">
          <div className="w-1/2">
            <div className="mb-6">
              <input
                type="file"
                id="file-input"
                onChange={handleImageChange}
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
              {image && <img src={image} alt="Item" className="mt-4 w-32 h-32 object-cover" />}
            </div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <div className="mb-6">
              <textarea
                placeholder="Item Description"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
            <div className="mb-6">
              <select
                value={itemCategory}
                onChange={(e) => {
                  setItemCategory(e.target.value);
                  setNewCategory('');
                }}
                className="border border-gray-300 rounded-md py-2 px-4 w-full mb-2"
                disabled={newCategory !== ''}
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="New Category"
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  setItemCategory('');
                }}
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
                disabled={itemCategory !== ''}
              />
            </div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Adult Price"
                value={adultPrice}
                onChange={(e) => setAdultPrice(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 w-full mb-2"
              />
              <input
                type="text"
                placeholder="Senior Price"
                value={seniorPrice}
                onChange={(e) => setSeniorPrice(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 w-full mb-2"
              />
              <input
                type="text"
                placeholder="Child Price"
                value={childPrice}
                onChange={(e) => setChildPrice(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-4 w-full"
              />
            </div>
          </div>
  
          <div className="w-1/2 space-y-6">
            
  
            <div>
              <h3 className="font-bold mb-2">Highlights</h3>
              {highlights.map((highlight, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    placeholder={`Highlight ${index + 1}`}
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    className="border border-gray-300 rounded-md py-2 px-4 mr-2 flex-1"
                  />
                  <button onClick={() => handleRemoveHighlight(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Remove
                  </button>
                </div>
              ))}
              <button onClick={handleAddHighlight} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                + Add Highlight
              </button>
            </div>

            <div>
              <h3 className="font-bold mb-2">Add-ons</h3>
              {addOns.map((addon, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Add-on name"
                    value={addon.name}
                    onChange={(event) => handleAddOnsChange(index, event.target.value, 'name')}
                    className="flex-1 rounded border border-gray-300 px-3 py-2"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    value={addon.addOnsPrice}
                    onChange={(event) => handleAddOnsChange(index, event.target.value, 'addOnsPrice')}
                    className="w-28 rounded border border-gray-300 px-3 py-2"
                  />
                  <button onClick={() => handleRemoveAddOn(index)} className="rounded bg-red-600 px-3 text-white">Remove</button>
                </div>
              ))}
              <button onClick={handleAddAddOn} className="rounded bg-blue-600 px-3 py-2 text-white">Add add-on</button>
            </div>
  
            
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button onClick={addItem} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Add Item
          </button>
        </div>



<div className="mt-10">
  <h2 className="text-xl font-bold mb-2">Edit Items</h2>
  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="border border-gray-300 rounded-md py-1 px-2 mb-2"
  >
    <option value="">All Categories</option>
    {categories.map((category, index) => (
      <option key={index} value={category}>{category}</option>
    ))}
  </select>

  {filteredItems.map((item) => (
    <div key={item.id} className="border border-gray-300 rounded-md py-2 px-4 mb-2">
      {editingItemId === item.id ? (
        <div>
          <input
            type="text"
            placeholder="Item Name"
            value={editItemName}
            onChange={(e) => setEditItemName(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-2 mb-2"
          />
          <input
            type="text"
            placeholder="Adult Price"
            value={editAdultPrice}
            onChange={(e) => setEditAdultPrice(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-2 mb-2"
          />
          <input
            type="text"
            placeholder="Senior Price"
            value={editSeniorPrice}
            onChange={(e) => setEditSeniorPrice(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-2 mb-2"
          />
          <input
            type="text"
            placeholder="Child Price"
            value={editChildPrice}
            onChange={(e) => setEditChildPrice(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-2 mb-2"
          />
          <select
            value={editItemCategory}
            onChange={(e) => setEditItemCategory(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-2 mb-2"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="New Category"
            value={editNewCategory}
            onChange={(e) => setEditNewCategory(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-2 mb-2"
          />
          <textarea
            placeholder="Item Description"
            value={editItemDescription}
            onChange={(e) => setEditItemDescription(e.target.value)}
            className="border border-gray-300 rounded-md py-1 px-2 mb-2"
          />
          <button onClick={updateItem} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Save
          </button>
          <button onClick={() => setEditingItemId(null)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>

         
           

          {editHighlights.map((highlight, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder={`Highlight ${index + 1}`}
                value={highlight}
                onChange={(e) => handleEditHighlightChange(index, e.target.value)}
                className="border border-gray-300 rounded-md py-1 px-2 mb-2"
              />
              <button onClick={() => handleRemoveEditHighlight(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                Remove
              </button>
            </div>
          ))}

          <button onClick={handleAddEditHighlight} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            + Add Highlight
          </button>
          <div className="my-3">
            <h3 className="font-bold">Add-ons</h3>
            {addOns.map((addon, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <input type="text" placeholder="Add-on name" value={addon.name} onChange={(event) => handleAddOnsChange(index, event.target.value, 'name')} className="rounded border px-2 py-1" />
                <input type="number" min="0" step="0.01" placeholder="Price" value={addon.addOnsPrice} onChange={(event) => handleAddOnsChange(index, event.target.value, 'addOnsPrice')} className="w-28 rounded border px-2 py-1" />
                <button onClick={() => handleRemoveAddOn(index)} className="rounded bg-red-600 px-2 text-white">Remove</button>
              </div>
            ))}
            <button onClick={handleAddAddOn} className="rounded bg-blue-600 px-3 py-2 text-white">Add add-on</button>
          </div>
          {inputFields.map((input, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder={`Input Field ${index + 1}`}
                value={input}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="border border-gray-300 rounded-md py-1 px-2 mb-2"
              />
              <button onClick={() => handleRemoveInput(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                Remove
              </button>
            </div>
          ))}
          <button onClick={handleAddInput} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            + Add Input Field
          </button>
        </div>
      ) : 
      
      (
        <div className="border border-gray-200 rounded-md p-4 shadow-md flex flex-col md:flex-row">
       
        <div className="md:w-1/2 md:pr-4">
  
          {item.imageUrl && <img src={item.imageUrl} alt="Uploaded" className="w-full h-auto object-cover rounded-md mb-4" />}
  
          <p className="font-semibold">Name: {item.name}</p>

          <p>Description: {item.description}</p>
    
          <p>Category: {item.category}</p>
          <p>Adult Price: {item.adultPrice}</p>
          <p>Senior Price: {item.seniorPrice}</p>
          <p>Child Price: {item.childPrice}</p>
        </div>
        
  
        <div className="md:w-1/2 md:pl-4">

          <div className="mb-4">
            <p className="font-semibold">Highlights:</p>
            {item.highlights && item.highlights.map((highlight, index) => (
              <p key={index}>{highlight}</p>
            ))}
          </div>

          {/* Edit and Delete Buttons */}
          <div className="mt-auto flex justify-end">
            <button onClick={() => handleEditItem(item)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
              Edit
            </button>
            <button onClick={() => deleteItem(item.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Delete
            </button>
          </div>
        </div>
      </div>
        
      )}
    </div>
  ))}
</div>
</div>
);
};

export default AdminPage;