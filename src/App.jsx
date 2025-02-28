import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth";
import Home from "./Pages/Home";
import Collection from "./Pages/Collection";
import Item from "./components/Item";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/collection/:collectionId" element={<Collection />} />
        <Route path="/item/:itemId" element={<Item />} />
      </Routes>
    </Router>
  );
}

export default App;
