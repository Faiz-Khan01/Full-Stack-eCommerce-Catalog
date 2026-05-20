const CategoryFilter = ({
  categories = [],
  selectedCategory,
  onSelect,
}) => {
  return (
    <select
      className="form-select"
      value={selectedCategory || ""}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">All Categories</option>

      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;