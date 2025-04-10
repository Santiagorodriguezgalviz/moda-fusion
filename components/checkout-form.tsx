"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Loader2 } from "lucide-react"

export function CheckoutForm() {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const { cartItems, clearCart } = useCart()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "España",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    setIsLoading(true)
    setError(null)

    try {
      // Create a payment intent on the server
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          customerInfo: formData,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al procesar el pago")
      }

      const { clientSecret } = await response.json()

      // Confirm the payment with Stripe.js
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              postal_code: formData.postalCode,
              country: formData.country,
            },
          },
        },
      })

      if (stripeError) {
        setError(stripeError.message || "Error al procesar el pago")
      } else if (paymentIntent.status === "succeeded") {
        // Payment successful
        clearCart()
        router.push(`/confirmacion?order_id=${paymentIntent.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información de contacto</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Dirección de envío</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Código postal</Label>
              <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información de pago</h3>
        <div className="p-4 border rounded-md bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>}

      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Total a pagar</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={!stripe || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            `Pagar $${total.toFixed(2)}`
          )}
        </Button>
      </div>
    </form>
  )
}
