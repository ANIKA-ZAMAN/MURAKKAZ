import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import styles from "./ProductGrid.module.css";

interface Product {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  price: string;
  volume: string;
  image: string;
}

export default function ProductGrid() {
  const products: Product[] = [
    // Row 1
    {
      id: "1",
      name: "Jade Serenity",
      description: "Inspired by Dio Savotage",
      rating: 4.8,
      reviews: 250,
      price: "1,720tk",
      volume: "100ml",
      image: "/images/products/jade_serenity.png",
    },
    {
      id: "2",
      name: "Coral Sea",
      description: "Inspired by Creed Aventus",
      rating: 4.9,
      reviews: 180,
      price: "1,420tk",
      volume: "100ml",
      image: "/images/products/coral_sea.png",
    },
    {
      id: "3",
      name: "Magnetism",
      description: "Inspired by YSL Y EDP",
      rating: 4.7,
      reviews: 120,
      price: "1,220tk",
      volume: "100ml",
      image: "/images/products/magnetism.png",
    },
    {
      id: "4",
      name: "Hellenist",
      description: "Inspired by Bleu De Chanel",
      rating: 4.9,
      reviews: 310,
      price: "1,320tk",
      volume: "100ml",
      image: "/images/products/hellenist.png",
    },
    // Row 2
    {
      id: "5",
      name: "Magnetism",
      description: "Inspired by YSL Y EDP",
      rating: 4.7,
      reviews: 120,
      price: "1,220tk",
      volume: "100ml",
      image: "/images/products/magnetism.png",
    },
    {
      id: "6",
      name: "Hellenist",
      description: "Inspired by Bleu De Chanel",
      rating: 4.9,
      reviews: 310,
      price: "1,320tk",
      volume: "100ml",
      image: "/images/products/hellenist.png",
    },
    {
      id: "7",
      name: "Jade Serenity",
      description: "Inspired by Dio Savotage",
      rating: 4.8,
      reviews: 250,
      price: "1,720tk",
      volume: "100ml",
      image: "/images/products/jade_serenity.png",
    },
    {
      id: "8",
      name: "Coral Sea",
      description: "Inspired by Creed Aventus",
      rating: 4.9,
      reviews: 180,
      price: "1,420tk",
      volume: "100ml",
      image: "/images/products/coral_sea.png",
    },
    // Row 3
    {
      id: "9",
      name: "Coral Sea",
      description: "Inspired by Creed Aventus",
      rating: 4.9,
      reviews: 180,
      price: "1,420tk",
      volume: "100ml",
      image: "/images/products/coral_sea.png",
    },
    {
      id: "10",
      name: "Jade Serenity",
      description: "Inspired by Dio Savotage",
      rating: 4.8,
      reviews: 250,
      price: "1,720tk",
      volume: "100ml",
      image: "/images/products/jade_serenity.png",
    },
    {
      id: "11",
      name: "Magnetism",
      description: "Inspired by YSL Y EDP",
      rating: 4.7,
      reviews: 120,
      price: "1,220tk",
      volume: "100ml",
      image: "/images/products/magnetism.png",
    },
    {
      id: "12",
      name: "Hellenist",
      description: "Inspired by Bleu De Chanel",
      rating: 4.9,
      reviews: 310,
      price: "1,320tk",
      volume: "100ml",
      image: "/images/products/hellenist.png",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {products.map((product, index) => (
          <ProductCard
            key={`${product.id}-${index}`}
            name={product.name}
            description={product.description}
            rating={product.rating}
            reviews={product.reviews}
            price={product.price}
            volume={product.volume}
            image={product.image}
          />
        ))}
      </div>

      <Pagination currentPage={1} totalPages={10} />
    </div>
  );
}
