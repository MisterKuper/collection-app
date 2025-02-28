import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const Home = () => {
  const [collections, setCollections] = useState([]);
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  useEffect(() => {
    const fetchCollections = async () => {
      const data = await getDocs(collection(db, "collections"));
      setCollections(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchCollections();
  }, []);

  return (
    <div className="home-container">
      <h2>Добро пожаловать, {auth?.currentUser?.email}</h2>
      <button onClick={logout}>Выйти</button>

      <h2>Мои коллекции</h2>
      <button onClick={() => navigate("/add-collection")}>
        Добавить коллекцию
      </button>
      <div className="collection-grid">
        {collections.map((col) => (
          <div
            key={col.id}
            className="collection-box"
            onClick={() => navigate(`/collection/${col.id}`)}
            style={{ backgroundColor: col.color }} // Устанавливаем цвет фона
          >
            <h3>{col.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
