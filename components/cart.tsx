"use client"

import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Minus, Plus, ShoppingBag, CreditCard } from "lucide-react"
import Image from "next/image"

export function Cart() {
  const router = useRouter()
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, increaseQuantity, decreaseQuantity } = useCart()

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleCheckout = () => {
    setIsCartOpen(false)
    router.push("/checkout")
  }

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsCartOpen(false)}>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Tu Carrito</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
            <p className="text-gray-500 mb-4">Parece que no has agregado ningún producto a tu carrito todavía.</p>
            <Button onClick={() => setIsCartOpen(false)}>Continuar Comprando</Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-4 px-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex border rounded-lg overflow-hidden">
                    <div className="relative h-24 w-24 flex-shrink-0 bg-gray-100">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=96&width=96"
                        }}
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-gray-900 font-medium mt-1">${item.product.price.toFixed(2)}</p>
                      <div className="mt-2 flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => decreaseQuantity(item.product.id)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => increaseQuantity(item.product.id)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t mt-4 pt-4 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Finalizar Compra
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
