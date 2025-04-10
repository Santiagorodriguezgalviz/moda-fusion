export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description?: string
  discount?: number
}

export type SortOption = "featured" | "price-low-high" | "price-high-low" | "newest"

export interface FilterState {
  categories: string[]
  priceRange: [number, number]
  sortBy: SortOption
}
