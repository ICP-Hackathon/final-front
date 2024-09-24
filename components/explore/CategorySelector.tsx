export type CategoryKey =
  | "all"
  | "education"
  | "health & fitness"
  | "entertainment"
  | "social networking"
  | "business"
  | "developer tools"
  | "graphics & design"
  | "others";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: CategoryKey;
  setSelectedCategory: (category: CategoryKey) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="flex space-x-2 overflow-x-auto mb-6 whitespace-nowrap scrollbar-hide">
      {categories.map((category) => {
        const categoryKey = category
          .toLowerCase()
          .replace(/ & /g, " ")
          .replace(/ /g, "-") as CategoryKey;
        return (
          <button
            key={category}
            onClick={() => setSelectedCategory(categoryKey)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === categoryKey
                ? "bg-primary-900 text-white"
                : "bg-white text-primary-900 border border-primary-900"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default CategorySelector;
