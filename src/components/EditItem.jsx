import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

// defining category status styles
const statusStyles = {
  "Least Concern": "bg-emerald-800 text-white font-semibold text-lg mt-4 ml-2 px-4 py-2 rounded-full",
  "Near Threatened": "bg-emerald-800 text-emerald-400 font-semibold text-lg mt-4 ml-2 px-4 py-2 rounded-full",
  "Vulnerable": "bg-yellow-500 text-yellow-50 font-semibold text-lg mt-4 ml-2 px-4 py-2 rounded-full",
  "Endangered": "bg-yellow-500 text-red-100 font-semibold text-lg",
  "Critically Endangered": "bg-orange-500 text-red-100 font-semibold text-lg mt-4 ml-2 px-4 py-2 rounded-full",
  "Extinct in the Wild": "bg-red-600 text-white font-semibold text-lg mt-4 ml-2 px-4 py-2 rounded-full",
  "Extinct": "bg-stone-800 text-red-600 font-semibold text-lg mt-4 ml-2 px-4 py-2 rounded-full",
  "Custom": "bg-blue-500 text-sky-100 font-semibold text-lg mt-4 ml-2 px-4 py-2 rounded-full",
};

const EditItem = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [additionalInformation, setAdditionalInformation] = useState([]);  // Store additional information
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "items", itemId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setItem(data);
          setName(data.name);
          setDescription(data.description || "");
          setStatus(data.conditionValue || "Custom");
          setImageUrl(data.imageUrl || "");
          setAdditionalInformation(data.additionalInformation || []);  // Load additional information
        } else {
          console.log("Item not found!");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "items", itemId);
      await updateDoc(docRef, {
        name,
        description,
        conditionValue: status,
        imageUrl,
        additionalInformation,  // Save additional information
      });
      alert("Item updated successfully!");
      navigate(`/item/${itemId}`);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item.");
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? Changes will not be saved.")) {
      navigate(`/item/${itemId}`);
    }
  };

  const handleAddAdditionalInfo = () => {
    setAdditionalInformation([
      ...additionalInformation,
      { title: "", text: "", imageUrl: "", imageDescription: "" }, // Add imageDescription field
    ]);
  };

  const handleAdditionalInfoChange = (index, field, value) => {
    const updatedInfo = [...additionalInformation];
    updatedInfo[index][field] = value;
    setAdditionalInformation(updatedInfo);
  };

  const handleRemoveAdditionalInfo = (index) => {
    const updatedInfo = additionalInformation.filter((_, i) => i !== index);
    setAdditionalInformation(updatedInfo);
  };

  const previewImage = (url) => {
    return url ? <img src={url} alt="Preview" className="w-full max-w-xs mx-auto rounded-lg shadow-md mt-4" /> : null;
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 relative">
      <div className="relative w-full max-w-3xl bg-white shadow-xl rounded-lg p-6 mt-20">
        <h2 className="mb-4 pb-2 border-b border-gray-200 text-3xl font-bold">
          Edit Item: {item.name}
        </h2>

        {/* Form to update item */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg font-semibold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Item name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Image URL"
            />
            {previewImage(imageUrl)} {/* Preview main image */}
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold">Category</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            >
              <option value="Least Concern">Least Concern</option>
              <option value="Near Threatened">Near Threatened</option>
              <option value="Vulnerable">Vulnerable</option>
              <option value="Endangered">Endangered</option>
              <option value="Critically Endangered">Critically Endangered</option>
              <option value="Extinct in the Wild">Extinct in the Wild</option>
              <option value="Extinct">Extinct</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-lg font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              placeholder="Item description"
            />
          </div>

          {/* Additional Information */}
          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4">Additional Information</h3>
            {additionalInformation.map((info, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg border-gray-300">
                <div className="mb-4">
                  <label className="block text-lg font-semibold">Title</label>
                  <input
                    type="text"
                    value={info.title}
                    onChange={(e) =>
                      handleAdditionalInfoChange(index, "title", e.target.value)
                    }
                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    placeholder="Additional info title"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-lg font-semibold">Text</label>
                  <textarea
                    value={info.text}
                    onChange={(e) =>
                      handleAdditionalInfoChange(index, "text", e.target.value)
                    }
                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    placeholder="Additional info text"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-lg font-semibold">Image URL</label>
                  <input
                    type="text"
                    value={info.imageUrl}
                    onChange={(e) =>
                      handleAdditionalInfoChange(index, "imageUrl", e.target.value)
                    }
                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    placeholder="Image URL"
                  />
                  {previewImage(info.imageUrl)} {/* Preview additional images */}
                </div>

                <div className="mb-4">
                  <label className="block text-lg font-semibold">Image Description</label>
                  <input
                    type="text"
                    value={info.imageDescription}
                    onChange={(e) =>
                      handleAdditionalInfoChange(index, "imageDescription", e.target.value)
                    }
                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    placeholder="Image description"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveAdditionalInfo(index)}
                  className="text-red-500 mt-4 px-4 py-1 rounded-lg hover:font-semibold hover:bg-red-500 hover:text-white"
                >
                  Remove Additional Info
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAdditionalInfo}
              className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 mt-4"
            >
              Add More Information
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-10 py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>

        {/* Cancel Button */}
        <button
          onClick={handleCancel}
          className="w-full py-2 px-4 mt-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditItem;
