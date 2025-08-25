type SortOption = {
  label: string;
  sort: "new" | "price";
  order: "asc" | "desc";
};

const options: SortOption[] = [
  { label: "Newest", sort: "new", order: "desc" },
  { label: "Oldest", sort: "new", order: "asc" },
  { label: "Price: Low → High", sort: "price", order: "asc" },
  { label: "Price: High → Low", sort: "price", order: "desc" },
];

export default function ShopSort({
  sort,
  order,
  onChange,
}: {
  sort: string;
  order: string;
  onChange: (sort: SortOption["sort"], order: SortOption["order"]) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-gray-600 dark:text-gray-300">
        Sort by:
      </label>
      <select
        id="sort-select"
        className="border px-3 py-2 rounded-md text-sm dark:bg-gray-800 dark:text-white"
        value={`${sort}|${order}`}
        onChange={(e) => {
          const [s, o] = e.target.value.split("|");
          onChange(s as SortOption["sort"], o as SortOption["order"]);
        }}
      >
        {options.map((opt) => (
          <option key={opt.label} value={`${opt.sort}|${opt.order}`}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
