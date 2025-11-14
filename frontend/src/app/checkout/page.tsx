"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderSimple } from '@/components/layout/HeaderSimple';
import { Footer } from '@/components/layout/Footer';
import { FloatingCart } from '@/components/layout/FloatingCart';
import useCart from '@/hooks/useCart';
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';
import addressApi from '@/services/api/addressApi';
import cardApi from '@/services/api/cardApi';
import orderApi from '@/services/api/orderApi';
import DireccionModal from '@/components/layout/account/DireccionModal';
import TarjetaModal from '@/components/layout/account/TarjetaModal';
import type { Address, AddressRequest } from '@/types/address.types';
import type { Card, CardRequest } from '@/types/card.types';
import type { OrderRequest } from '@/types/order.types';
import {
  ShoppingCartIcon,
  MapPinIcon,
  CreditCardIcon,
  ClipboardTextIcon,
  PizzaIcon,
  HamburgerIcon,
  TagChevronIcon,
  PlusIcon,
  ArrowLeftIcon
} from '@/components/icons';

export default function CheckoutPage() {
  const router = useRouter();
  const { carrito, vaciarCarrito } = useCart();
  const { state } = useAuth();
  const { success, error: showError } = useToast();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [direcciones, setDirecciones] = useState<Address[]>([]);
  const [tarjetas, setTarjetas] = useState<Card[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  // Verificar autenticación y carrito
  useEffect(() => {
    // No validar si el pedido ya fue completado
    if (orderCompleted) return;

    if (!state?.token) {
      showError('Debes iniciar sesión para realizar un pedido');
      router.push('/login');
      return;
    }

    if (carrito.items.length === 0) {
      showError('Tu carrito está vacío');
      router.push('/');
      return;
    }
  }, [state?.token, carrito.items.length, orderCompleted]);

  // Cargar direcciones
  useEffect(() => {
    const loadAddresses = async () => {
      setIsLoadingAddresses(true);
      try {
        const data = await addressApi.getAll();
        setDirecciones(data);

        // Seleccionar dirección predeterminada
        const defaultAddress = data.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }
      } catch (error) {
        console.error('Error cargando direcciones:', error);
        showError('Error al cargar las direcciones');
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    if (state?.token && currentStep === 2) {
      loadAddresses();
    }
  }, [state?.token, currentStep]);

  // Cargar tarjetas
  useEffect(() => {
    const loadCards = async () => {
      setIsLoadingCards(true);
      try {
        const data = await cardApi.getAll();
        setTarjetas(data);

        // Seleccionar tarjeta predeterminada
        const defaultCard = data.find(card => card.isDefault);
        if (defaultCard) {
          setSelectedCardId(defaultCard.id);
        }
      } catch (error) {
        console.error('Error cargando tarjetas:', error);
        showError('Error al cargar las tarjetas');
      } finally {
        setIsLoadingCards(false);
      }
    };

    if (state?.token && currentStep === 2) {
      loadCards();
    }
  }, [state?.token, currentStep]);

  const handleAddAddress = async (request: AddressRequest) => {
    setIsSavingAddress(true);
    try {
      const newAddress = await addressApi.create(request);
      const allAddresses = await addressApi.getAll();
      setDirecciones(allAddresses);
      setSelectedAddressId(newAddress.id);
      setShowAddressModal(false);
      success('Dirección agregada exitosamente');
    } catch (error) {
      console.error('Error agregando dirección:', error);
      showError('Error al agregar la dirección');
      throw error;
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleAddCard = async (request: CardRequest) => {
    setIsSavingCard(true);
    try {
      const newCard = await cardApi.create(request);
      const allCards = await cardApi.getAll();
      setTarjetas(allCards);
      setSelectedCardId(newCard.id);
      setShowCardModal(false);
      success('Tarjeta agregada exitosamente');
    } catch (error) {
      console.error('Error agregando tarjeta:', error);
      showError('Error al agregar la tarjeta');
      throw error;
    } finally {
      setIsSavingCard(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedAddressId) {
        showError('Selecciona una dirección de entrega');
        return;
      }
      if (!selectedCardId) {
        showError('Selecciona un método de pago');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedAddressId || !selectedCardId) {
      showError('Completa todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    try {
      // Validar que todas las creaciones tengan ID
      const creaciones = carrito.items.filter(i => i.tipoItem === 'CREACION');
      const creacionesSinId = creaciones.filter(i => !i.creacion?.id);

      if (creacionesSinId.length > 0) {
        showError('Error: Algunas creaciones no se guardaron correctamente. Intenta eliminarlas y agregarlas de nuevo.');
        return;
      }

      console.log(creaciones)

      // Extraer IDs de creaciones
      const creationIds = creaciones
        .map(i => ({
          creationId: i.creacion!.id!,
          quantity: i.cantidad
        }))

      // Extraer productos con cantidad
      const products = carrito.items
        .filter(i => i.tipoItem === 'PRODUCTO')
        .map(i => ({
          productId: i.producto!.id,
          quantity: i.cantidad
        }));

      // Construir request
      const orderRequest: OrderRequest = {
        creationIds: creationIds.length > 0 ? creationIds : undefined,
        products: products.length > 0 ? products : undefined,
        addressId: selectedAddressId,
        cardId: selectedCardId,
        notes: notes || undefined
      };

      // Validar que haya al menos un item
      if (!orderRequest.creationIds?.length && !orderRequest.products?.length) {
        showError('El carrito está vacío');
        return;
      }

      // Crear orden en el backend
      const orderResponse = await orderApi.create(orderRequest);

      // Marcar pedido como completado ANTES de vaciar el carrito
      setOrderCompleted(true);

      // Vaciar carrito
      vaciarCarrito();

      // Mostrar éxito
      success('¡Pedido realizado exitosamente!');

      // Redirigir a home
      router.push('/');

      // Esperar a que se complete la navegación y abrir el panel de pedidos
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openAccount', { detail: { panel: 'mis-pedidos' } }));
      }, 500);
    } catch (error: any) {
      console.error('Error creando pedido:', error);
      const errorMessage = error?.message || 'Error al crear el pedido. Intenta nuevamente.';
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const selectedAddress = direcciones.find(addr => addr.id === selectedAddressId);
  const selectedCard = tarjetas.find(card => card.id === selectedCardId);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSimple />

      <main className="max-w-4xl mx-auto px-5 py-10">
        {/* Header con botón volver */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeftIcon size={20} />
            <span>Seguir comprando</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Pedido</h1>
          <p className="text-gray-600">Completa los siguientes pasos para realizar tu pedido</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                <span className={`text-sm mt-2 ${currentStep >= step ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {step === 1 && 'Resumen'}
                  {step === 2 && 'Dirección y Pago'}
                  {step === 3 && 'Confirmar'}
                </span>
              </div>
              {step < 3 && (
                <TagChevronIcon
                  size={24}
                  className={currentStep > step ? 'text-primary-600' : 'text-gray-300'}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Resumen del pedido */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCartIcon size={28} className="text-primary-600" weight="fill" />
              <h2 className="text-2xl font-bold text-gray-900">Resumen del Pedido</h2>
            </div>

            <div className="space-y-4 mb-6">
              {carrito.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {item.tipoItem === 'CREACION' ? (
                        item.creacion?.tipo === 'PIZZA' ? (
                          <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                            <PizzaIcon size={32} weight="fill" className="text-primary-600" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                            <HamburgerIcon size={32} weight="fill" className="text-primary-600" />
                          </div>
                        )
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-3xl">
                          {item.producto?.tipo === 'DRINK' ? '🥤' : '🍟'}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {item.tipoItem === 'CREACION' ? item.creacion?.nombre : item.producto?.nombre}
                      </h4>
                      {item.tipoItem === 'CREACION' && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.creacion?.ingredientes.length} ingredientes
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">Cantidad: {item.cantidad}</span>
                        <span className="font-bold text-gray-900">{formatPrice(item.precioTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-gray-900">{formatPrice(carrito.precioTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Dirección y Pago */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Dirección de entrega */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPinIcon size={28} className="text-primary-600" weight="fill" />
                <h2 className="text-2xl font-bold text-gray-900">Dirección de Entrega</h2>
              </div>

              {isLoadingAddresses ? (
                <p className="text-gray-600">Cargando direcciones...</p>
              ) : direcciones.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No tienes direcciones guardadas</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <PlusIcon size={20} />
                    Agregar Dirección
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {direcciones.map((direccion) => (
                      <label
                        key={direccion.id}
                        className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedAddressId === direccion.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={direccion.id}
                          checked={selectedAddressId === direccion.id}
                          onChange={() => setSelectedAddressId(direccion.id)}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{direccion.alias}</h4>
                              {direccion.isDefault && (
                                <span className="bg-primary-400 text-white text-xs px-2 py-0.5 rounded-full">
                                  Predeterminada
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 text-sm">
                              {direccion.street} {direccion.number}
                              {direccion.apartmentNumber && `, Apto ${direccion.apartmentNumber}`}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {direccion.city}, CP {direccion.zipCode}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                  >
                    <PlusIcon size={18} />
                    Agregar nueva dirección
                  </button>
                </>
              )}
            </div>

            {/* Método de pago */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <CreditCardIcon size={28} className="text-primary-600" weight="fill" />
                <h2 className="text-2xl font-bold text-gray-900">Método de Pago</h2>
              </div>

              {isLoadingCards ? (
                <p className="text-gray-600">Cargando tarjetas...</p>
              ) : tarjetas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No tienes tarjetas guardadas</p>
                  <button
                    onClick={() => setShowCardModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <PlusIcon size={20} />
                    Agregar Tarjeta
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {tarjetas.map((tarjeta) => (
                      <label
                        key={tarjeta.id}
                        className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedCardId === tarjeta.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="card"
                          value={tarjeta.id}
                          checked={selectedCardId === tarjeta.id}
                          onChange={() => setSelectedCardId(tarjeta.id)}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{tarjeta.alias}</h4>
                              {tarjeta.isDefault && (
                                <span className="bg-primary-400 text-white text-xs px-2 py-0.5 rounded-full">
                                  Predeterminada
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 text-sm">{tarjeta.cardholderName}</p>
                            <p className="text-gray-600 text-sm font-mono">
                              •••• •••• •••• {tarjeta.last4Digits}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {tarjeta.cardType} - Vence: {tarjeta.expirationDate}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowCardModal(true)}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
                  >
                    <PlusIcon size={18} />
                    Agregar nueva tarjeta
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handleNextStep}
                className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmar pedido */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Resumen final */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <ClipboardTextIcon size={28} className="text-primary-600" weight="fill" />
                <h2 className="text-2xl font-bold text-gray-900">Confirmar Pedido</h2>
              </div>

              {/* Dirección seleccionada */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Dirección de entrega:</h3>
                {selectedAddress && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">{selectedAddress.alias}</p>
                    <p className="text-gray-700 text-sm">
                      {selectedAddress.street} {selectedAddress.number}
                      {selectedAddress.apartmentNumber && `, Apto ${selectedAddress.apartmentNumber}`}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedAddress.city}, CP {selectedAddress.zipCode}
                    </p>
                  </div>
                )}
              </div>

              {/* Tarjeta seleccionada */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Método de pago:</h3>
                {selectedCard && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">{selectedCard.alias}</p>
                    <p className="text-gray-700 text-sm">{selectedCard.cardholderName}</p>
                    <p className="text-gray-600 text-sm font-mono">
                      •••• •••• •••• {selectedCard.last4Digits}
                    </p>
                  </div>
                )}
              </div>

              {/* Notas del pedido */}
              <div className="mb-6">
                <label className="block font-semibold text-gray-900 mb-2">
                  Notas del pedido (opcional):
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Sin cebolla, entregar en la puerta trasera..."
                  maxLength={500}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{notes.length}/500 caracteres</p>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span>Total a pagar:</span>
                  <span className="text-gray-900">{formatPrice(carrito.precioTotal)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={isSubmitting}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Volver
                </button>
                <button
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <FloatingCart />

      {/* Modales */}
      <DireccionModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSubmit={handleAddAddress}
        isSaving={isSavingAddress}
      />
      <TarjetaModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        onSubmit={handleAddCard}
        isSaving={isSavingCard}
      />
    </div>
  );
}
