import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { assets } from "../assets/assets.js";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  console.log(auth?.currentUser?.email);

  const register = async () => {
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      setError(error.message); 
    }
  };

  const login = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  };

  const signInWithGoogle = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/"); 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">{isRegistering ? "Register" : "Sign In"}</h2>

        <input
          type="email"
          placeholder="Email..."
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="password"
          placeholder="Password..."
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && (
          <div className="text-red-500 text-sm mb-4">
            <p>Error</p>
          </div>
        )}

        {isRegistering ? (
          <button 
            onClick={register} 
            className="w-full py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Register
          </button>
        ) : (
          <button 
            onClick={login} 
            className="w-full py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Sign In
          </button>
        )}

        <button
          onClick={signInWithGoogle}
          className="w-full py-3 mt-4 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <img src={assets.google_icon} className="text-red-500 mr-3 text-xl" />
          <span className="text-gray-700 font-semibold">Sign In with Google</span>
        </button>

        <p 
          onClick={() => setIsRegistering(!isRegistering)} 
          className="text-center text-blue-500 mt-4 cursor-pointer hover:font-semibold hover:scale-105"
        >
          {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
