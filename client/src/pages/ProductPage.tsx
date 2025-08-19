// src/pages/ProductPage.tsx
import { useParams } from "react-router-dom";

export default function ProductPage() {
  const { id } = useParams(); // Grab product ID from the URL

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Product Details</h1>
      <p className="mt-2 text-gray-600">
        This is a placeholder page for product <span className="font-mono">{id}</span>.
      </p>
      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
        <p>Product image goes here</p>
        <p>Product description goes here</p>
        <p>Price goes here</p>
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
