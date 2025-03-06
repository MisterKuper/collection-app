import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

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

// bg color defining
const hexToRgba = (hex, alpha) => {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Item = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [collectionColor, setCollectionColor] = useState("#f3f4f6");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "items", itemId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setItem(data);
          // if data exists, inherit color
          if (data.collectionId) {
            const collRef = doc(db, "collections", data.collectionId);
            const collSnap = await getDoc(collRef);
            if (collSnap.exists()) {
              const collData = collSnap.data();
              setCollectionColor(collData.color || "#f3f4f6");
            }
          }
        } else {
          console.log("Item not found!");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteDoc(doc(db, "items", itemId));
      alert("Item deleted successfully!");
      navigate(`/collection/${item.collectionId}`);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item.");
    }
  };

  // LOADING SCREEN
  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="mb-2 text-center text-gray-700">Loading...</div>
          <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <p className="text-center text-red-500 text-lg mt-10">
        Error: item not found!
      </p>
    );
  }

  const itemStatusText = item.conditionValue || "Custom";
  const itemStatusClass = statusStyles[itemStatusText] || statusStyles["Custom"];

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6 relative"
      style={{ backgroundColor: hexToRgba(collectionColor, 0.4) }} // set bg color
    >
      {/* GO BACK btn */}
      <button
        className="fixed top-6 left-6 p-2 bg-white rounded-full shadow-md hover:bg-amber-500 transition duration-300"
        onClick={() => navigate(`/collection/${item.collectionId}`)}
      >
        <img src={assets.arrow_icon} alt="Go Back" className="w-10 h-10" />
      </button>

      {/* DELETE btn */}
      <button
        onClick={handleDelete}
        className="fixed top-6 right-6 p-3 bg-white rounded-full shadow-md hover:bg-red-500 transition duration-300"
      >
        <img src={assets.delete_icon} alt="Delete" className="w-8 h-8" />
      </button>

      {/* EDIT btn */}
      <button
        onClick={() => navigate(`/edit-item/${itemId}`)}
        className="fixed bottom-6 right-6 p-3 bg-white rounded-full shadow-md hover:bg-blue-400 transition duration-300"
      >
        <img src={assets.edit_icon} alt="Edit" className="w-8 h-8" />
      </button>

      <div className="relative w-full max-w-3xl bg-white shadow-xl rounded-lg p-6 mt-20">
        <h2 className="mb-4 pb-2 border-b border-gray-200 text-3xl font-bold break-words">
          {item.name}
        </h2>

        {/* Main image and condition type */}
        <div className="p-3 ml-6 float-right flex flex-col">
          {item.imageUrl ? (
            <div className="flex flex-col items-center">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-64 rounded-lg shadow-md"
              />
              {item.imageDescription && (
                <p className="text-gray-600 mt-2 text-center">
                  {item.imageDescription}
                </p>
              )}
            </div>
          ) : (
            <div className="w-64 h-64 flex items-center justify-center bg-gray-200 rounded-lg shadow-md">
              <p className="text-gray-500">No image</p>
            </div>
          )}
          <div className="mt-4 px-4 py-2 text-xl font-semibold">
            <p className="pt-5 border-t border-gray-400">
              Condition Type: <span className={`${itemStatusClass}`}>{itemStatusText}</span>
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="text-gray-700">
          <p className="text-lg">
            {item.description || "Description not available."}
          </p>
        </div>
      </div>

      {item.additionalInformation && item.additionalInformation.length > 0 && (
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-6 mt-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Additional Information
          </h3>

          {item.additionalInformation.map((info, index) => (
            <div key={index} className="border-t border-gray-200 pt-4 mt-4">
              {info.title && (
                <h4 className="text-xl text-gray-800 font-bold">
                  {info.title}
                </h4>
              )}
              {info.text && (
                <p className="text-lg text-gray-700 mt-2">{info.text}</p>
              )}
              {info.imageUrl && (
                <div className="mt-4 flex flex-col items-center">
                  <img
                    src={info.imageUrl}
                    alt={info.imageDescription || info.title}
                    className="w-1/2 rounded-lg shadow-md"
                  />
                  {info.imageDescription && (
                    <p className="text-gray-600 italic underline mt-2">
                      {info.imageDescription}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Item;
