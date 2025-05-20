import { use } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import ProductRating from "components/ProductRating";

type Product = {
  id: string;
  brand: string;
  name: string;
  price: string;
  image: string;
  description: string;
};

const mockProducts: Product[] = [
  {
    id: "1",
    brand: "Cartier",
    name: "Test",
    price: "50,000 MAD",
    image: "https://via.placeholder.com/600x600",
    description:
      "A luxury Cartier watch with a metallic bracelet and classic Roman numerals.",
  },
  {
    id: "2",
    brand: "Cartier",
    name: "Test",
    price: "50,000 MAD",
    image: "https://via.placeholder.com/600x600",
    description:
      "A luxury Cartier watch with a metallic bracelet and classic Roman numerals.",
  },
  {
    id: "3",
    brand: "Cartier",
    name: "Test",
    price: "50,000 MAD",
    image: "https://via.placeholder.com/600x600",
    description:
      "A luxury Cartier watch with a metallic bracelet and classic Roman numerals.",
  },
];

export default function ProductDetail({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === params.id);

  if (!product) {
    return <div className="p-10 text-center">Product not found.</div>;
  }

  return (
    <main className="max-w-6xl mx-auto p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-auto object-cover rounded-lg"
        />

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 text-lg">{product.brand}</p>
          <p className="text-xl font-semibold">{product.price}</p>

          <p className="text-gray-600">{product.description}</p>

          <div className="flex gap-4 mt-6">
            <Button variant="secondary">
              <Heart className="mr-2 h-4 w-4" /> Add to Favorites
            </Button>
            <Button>
              <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
      <ProductRating />
    </main>
  );
}
