"use client"

import { useState } from "react"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, Eye } from "lucide-react"
import { ProductQuickView } from "@/components/product-quick-view"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isImageError, setIsImageError] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)

  const handleImageError = () => {
    setIsImageError(true)
  }

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={isImageError ? "/placeholder.svg?height=400&width=300" : product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
            priority={false}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button variant="secondary" size="sm" className="gap-1" onClick={() => setShowQuickView(true)}>
              <Eye className="h-4 w-4" />
              Vista rápida
            </Button>
          </div>
          {product.discount && (
            <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discount}%
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500 mb-1 capitalize">{product.category}</div>
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
          <p className="text-xl font-bold text-gray-900 mt-2">${product.price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button onClick={() => addToCart(product)} className="w-full gap-2" variant="default">
            <ShoppingCart className="h-4 w-4" />
            Agregar al carrito
          </Button>
        </CardFooter>
      </Card>

      {showQuickView && (
        <ProductQuickView product={product} isOpen={showQuickView} onClose={() => setShowQuickView(false)} />
      )}
    </>
  )
}
