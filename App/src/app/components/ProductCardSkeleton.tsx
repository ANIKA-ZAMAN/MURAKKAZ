import styles from "./ProductCardSkeleton.module.css";

export default function ProductCardSkeleton() {
  return (
    <div className={styles.cardSkeleton} aria-hidden="true">
      {/* Product Image Skeleton (1:1 aspect ratio) */}
      <div className={`${styles.imageSkeleton} ${styles.bone}`} />

      {/* Card Content Skeleton */}
      <div className={styles.contentSkeleton}>
        {/* Row 1: Title + Wishlist Button */}
        <div className={styles.nameRowSkeleton}>
          <div className={styles.nameLines}>
            <div className={`${styles.nameLine1} ${styles.bone}`} />
            <div className={`${styles.nameLine2} ${styles.bone}`} />
          </div>
          <div className={`${styles.wishlistSkeleton} ${styles.bone}`} />
        </div>

        {/* Row 2: Subtitle/Brand */}
        <div className={styles.brandRowSkeleton}>
          <div className={`${styles.brandLine} ${styles.bone}`} />
        </div>

        {/* Row 3: Rating & Price */}
        <div className={styles.ratingPriceRowSkeleton}>
          <div className={`${styles.ratingSkeleton} ${styles.bone}`} />
          <div className={`${styles.priceSkeleton} ${styles.bone}`} />
        </div>

        {/* Row 4: Action Buttons */}
        <div className={styles.actionsSkeleton}>
          <div className={`${styles.btnSkeleton} ${styles.bone}`} />
          <div className={`${styles.btnSkeleton} ${styles.bone}`} />
        </div>
      </div>
    </div>
  );
}
