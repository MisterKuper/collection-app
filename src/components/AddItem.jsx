import React, { useState } from "react";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const AddItem = () => {
  const { collectionId } = useParams();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [conditionType, setConditionType] = useState("");
  const [conditionValue, setConditionValue] = useState("");
  const [additionalInformation, setAdditionalInformation] = useState([{ title: "", text: "", imageUrl: "", imageDescription: "" }]);
  const navigate = useNavigate();

  const handleAddInfo = () => {
    setAdditionalInformation([...additionalInformation, { title: "", text: "", imageUrl: "", imageDescription: "" }]);
  };

  const handleRemoveInfo = (index) => {
    setAdditionalInformation(additionalInformation.filter((_, i) => i !== index));
  };

  const handleInfoChange = (index, field, event) => {
    setAdditionalInformation(
      additionalInformation.map((info, i) => (i === index ? { ...info, [field]: event.target.value } : info))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !imageUrl || !description || !conditionType || !conditionValue) {
      alert("All fields are required!");
      return;
    }

    try {
      await addDoc(collection(db, "items"), {
        name,
        imageUrl,
        description,
        conditionType,
        conditionValue, 
        collectionId,
        additionalInformation,
      });

      navigate(`/collection/${collectionId}`);
    } catch (error) {
      console.error("Error adding item: ", error);
    }
  };

  const handleCancel = () => {
    navigate(`/collection/${collectionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add item to collection</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ITEM NAME */}
          <div>
            <label className="block text-gray-700 font-semibold">Item Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter the name"
              required
              className="w-full p-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-white"
            />
          </div>

          {/* MAIN IAMGE  */}
          <div>
            <label className="block text-gray-700 font-semibold">Main Image:</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              required
              className="w-full p-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-white"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-gray-700 font-semibold">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description"
              required
              className="w-full p-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-white"
            />
          </div>

          {/* CONDITION */}
          <div>
            <label className="block text-gray-700 font-semibold">Condition Type:</label>
            <select
              value={conditionType}
              onChange={(e) => setConditionType(e.target.value)}
              className="w-full p-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-white"
            >
              <option value="">Choose a condition type</option>
              <option value="conservation">Conservation status</option>
              <option value="other">Other (Custom)</option>
            </select>
          </div>

          {/* choosing condition type */}
          {conditionType === "conservation" && (
            <div>
              <label className="block text-gray-700 font-semibold">Choose Type:</label>
              <select
                value={conditionValue}
                onChange={(e) => setConditionValue(e.target.value)}
                required
                className="w-full p-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-white"
              >
                <option value="">Choose status</option>
                <option value="Least Concern">Least Concern</option>
                <option value="Near Threatened">Near Threatened</option>
                <option value="Vulnerable">Vulnerable</option>
                <option value="Endangered">Endangered</option>
                <option value="Critically Endangered">Critically Endangered</option>
                <option value="Extinct in the Wild">Extinct in the Wild</option>
                <option value="Extinct">Extinct</option>
              </select>
            </div>
          )}

          {/* customing condition type */}
          {conditionType === "other" && (
            <div>
              <label className="block text-gray-700 font-semibold">Custom Type:</label>
              <input
                type="text"
                value={conditionValue}
                onChange={(e) => setConditionValue(e.target.value)}
                placeholder="Enter custom value"
                className="w-full p-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-white"
              />
            </div>
          )}
          
          {/* ADDITIONAL INFO */}
          <div>
            <label className="block text-gray-700 font-semibold">Additional Information:</label>
            {additionalInformation.map((info, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border-2 border-gray-400 shadow-sm mb-4">
                
                {/* TITLE */}
                <input
                  type="text"
                  value={info.title}
                  onChange={(e) => handleInfoChange(index, "title", e)}
                  placeholder={`Title ${index + 1}`}
                  required
                  className="w-full p-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-white mb-2"
                />

                {/* TEXT */}
                <textarea
                  value={info.text}
                  onChange={(e) => handleInfoChange(index, "text", e)}
                  placeholder={`Text ${index + 1}`}
                  required
                  className="w-full p-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-white mb-2"
                />

                {/* IMAGE */}
                <input
                  type="text"
                  value={info.imageUrl}
                  onChange={(e) => handleInfoChange(index, "imageUrl", e)}
                  placeholder={`Image link ${index + 1}`}
                  className="w-full p-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-white mb-2"
                />

                {/* IMAGE TITLE */}
                <input
                  type="text"
                  value={info.imageDescription}
                  onChange={(e) => handleInfoChange(index, "imageDescription", e)}
                  placeholder={`Title for image ${index + 1}`}
                  className="w-full p-2 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-white mb-2"
                />

                {/* DELETE btn */}
                <button
                  type="button"
                  onClick={() => handleRemoveInfo(index)}
                  className="w-full bg-red-500 text-white font-semibold p-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete block
                </button>
              </div>
            ))}

            {/* ADD ADDITIONAL INFO btn */}
            <button
              type="button"
              onClick={handleAddInfo}
              className="w-full bg-blue-500 text-white font-semibold p-2 rounded-lg hover:bg-blue-600 transition"
            >
              Add additional information
            </button>
          </div>

          {/* SAVE btn */}
          <div className="flex justify-between">
            <button type="submit" className="bg-amber-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-600 transition">
              Save
            </button>

            {/* CANCEL btn */}
            <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-400 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
