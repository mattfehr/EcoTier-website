export const routes = {
  home: "/",
  shop: "/shop",
  library: "/library",
  favorites: "/favorites",
  following: "/following",
  cart: "/cart",
  login: "/login",
  faq: "/faq",
  product: (id: string | number) => `/product/${id}`,
  user: (id: string) => `/user/${id}`,
};
