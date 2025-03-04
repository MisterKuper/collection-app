import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/Auth";
import Home from "./Pages/Home";
import Collection from "./Pages/Collection";
import Item from "./components/Item";
import AddCollection from "./components/AddCollection";
import AddItem from "./components/AddItem";
import EditItem from "./components/EditItem";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/collection/:collectionId" element={<Collection />} />
        <Route path="/item/:itemId" element={<Item />} />
        <Route path="/add-collection" element={<AddCollection />} />
        <Route path="/add-item/:collectionId" element={<AddItem />} />
        <Route path="/edit-item/:itemId" element={<EditItem />} />
      </Routes>
    </Router>
  );
}

export default App;
