import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from '../assets/assets.js';

const Collection = () => {
  const { collectionId } = useParams();
  const [items, setItems] = useState([]);
  const [collectionColor, setCollectionColor] = useState("#f3f4f6");
  const [collectionName, setCollectionName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollectionData = async () => {
      const collectionRef = doc(db, "collections", collectionId);
      const collectionSnap = await getDoc(collectionRef);

      if (collectionSnap.exists()) {
        const collectionData = collectionSnap.data();
        setCollectionColor(collectionData.color || "#f3f4f6");
        setCollectionName(collectionData.name || "Unnamed Collection"); 
      }
    };

    const fetchItems = async () => {
      const q = query(
        collection(db, "items"),
        where("collectionId", "==", collectionId)
      );
      const data = await getDocs(q);
      setItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    fetchCollectionData();
    fetchItems();
  }, [collectionId]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-lg p-6">
        <button
          className="w-15 mb-6 px-2 py-2 bg-white rounded-full hover:bg-amber-500 transition duration-300"
          onClick={() => navigate("/home")}
        >
          <img src={assets.arrow_icon} alt="Go Back" />
        </button>

        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          {collectionName} 
        </h2>

        <div className="flex justify-center mb-6">
          <button
            className="mb-15 px-5 py-3 text-white bg-amber-500 font-semibold rounded-lg hover:bg-amber-600 transition duration-300"
            onClick={() => navigate(`/add-item/${collectionId}`)}
          >
            + Add Item
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="shadow-lg rounded-lg p-4 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/item/${item.id}`)}
                style={{ backgroundColor: collectionColor }}
              >
                <img
                  src={item.imageUrl || assets.placeholder_image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-md"
                />
                <h3 className="text-lg font-semibold text-center mt-3  break-words overflow-hidden">
                  {item.name}
                </h3>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              There are no items in this collection yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
