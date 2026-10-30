import styles from './StoreMock.module.css'

/**
 * E-commerce hero picture (736:14212): the greyscale "Wireframe / Product card" (Playful, 240 wide at
 * 44, 101) with the "Wireframe / Cart card" over it (240 wide at 235, 60). Built in HTML, in the panel's
 * 518×496 coordinates.
 */
const sizes = [
  { label: '30ml', selected: false },
  { label: '50ml', selected: true },
  { label: '100ml', selected: false },
]

const items = [
  { lines: [90, 54], price: '₦18,500' },
  { lines: [75, 45], price: '₦12,000' },
]

export function StoreMock() {
  return (
    <>
      <div className={`${styles.card} ${styles.product}`}>
        <div className={styles.image}>
          {/* "Icon / image": 26px; its artwork is 21.67 at 2.17. */}
          <span className={styles.imageIcon}>
            <img src="/assets/features/ecommerce/image.svg" width={21.6667} height={21.6667} alt="" />
          </span>
        </div>
        <div className={styles.nameRow}>
          <span className={styles.lines}>
            <i className={styles.nameLine} />
            <i className={styles.subLine} />
          </span>
          <span className={styles.price}>₦18,500</span>
        </div>
        <div className={styles.sizes}>
          {sizes.map((size) => (
            <span key={size.label} className={`${styles.size} ${size.selected ? styles.selected : ''}`}>
              {size.label}
            </span>
          ))}
        </div>
        <span className={styles.button}>Add to cart</span>
      </div>

      <div className={`${styles.card} ${styles.cart}`}>
        <div className={styles.cartHeader}>
          <span className={styles.cartTitle}>Cart</span>
          <img src="/assets/features/ecommerce/x.svg" width={16} height={16} alt="" />
        </div>
        {items.map((item) => (
          <div key={item.price} className={styles.item}>
            <span className={styles.thumb} />
            <span className={styles.itemLines}>
              <i style={{ width: item.lines[0] }} />
              <i style={{ width: item.lines[1] }} />
            </span>
            <span className={styles.itemPrice}>{item.price}</span>
          </div>
        ))}
        <div className={styles.total}>
          <span>Total</span>
          <span className={styles.totalValue}>₦30,500</span>
        </div>
        <span className={styles.button}>Checkout</span>
      </div>
    </>
  )
}
