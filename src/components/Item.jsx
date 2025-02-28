import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

const Item = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Для перехода назад

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "items", itemId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setItem(docSnap.data());
        } else {
          console.log("Такого предмета нет!");
        }
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  if (loading) return <p className="loading">Загрузка...</p>;
  if (!item) return <p className="error">Ошибка: предмет не найден!</p>;

  return (
    <div className="item-container">
      {/* Кнопка "Назад" */}
      <button className="back-button" onClick={() => navigate(`/collection/${item.collectionId}`)}>
        ← Вернуться в коллекцию
      </button>

      {/* Заголовок с цветным фоном */}
      <div className="item-header" style={{ backgroundColor: item.color || "#ccc" }}>
        <h2>{item.name}</h2>
      </div>

      {/* Основная информация */}
      <div className="item-content">
        {item.image ? (
          <img src={item.image} alt={item.name} className="item-image" />
        ) : (
          <div className="no-image">Нет изображения</div>
        )}

        <div className="item-info">
          <p className="item-description">{item.description || "Описание отсутствует."}</p>
          {item.date && <p><strong>Дата:</strong> {item.date}</p>}
          {item.price && <p><strong>Цена:</strong> {item.price} руб.</p>}
        </div>
      </div>

      {/* Дополнительная информация */}
      {item.additionalInformation && item.additionalInformation.length > 0 && (
        <div className="additional-info">
          <h3>Дополнительные сведения</h3>
          {item.additionalInformation.map((info, index) => (
            <div key={index} className="info-block">
              <h4>{info.subtitle}</h4>
              <p>{info.subtitleText}</p>
              {info.subtitleImage && <img src={info.subtitleImage} alt={info.subtitle} className="info-image" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Item;
