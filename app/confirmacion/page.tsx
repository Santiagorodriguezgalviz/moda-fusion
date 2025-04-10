"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"

export default function ConfirmacionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get("order_id")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // En una aplicación real, aquí obtendrías los detalles del pedido desde tu API
    // Simulamos la carga de datos
    const timer = setTimeout(() => {
      setOrderDetails({
        id: orderId,
        date: new Date().toLocaleDateString(),
        status: "Pagado",
      })
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [orderId])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mb-4"></div>
              <h2 className="text-2xl font-bold mb-2">Cargando detalles del pedido...</h2>
            </div>
          ) : (
            <>
              <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <h2 className="text-3xl font-bold mb-2">¡Gracias por tu compra!</h2>
              <p className="text-gray-500 mb-6">Tu pedido ha sido procesado correctamente</p>

              <div className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto mb-8">
                <h3 className="text-lg font-medium mb-4">Detalles del pedido</h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Número de pedido:</span>
                    <span className="font-medium">{orderDetails.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fecha:</span>
                    <span className="font-medium">{orderDetails.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estado:</span>
                    <span className="font-medium text-green-500">{orderDetails.status}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 mb-6">Hemos enviado un correo electrónico con los detalles de tu compra.</p>

              <Button onClick={() => router.push("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a la tienda
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
