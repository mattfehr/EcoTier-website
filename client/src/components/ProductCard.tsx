import { useState } from "react";
import { Heart, ShoppingCart, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  creator: {
    id: string;
    name: string;
    profileImage: string;
  };
  imageUrl: string;
}

export default function ProductCard({
  id, //test
  name,
  price,
  creator,
  imageUrl,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="rounded-2xl shadow-md bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition">
      {/* Product Image */}
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-48 object-cover"
      />

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {name}
        </h3>

        {/* Creator Info */}
        <Link
          to={`/user/${creator.id}`}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <img
            src={creator.profileImage}
            alt={creator.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {creator.name}
          </p>
        </Link>

        {/* Price + Quantity */}
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            ${price.toFixed(2)}
          </p>
          <div className="flex items-center border rounded-xl overflow-hidden">
            <button
              className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus size={16} />
            </button>
            <span className="px-3">{quantity}</span>
            <button
              className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Actions */}
				<div className="flex justify-between mt-2">
					<button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600">
						<ShoppingCart size={18} /> Add
					</button>

					<button
						onClick={() => setIsFavorited(!isFavorited)}
						className="p-2 rounded-xl border hover:bg-gray-100 dark:hover:bg-gray-700 transition transform hover:scale-110"
					>
						<Heart
							size={18}
							className={`transition-colors duration-200 ${
								isFavorited
									? "text-red-500 fill-red-500"
									: "text-gray-500 hover:text-red-500 hover:fill-red-500"
							}`}
						/>
					</button>
				</div>
      </div>
    </div>
  );
}
