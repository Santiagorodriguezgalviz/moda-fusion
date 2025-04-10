"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Cart } from "@/components/cart"

export function Header() {
  const { cartItems, isCartOpen, setIsCartOpen } = useCart()

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-gray-900">ModaFusion Boutique</h2>
        </div>
        <Button onClick={() => setIsCartOpen(true)} variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
        <Cart />
      </div>
    </header>
  )
}
