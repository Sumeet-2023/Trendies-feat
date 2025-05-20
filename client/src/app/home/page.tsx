"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const categories = ["Accessories", "Jewels", "Bags", "Footwear", "Watches"];
const brands = [
  "Louis Vuitton's",
  "Gucci",
  "Hermes",
  "Prada",
  "Chanel",
  "Dior",
  "Yves Saint Laurent",
  "Bulgari",
  "Rolex",
  "Cartier",
];

export default function ProductPage() {
  const [selectedSort, setSelectedSort] = useState("Featured");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/products/featured");
        setProducts(res.data.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col lg:flex-row gap-10 py-20">
        <aside className="w-full lg:w-1/4 space-y-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Categories</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center gap-2 text-sm pl-4">
                  <Checkbox id={`cat-${cat}`} />
                  <label htmlFor={`cat-${cat}`} className="cursor-pointer">
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Brandies</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {brands.map((brand) => (
                <div
                  key={brand}
                  className="flex items-center gap-2 text-sm pl-4"
                >
                  <Checkbox id={`brand-${brand}`} />
                  <label htmlFor={`brand-${brand}`} className="cursor-pointer">
                    {brand}
                  </label>
                </div>
              ))}
            </div>
          </Card>
        </aside>

        <section className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">ALL PRODUCTS</h2>
            <div className="text-sm">
              <label className="mr-2">Sort:</label>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: any) => (
              <Link href={`/product/${product.id}`} key={product.id}>
                <div className="border rounded shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer">
                  <img
                    src={"https://via.placeholder.com/300x300"}
                    alt={product.name}
                    className="w-full h-64 object-cover bg-gray-100"
                  />
                  <div className="p-4">
                    <h3 className="text-xs uppercase text-gray-500">
                      {product.name}
                    </h3>
                    <p className="font-semibold mt-2">{product.price} MAD</p>

                    <div className="flex justify-between items-center mt-4 text-sm">
                      <Button variant="secondary">
                        <Heart className="mr-2 h-4 w-4" /> Favorites
                      </Button>
                      <Button>
                        <ShoppingBag className="mr-2 h-4 w-4" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
