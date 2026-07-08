import ProductCard from "./ProductCard";
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
      description: "created by the perfumer",
      rating: 4.9,
      reviews: 42,
      price: "1,750৳",
      volume: "100ml",
      image: "/images/products/jade_serenity.png",
    },
    {
      id: "2",
      name: "Coral Sea",
      description: "created by the perfumer",
      rating: 4.8,
      reviews: 35,
      price: "1,450৳",
      volume: "100ml",
      image: "/images/products/coral_sea.png",
    },
    {
      id: "3",
      name: "Magnetism",
      description: "created by the perfumer",
      rating: 4.7,
      reviews: 29,
      price: "1,250৳",
      volume: "100ml",
      image: "/images/products/magnetism.png",
    },
    {
      id: "4",
      name: "Hellenist",
      description: "created by the perfumer",
      rating: 4.9,
      reviews: 51,
      price: "1,350৳",
      volume: "100ml",
      image: "/images/products/hellenist.png",
    },
    // Row 2
    {
      id: "5",
      name: "Magnetism",
      description: "created by the perfumer",
      rating: 4.7,
      reviews: 29,
      price: "1,250৳",
      volume: "100ml",
      image: "/images/products/magnetism.png",
    },
    {
      id: "6",
      name: "Hellenist",
      description: "created by the perfumer",
      rating: 4.9,
      reviews: 51,
      price: "1,350৳",
      volume: "100ml",
      image: "/images/products/hellenist.png",
    },
    {
      id: "7",
      name: "Jade Serenity",
      description: "created by the perfumer",
      rating: 4.9,
      reviews: 42,
      price: "1,750৳",
      volume: "100ml",
      image: "/images/products/jade_serenity.png",
    },
    {
      id: "8",
      name: "Coral Sea",
      description: "created by the perfumer",
      rating: 4.8,
      reviews: 35,
      price: "1,450৳",
      volume: "100ml",
      image: "/images/products/coral_sea.png",
    },
    // Row 3
    {
      id: "9",
      name: "Coral Sea",
      description: "created by the perfumer",
      rating: 4.8,
      reviews: 35,
      price: "1,450৳",
      volume: "100ml",
      image: "/images/products/coral_sea.png",
    },
    {
      id: "10",
      name: "Jade Serenity",
      description: "created by the perfumer",
      rating: 4.9,
      reviews: 42,
      price: "1,750৳",
      volume: "100ml",
      image: "/images/products/jade_serenity.png",
    },
    {
      id: "11",
      name: "Magnetism",
      description: "created by the perfumer",
      rating: 4.7,
      reviews: 29,
      price: "1,250৳",
      volume: "100ml",
      image: "/images/products/magnetism.png",
    },
    {
      id: "12",
      name: "Hellenist",
      description: "created by the perfumer",
      rating: 4.9,
      reviews: 51,
      price: "1,350৳",
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

      <div className={styles.pagination}>
        <button className={styles.prevBtn}>
          <svg
            className={styles.chevron}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Previous
        </button>

        <div className={styles.pageNumbers}>
          <button className={`${styles.pageNum} ${styles.activePage}`}>1</button>
          <button className={styles.pageNum}>2</button>
          <span className={styles.dots}>...</span>
          <button className={styles.pageNum}>8</button>
          <button className={styles.pageNum}>9</button>
          <button className={styles.pageNum}>10</button>
        </div>

        <button className={styles.nextBtn}>
          Next
          <svg
            className={styles.chevron}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
