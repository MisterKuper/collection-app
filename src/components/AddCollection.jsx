import React, { useState } from "react";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddCollection = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const colors = [
    { name: "Red", code: "#FF2056" },
    { name: "Green", code: "#00C950" },
    { name: "Blue", code: "#00A6F4" },
    { name: "Yellow", code: "#FDC700" },
    { name: "Purple", code: "#AD46FF" },
    { name: "Orange", code: "#FF6900" },
  ];

  const defaultColor = colors[0].code;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Пожалуйста, укажите название коллекции.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "collections"), {
        name,
        color: color || defaultColor,
      });

      navigate("/home");
    } catch (error) {
      setError("Ошибка при создании коллекции. Попробуйте снова.");
      console.error("Ошибка при создании коллекции: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/home");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Create Collection</h2>

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>

            {/* COLLECTION NAME */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-medium mb-2">
              Collection Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* COLLECTION COLOR */}
          <div className="mb-6">
            <label htmlFor="color" className="block text-lg font-medium mb-2">
              Color:
            </label>
            <div className="flex gap-3">
              {colors.map((colorOption) => (
                <div
                  key={colorOption.code}
                  className={`p-3 rounded-full cursor-pointer transition-all duration-200 ${
                    color === colorOption.code ? "ring-4 ring-white" : ""
                  }`}
                  style={{
                    backgroundColor: colorOption.code,
                  }}
                  onClick={() => setColor(colorOption.code)}
                />
              ))}
            </div>
          </div>
          
          {/* CREATE btn */}
          <div className="flex justify-between items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white font-semibold rounded-lg ${
                loading
                  ? "bg-gray-400"
                  : "bg-amber-500 hover:bg-amber-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500"
              }`}
            >
              {loading ? "Saving..." : "Create"}
            </button>

            {/* CANCEL btn */}
            <button
              type="button"
              onClick={handleCancel}
              className="w-full py-3 text-red-500 font-semibold border border-red-500 rounded-lg hover:bg-red-500 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCollection;
