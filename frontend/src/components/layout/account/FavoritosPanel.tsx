"use client";

import React from 'react';
import { HeartIcon, PizzaIcon, HamburgerIcon } from '@/components/icons';

const FavoritosPanel: React.FC = () => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Favoritos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4">
          <PizzaIcon size={48} className="text-primary-600" weight="fill" />
          <div>
            <p className="font-medium">Pizza Napolitana</p>
            <p className="text-sm text-gray-600">Masa delgada, extra queso</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg flex items-center gap-4">
          <HamburgerIcon size={48} className="text-primary-600" weight="fill" />
          <div>
            <p className="font-medium">Hamburguesa BBQ Bacon</p>
            <p className="text-sm text-gray-600">Con doble bacon y queso cheddar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritosPanel;
