"use client"

import { useEffect } from "react"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/types/product"
import { Button } from "@/components/ui/button"
import { ShoppingCart, X } from "lucide-react"

interface ProductQuickViewProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const { addToCart } = useCart()

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end p-4">
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6 pt-0">
          <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="flex flex-col">
            <div className="text-sm text-gray-500 mb-1 capitalize">{product.category}</div>
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-3xl font-bold text-gray-900 mt-4">${product.price.toFixed(2)}</p>

            {product.description && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Descripción</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            <div className="mt-8">
              <Button
                onClick={() => {
                  addToCart(product)
                  onClose()
                }}
                className="w-full gap-2"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5" />
                Agregar al carrito
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
