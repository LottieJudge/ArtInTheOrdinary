'use client'

import { useEffect, useState, useRef, useContext } from 'react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { Radio, RadioGroup } from '@headlessui/react'
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/navigation'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { createContext } from 'react'

const CartContext = createContext()


const generateItemKey = (productId, color, size) => {
  return `${productId}-${color.name}-${size.name}`;
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [cartSubtotal, setCartSubtotal] = useState(0)
  const [cartVAT, setCartVAT] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const vat = subtotal * 0.2 // Example VAT calculation
    const total = subtotal + vat
    setCartSubtotal(subtotal)
    setCartVAT(vat)
    setCartTotal(total)
  }, [cartItems])

  // Update addToCart to include the composite key
  const addToCart = (product, color, size, quantity = 1) => {
    console.log('CartContext addToCart called:', {
      product: product.name,
      color: color.name,
      size: size.name
    });
    setCartItems(prevItems => {
      const itemKey = generateItemKey(product.id, color, size);
      
      // Check if item already exists with same product/color/size
      const existingItemIndex = prevItems.findIndex(
        item => item.cartItemKey === itemKey
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item with composite key
        return [...prevItems, {
          id: product.id,
          cartItemKey: itemKey, // Add the composite key
          name: product.name,
          price: product.price,
          imageSrc: product.images.find(img => img.primary)?.imageSrc,
          imageAlt: product.images.find(img => img.primary)?.imageAlt,
          color: color,
          size: size,
          quantity: quantity
        }];
      }
    });
  };

  const removeFromCart = (index) => {
    setCartItems(prevItems => prevItems.filter((_, i) => i !== index))
  }

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return; // Don't allow quantities less than 1
    setCartItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = newQuantity;
      return updatedItems;
    });
  }

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(price)
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      getCartCount, 
      updateQuantity, 
      cartSubtotal,
      cartVAT,
      cartTotal,
      formatPrice,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}