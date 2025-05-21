"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // If you're using Next.js App Router
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import ProductRating from "components/ProductRating";

type Product = {
  id: number;
  name: string;
  brand?: string;
  price: number;
  description?: string;
  image?: string;
};
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${apiUrl}products/${params.id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    if (params.id) fetchProduct();
  }, [params.id]);

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <main className="max-w-6xl mx-auto p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <img
          src={"/test.jpeg"}
          alt={product.name}
          className="w-full h-auto object-cover rounded-lg"
        />

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500 text-lg">{product.brand || "Brand"}</p>
          <p className="text-xl font-semibold">{product.price} MAD</p>

          <p className="text-gray-600">
            {product.description || "No description available."}
          </p>

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
      <ProductRating userId={1} productId={Number(params.id)} />
    </main>
  );
}
