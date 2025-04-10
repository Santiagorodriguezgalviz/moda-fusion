"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { FilterState, SortOption } from "@/types/product"

interface ProductFiltersProps {
  categories: string[]
  priceRange: [number, number]
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
}

export function ProductFilters({ categories, priceRange, filters, setFilters }: ProductFiltersProps) {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(filters.priceRange)

  // Update local price range when filters change
  useEffect(() => {
    setLocalPriceRange(filters.priceRange)
  }, [filters.priceRange])

  // Format category name for display
  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  // Handle category checkbox change
  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setFilters((prev) => ({
        ...prev,
        categories: [...prev.categories, category],
      }))
    } else {
      setFilters((prev) => ({
        ...prev,
        categories: prev.categories.filter((c) => c !== category),
      }))
    }
  }

  // Handle price range change
  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]])
  }

  // Apply price range when slider stops
  const applyPriceRange = () => {
    setFilters((prev) => ({
      ...prev,
      priceRange: localPriceRange,
    }))
  }

  // Handle sort option change
  const handleSortChange = (value: SortOption) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: value,
    }))
  }

  return (
    <div className="space-y-6 sticky top-20">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>

        <Accordion type="multiple" defaultValue={["categories", "price", "sort"]}>
          <AccordionItem value="categories">
            <AccordionTrigger className="text-base font-medium">Categorías</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">
                      {formatCategoryName(category)}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="price">
            <AccordionTrigger className="text-base font-medium">Precio</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <Slider
                  min={priceRange[0]}
                  max={priceRange[1]}
                  step={1}
                  value={[localPriceRange[0], localPriceRange[1]]}
                  onValueChange={handlePriceChange}
                  onValueCommit={applyPriceRange}
                  className="my-6"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">${localPriceRange[0].toFixed(2)}</span>
                  <span className="text-sm">${localPriceRange[1].toFixed(2)}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sort">
            <AccordionTrigger className="text-base font-medium">Ordenar por</AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={filters.sortBy}
                onValueChange={(value) => handleSortChange(value as SortOption)}
                className="space-y-3 pt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="featured" id="sort-featured" />
                  <Label htmlFor="sort-featured" className="text-sm font-normal cursor-pointer">
                    Destacados
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-low-high" id="sort-price-low" />
                  <Label htmlFor="sort-price-low" className="text-sm font-normal cursor-pointer">
                    Precio: menor a mayor
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-high-low" id="sort-price-high" />
                  <Label htmlFor="sort-price-high" className="text-sm font-normal cursor-pointer">
                    Precio: mayor a menor
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="newest" id="sort-newest" />
                  <Label htmlFor="sort-newest" className="text-sm font-normal cursor-pointer">
                    Más recientes
                  </Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
