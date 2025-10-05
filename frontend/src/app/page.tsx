'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingCart } from '@/components/layout/FloatingCart';
import { ProductCard } from '@/components/ui/Card';
import { PizzaIcon, HamburgerIcon } from '@/components/icons';
import { Producto, ProductCategory } from '@/types/producto.types';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('hamburguesas');

  const categories: ProductCategory[] = ['hamburguesas', 'pizzas', 'acompañamientos', 'bebidas'];

  const hamburguesas: Producto[] = [
    {
      id: 1,
      name: 'Clásica Deluxe',
      price: 450,
      description: 'Carne premium, queso cheddar doble, lechuga, tomate, cebolla caramelizada y nuestra salsa especial',
      badge: { text: '¡Nueva!', color: 'bg-primary-600' }
    },
    {
      id: 2,
      name: 'BBQ Bacon',
      price: 520,
      description: 'Carne premium, bacon crocante, queso cheddar, aros de cebolla y salsa BBQ ahumada',
      badge: { text: 'Popular', color: 'bg-orange-500' }
    },
    {
      id: 3,
      name: 'Mega Cheese',
      price: 480,
      description: 'Doble carne, triple queso (cheddar, mozzarella y azul), cebolla grillada y salsa de queso',
    },
    {
      id: 4,
      name: 'Picante Extreme',
      price: 490,
      description: 'Carne premium, jalapeños, queso pepper jack, salsa picante y cebolla morada',
      badge: { text: 'Picante 🌶️', color: 'bg-red-600' }
    },
  ];

  const pizzas: Producto[] = [
    {
      id: 5,
      name: 'Napolitana',
      price: 580,
      description: 'Salsa de tomate, mozzarella fresca, albahaca, tomates cherry y aceite de oliva',
      badge: { text: 'Clásica', color: 'bg-blue-600' }
    },
    {
      id: 6,
      name: 'Pepperoni XL',
      price: 620,
      description: 'Doble pepperoni, mozzarella, orégano y borde relleno de queso',
      badge: { text: '¡Nueva!', color: 'bg-primary-600' }
    },
    {
      id: 7,
      name: 'Cuatro Quesos',
      price: 650,
      description: 'Mozzarella, gorgonzola, parmesano, provolone y miel de trufa',
    },
    {
      id: 8,
      name: 'Carnívora',
      price: 680,
      description: 'Pepperoni, salchicha italiana, jamón, bacon y carne molida',
      badge: { text: 'Popular', color: 'bg-orange-500' }
    },
  ];

  const renderProducts = () => {
    if (activeCategory === 'hamburguesas') {
      return (
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <HamburgerIcon size={36} weight="fill" className="text-primary-600" />
            Hamburguesas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {hamburguesas.map((item, index) => (
              <ProductCard
                key={item.id}
                name={item.name}
                price={item.price}
                description={item.description}
                icon={<HamburgerIcon size={80} weight="fill" className="text-primary-600" />}
                badge={item.badge}
                animationDelay={index * 100}
              />
            ))}
          </div>
        </section>
      );
    }

    if (activeCategory === 'pizzas') {
      return (
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <PizzaIcon size={36} weight="fill" className="text-primary-600" />
            Pizzas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {pizzas.map((item, index) => (
              <ProductCard
                key={item.id}
                name={item.name}
                price={item.price}
                description={item.description}
                icon={<PizzaIcon size={80} weight="fill" className="text-primary-600" />}
                badge={item.badge}
                animationDelay={index * 100}
              />
            ))}
          </div>
        </section>
      );
    }

    return (
      <div className="text-center py-20">
        <p className="text-2xl text-gray-500">Próximamente: {activeCategory}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navbar 
        activeCategory={activeCategory}
        onCategoryChange={(cat) => setActiveCategory(cat as ProductCategory)}
        categories={categories}
      />
      <main className="max-w-7xl mx-auto px-5 py-10">
        {renderProducts()}
      </main>
      <Footer />
      <FloatingCart itemCount={0} />
    </div>
  );
}