"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Product } from "@/types/product"
import type { CartItem } from "@/types/cart-item"

interface CartContextType {
  cartItems: CartItem[]
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        return [...prevItems, { product, quantity: 1 }]
      }
    })

    setIsCartOpen(true)
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  const increaseQuantity = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.product.id === productId ? { ...item, quantity: item.quantity + 1 } : item)),
    )
  }

  const decreaseQuantity = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
