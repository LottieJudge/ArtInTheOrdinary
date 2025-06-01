'use client'

import { useEffect, useState, useContext, createContext } from 'react'

const CartContext = createContext()

const generateItemKey = (productSlug, color, size) => {
  return `${productSlug}-${color.name}-${size.name}`;
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
    
    // Fix price calculation - convert string prices to numbers
    const subtotal = cartItems.reduce((acc, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace('£', '')) 
        : item.price;
      return acc + (price * item.quantity);
    }, 0)
    
    const vat = subtotal * 0.2 // VAT calculation
    const total = subtotal + vat
    setCartSubtotal(subtotal)
    setCartVAT(vat)
    setCartTotal(total)
  }, [cartItems])

  // Fixed addToCart function
  const addToCart = (product, color, size, quantity = 1) => {
    console.log('CartContext addToCart called:', {
      product: product.name,
      productSlug: product.slug,
      color: color.name,
      size: size.name,
      quantity
    });

    setCartItems(prevItems => {
      const itemKey = generateItemKey(product.slug, color, size); // Use slug instead of id
      
      console.log('Generated item key:', itemKey);
      console.log('Existing items:', prevItems.map(item => item.cartItemKey));
      
      const existingItemIndex = prevItems.findIndex(
        item => item.cartItemKey === itemKey
      );

        // Add new item
        const newItem = {
          cartItemKey: itemKey,
          name: product.name,
          price: product.price, // Keep as string, we'll convert when calculating
          imageSrc: product.images.find(img => img.primary)?.imageSrc,
          imageAlt: product.images.find(img => img.primary)?.imageAlt,
          color: color,
          size: size,
          quantity: 1
        };
        
        console.log('New item created:', newItem);
        return [...prevItems, newItem];
    });
  }

  const removeFromCart = (index) => {
    console.log('Removing item at index:', index);
    setCartItems(prevItems => prevItems.filter((_, i) => i !== index))
  }

  const updateQuantity = (index, newQuantity) => {
    console.log('Updating quantity at index:', index, 'to:', newQuantity);
    if (newQuantity !== 0 && newQuantity !== 1) return;
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
    const numericPrice = typeof price === 'string' 
      ? parseFloat(price.replace('£', '')) 
      : price;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(numericPrice)
  }

  const clearCart = () => {
    console.log('Clearing cart');
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