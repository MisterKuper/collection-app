import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  
  const [isRegistering, setIsRegistering] = useState(false); // Переключение между входом и регистрацией
  const navigate = useNavigate();

  console.log(auth?.currentUser?.email);

  // Регистрация нового пользователя
  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/home"); // Перенаправление на главную
    } catch (error) {
      console.error(error);
    }
  };

  // Вход в аккаунт
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home"); // Перенаправление на главную
    } catch (error) {
      console.error(error);
    }
  };

  // Вход через Google
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home"); // Перенаправление на главную
    } catch (error) {
      console.error(error);
    }
  };

  // Выход из аккаунта
  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Возвращаемся на страницу входа
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isRegistering ? "Регистрация" : "Вход"}</h2>

      <input
        type="email"
        placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль..."
        onChange={(e) => setPassword(e.target.value)}
      />

      {isRegistering ? (
        <button onClick={register}>Зарегистрироваться</button>
      ) : (
        <button onClick={login}>Войти</button>
      )}

      <button onClick={signInWithGoogle}>Войти через Google</button>

      <p onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
      </p>
    </div>
  );
};

export default Auth;
