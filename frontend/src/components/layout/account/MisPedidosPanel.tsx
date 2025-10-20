"use client";

import React from 'react';

const MisPedidosPanel: React.FC = () => {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Mis pedidos</h3>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Pedido #1234</p>
              <p className="text-sm text-gray-600">3 items • En preparación</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">$ 560</p>
              <p className="text-sm text-gray-600">Hoy</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Pedido #1229</p>
              <p className="text-sm text-gray-600">2 items • Entregado</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">$ 420</p>
              <p className="text-sm text-gray-600">Ayer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisPedidosPanel;
