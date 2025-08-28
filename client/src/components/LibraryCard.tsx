// client/src/components/LibraryCard.tsx
import type { Product } from "../../../shared/types/product";

type Props = {
  product: Product;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function LibraryCard({ product, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col">
      {/* Product image */}
      <img
        src={product.imageURL || "/placeholder.png"}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md mb-3"
      />

      {/* Name + Public/Private */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {product.name}
      </h2>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {product.public ? "Public" : "Private"}
      </p>

      {/* Last updated (simple date string) */}
      <p className="text-xs text-gray-400 mb-2">
        Updated {new Date(product.updateTime).toLocaleDateString()}
      </p>

      {/* Buttons */}
      <div className="mt-auto flex gap-2">
        <button
          onClick={() => onEdit(product.productID)}
          className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product.productID)}
          className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
