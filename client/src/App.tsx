import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

// Import page components
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Library from "./pages/Library";
import Favorites from "./pages/Favorites";
import Following from "./pages/Following";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import FAQ from "./pages/FAQ";
import ProductPage from "./pages/ProductPage";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Main pages */}
          <Route index element={<Home />} /> {/* same as path="/" */}
          <Route path="shop" element={<Shop />} />
          <Route path="library" element={<Library />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="following" element={<Following />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="faq" element={<FAQ />} />

          {/* Dynamic product route */}
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="user/:id" element={<UserPage />} />

          {/* Catch-all for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
