import ProductCard from "../components/ProductCard";

const mockProducts = [
  {
    id: 1,
    name: "EcoTower Pro",
    price: 199.99,
    creator: {
      id: "user1",
      name: "Matthew",
      profileImage: "https://via.placeholder.com/40x40", // placeholder profile image
    },
    imageUrl: "https://via.placeholder.com/300x200",
  },
  {
    id: 2,
    name: "Herb Module",
    price: 49.99,
    creator: {
      id: "user2",
      name: "Grace",
      profileImage: "https://via.placeholder.com/40x40",
    },
    imageUrl: "https://via.placeholder.com/300x200",
  },
];

export default function Shop() {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {mockProducts.map((p) => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}
