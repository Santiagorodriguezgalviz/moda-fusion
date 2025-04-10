import { NextResponse } from "next/server"
import Stripe from "stripe"

// Inicializar Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, customerInfo } = body

    // Calcular el monto total en centavos (Stripe usa la menor unidad monetaria)
    const amount = Math.round(
      items.reduce((total: number, item: any) => total + item.product.price * item.quantity, 0) * 100,
    )

    // Crear un PaymentIntent con el monto y la moneda
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      // Almacenar información del cliente en los metadatos
      metadata: {
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.postalCode}, ${customerInfo.country}`,
        order_items: JSON.stringify(
          items.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
        ),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Error al procesar el pago" }, { status: 500 })
  }
}
