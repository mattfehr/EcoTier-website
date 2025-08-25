import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { routes } from "./utils/routes";

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
          <Route index element={<Home />} />
          <Route path={routes.shop} element={<Shop />} />
          <Route path={routes.library} element={<Library />} />
          <Route path={routes.favorites} element={<Favorites />} />
          <Route path={routes.following} element={<Following />} />
          <Route path={routes.cart} element={<Cart />} />
          <Route path={routes.login} element={<Login />} />
          <Route path={routes.faq} element={<FAQ />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="user/:id" element={<UserPage />} />
          <Route path="*" element={<Navigate to={routes.home} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
