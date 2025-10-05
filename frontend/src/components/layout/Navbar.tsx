'use client';

interface NavbarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export const Navbar = ({ activeCategory, onCategoryChange, categories }: NavbarProps) => {
  return (
    <>
      {/* Banner de estado */}
      <div className="bg-white border-b-2 border-primary-100 py-3 text-center">
        <p className="text-primary-600 font-semibold">
          {/* 🎉 ¡Envío gratis en pedidos mayores a $1000! */}
          Si no encuentras tu hamburguesa o pizza favorita, ¡créala tú mismo!
        </p>
      </div>

      {/* Navbar sticky */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <ul className="flex justify-center flex-wrap max-w-6xl mx-auto">
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`
                px-8 py-5 cursor-pointer font-medium transition-all duration-300 border-b-3
                ${activeCategory === category 
                  ? 'text-primary-600 border-primary-600 bg-primary-50' 
                  : 'text-gray-700 border-transparent hover:text-primary-600 hover:bg-primary-50'
                }
              `}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};