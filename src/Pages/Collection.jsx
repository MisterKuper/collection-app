import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const Collection = () => {
  const { collectionId } = useParams();
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      const q = query(
        collection(db, "items"),
        where("collectionId", "==", collectionId)
      );
      const data = await getDocs(q);
      setItems(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    fetchItems();
  }, [collectionId]);

  return (
    <div className="collection-container">
      <button
        className="back-button"
        onClick={() => navigate(`/home`)}
      >
        ← Вернуться на главную страницу
      </button>
      <h2>Предметы коллекции</h2>
      <button onClick={() => navigate(`/add-item/${collectionId}`)}>
        Добавить предмет
      </button>
      <div className="item-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className="item-box"
            onClick={() => navigate(`/item/${item.id}`)}
          >
            <h3>{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collection;
