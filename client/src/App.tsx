// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// Placeholder pages
const About = () => <h1>About Page</h1>;
const Shop = () => <h1>Shop / Forum</h1>;
const Library = () => <h1>Library</h1>;
const Favorites = () => <h1>Favorites</h1>;
const Following = () => <h1>Following</h1>;
const Cart = () => <h1>Shopping Cart</h1>;
const Login = () => <h1>Login Page</h1>;
const Home = () => <h1>Welcome to EcoTier Solutions</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/library" element={<Library />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/following" element={<Following />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;