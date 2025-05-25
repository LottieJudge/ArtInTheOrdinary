'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  
  // Load cart from localStorage on initial load
  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Add product to cart
  const addToCart = (product, color, size, quantity = 1) => {
    setCartItems(prevItems => {
      // Check if item already exists with same product/color/size
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && 
               item.color.name === color.name && 
               item.size.name === size.name
      )
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          imageSrc: product.images.find(img => img.primary)?.imageSrc,
          imageAlt: product.images.find(img => img.primary)?.imageAlt,
          color: color,
          size: size,
          quantity: quantity
        }]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (index) => {
    setCartItems(prevItems => prevItems.filter((_, i) => i !== index))
  }

  // Update item quantity in cart

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return; // Don't allow quantities less than 1
    
    setCartItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[index].quantity = newQuantity;
      return updatedItems;
    });
  };

  // Get total number of items in cart
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      getCartCount, 
      updateQuantity,
      
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}