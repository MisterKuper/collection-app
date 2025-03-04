import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";

const Home = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCollection, setEditingCollection] = useState(null);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("");
  const navigate = useNavigate();

  const colorOptions = [
    "#FF2056",
    "#00C950",
    "#00A6F4",
    "#FDC700",
    "#AD46FF",
    "#FF6900",
  ];

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    const fetchCollections = async () => {
      const data = await getDocs(collection(db, "collections"));
      setCollections(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    };
    fetchCollections();
  }, []);

  const handleEdit = (collectionId, name, color) => {
    setEditingCollection(collectionId);
    setNewName(name);
    setNewColor(color);
  };

  const handleSaveChanges = async (collectionId) => {
    if (!newName) {
      alert("The name is required.");
      return;
    }

    const collectionRef = doc(db, "collections", collectionId);
    try {
      await updateDoc(collectionRef, {
        name: newName,
        color: newColor,
      });
      setCollections(
        collections.map((col) =>
          col.id === collectionId
            ? { ...col, name: newName, color: newColor }
            : col
        )
      );
      setEditingCollection(null);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleDelete = async (collectionId) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      setLoading(true);
      try {
        const batch = writeBatch(db);
        const itemsQuery = query(
          collection(db, "items"),
          where("collectionId", "==", collectionId)
        );
        const itemsSnapshot = await getDocs(itemsQuery);

        itemsSnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        const collectionRef = doc(db, "collections", collectionId);
        batch.delete(collectionRef);

        await batch.commit();

        setCollections(collections.filter((col) => col.id !== collectionId));

        console.log(
          "The collection and related objects were deleted successfully."
        );

        navigate("/home");
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCollectionClick = (collectionId) => {
    if (editingCollection === null) {
      navigate(`/collection/${collectionId}`);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="mb-2 text-center text-gray-700">Loading...</div>
          <div className="w-16 h-16 border-8 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 relative">
      <div className="w-full max-w-7xl bg-white border-2 border-none rounded-lg shadow-2xl p-6">
        <button
          onClick={logout}
          className="absolute top-6 right-6 bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition duration-300"
        >
          Sign Out
        </button>

        <button
          onClick={() => navigate("/add-collection")}
          className="absolute bottom-12 right-6 rounded-full hover:shadow-2xl transition duration-300"
        >
          <img src={assets.add_icon} alt="add" className="w-22 h-22" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5">
          {collections.map((col) => (
            <div
              key={col.id}
              className="relative rounded-lg shadow-lg p-6 bg-white cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300"
              style={{
                backgroundColor: col.color || "#fff",
              }}
              onClick={() => handleCollectionClick(col.id)}
            >
              {editingCollection === col.id ? (
                <div className="space-y-5">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Collection name..."
                    className="w-full px-4 py-2 border border-none rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <div className="flex bg-white ml-3.5 mr-3.5 rounded-lg place-content-center gap-x-2">
                    {colorOptions.map((color) => (
                      <div
                        key={color}
                        className={`p-2.5  rounded-full cursor-pointer transition-all duration-200
            ${newColor === color ? "ring-3 ring-white" : ""}
            hover:scale-140`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewColor(color)}
                      />
                    ))}
                  </div>

                  <div className="flex justify-between mt-10">
                    <button
                      onClick={() => handleSaveChanges(col.id)}
                      className="bg-lime-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-lime-500 hover:scale-110 transition duration-300"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCollection(null)}
                      className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 hover:scale-110 transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold break-words overflow-hidden">
                    {col.name}
                  </h3>
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(col.id, col.name, col.color);
                      }}
                      className="bg-white text-gray-800 p-3 rounded-full shadow-md transition duration-300 hover:bg-gray-200"
                    >
                      <img
                        src={assets.edit_icon}
                        alt="Edit"
                        className="w-6 h-6"
                      />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(col.id);
                      }}
                      className="bg-white text-gray-800 p-3 rounded-full shadow-md transition duration-300 hover:bg-gray-200"
                    >
                      <img
                        src={assets.delete_icon}
                        alt="Delete"
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
