import { ProductList } from "@/components/product-list"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Colección de Moda</h1>
        <ProductList />
      </main>
    </div>
  )
}
