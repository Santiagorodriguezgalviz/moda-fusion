"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import type { Product, FilterState } from "@/types/product"
import { Loader2 } from "lucide-react"

export function ProductList() {
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 500],
    sortBy: "featured",
  })

  // Simulate loading products from an API
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      setProducts([
        {
          id: "1",
          name: "Vestido Floral Primavera",
          price: 79.99,
          image:
            "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "vestidos",
          description: "Elegante vestido floral perfecto para la temporada de primavera.",
        },
        {
          id: "2",
          name: "Jeans Premium Slim Fit",
          price: 89.99,
          image:
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "pantalones",
          description: "Jeans de alta calidad con corte slim fit para un look moderno.",
        },
        {
          id: "3",
          name: "Zapatillas Urbanas Comfort",
          price: 119.99,
          image:
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "calzado",
          description: "Zapatillas urbanas con tecnología de confort para uso diario.",
        },
        {
          id: "4",
          name: "Chaqueta de Cuero Vintage",
          price: 199.99,
          image:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "chaquetas",
          description: "Chaqueta de cuero genuino con estilo vintage y acabados premium.",
        },
        {
          id: "5",
          name: "Gorra Deportiva Signature",
          price: 34.99,
          image:
            "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "accesorios",
          description: "Gorra deportiva con diseño signature y ajuste perfecto.",
        },
        {
          id: "6",
          name: "Bufanda de Lana Merino",
          price: 49.99,
          image:
            "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "accesorios",
          description: "Bufanda de lana merino suave y cálida para los días fríos.",
        },
        {
          id: "7",
          name: "Blusa Elegante Seda",
          price: 69.99,
          image:
            "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "blusas",
          description: "Blusa de seda con diseño elegante para ocasiones especiales.",
        },
        {
          id: "8",
          name: "Falda Midi Plisada",
          price: 59.99,
          image:
            "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "faldas",
          description: "Falda midi plisada con diseño versátil para múltiples ocasiones.",
        },
        {
          id: "9",
          name: "Reloj Minimalista Acero",
          price: 129.99,
          image:
            "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "accesorios",
          description: "Reloj con diseño minimalista en acero inoxidable de alta calidad.",
        },
        {
          id: "10",
          name: "Suéter Oversize Casual",
          price: 79.99,
          image:
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "suéteres",
          description: "Suéter oversize para un look casual y cómodo en días frescos.",
        },
        {
          id: "11",
          name: "Bolso Tote Premium",
          price: 149.99,
          image:
            "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "accesorios",
          description: "Bolso tote de cuero premium con amplio espacio interior.",
        },
        {
          id: "12",
          name: "Camisa Oxford Clásica",
          price: 69.99,
          image:
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "camisas",
          description: "Camisa oxford clásica perfecta para ocasiones formales o casuales.",
        },
      ])
      setIsLoading(false)
    }

    loadProducts()
  }, [])

  // Apply filters whenever products or filters change
  useEffect(() => {
    if (products.length === 0) return

    let result = [...products]

    // Filter by category if any categories are selected
    if (filters.categories.length > 0) {
      result = result.filter((product) => filters.categories.includes(product.category))
    }

    // Filter by price range
    result = result.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Sort products
    switch (filters.sortBy) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        result.sort((a, b) => b.price - a.price)
        break
      case "newest":
        // In a real app, you'd sort by date
        result.sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id))
        break
      default:
        // Featured - keep original order or implement custom logic
        break
    }

    setFilteredProducts(result)
  }, [products, filters])

  // Get unique categories from products
  const categories = [...new Set(products.map((product) => product.category))]

  // Get min and max prices from products
  const minPrice = Math.min(...products.map((product) => product.price), 0)
  const maxPrice = Math.max(...products.map((product) => product.price), 500)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <ProductFilters
          categories={categories}
          priceRange={[minPrice, maxPrice]}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
      <div className="md:col-span-3">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium">No se encontraron productos</h3>
            <p className="text-gray-500 mt-2">Intenta con otros filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
