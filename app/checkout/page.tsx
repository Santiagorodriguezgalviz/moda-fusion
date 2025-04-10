"use client"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { CheckoutForm } from "@/components/checkout-form"
import { useCart } from "@/components/cart-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingCart } from "lucide-react"
import { Header } from "@/components/header"

// Carga Stripe fuera del componente para evitar recargas innecesarias
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export default function CheckoutPage() {
  const { cartItems } = useCart()
  const router = useRouter()

  // Redireccionar si el carrito está vacío
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-6">Agrega algunos productos antes de proceder al pago</p>
            <Button onClick={() => router.push("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la tienda
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la tienda
          </Button>
          <h1 className="text-3xl font-bold">Finalizar compra</h1>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>

          <div className="md:col-span-2">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-20">
              <h3 className="text-lg font-medium mb-4">Resumen del pedido</h3>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.product.name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    ${cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
