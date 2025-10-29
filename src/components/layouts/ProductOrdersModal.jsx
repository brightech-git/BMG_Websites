
import { getProductImages } from "../../utils/getProductImages";
import "./ProductOrdersModal.css";

export const OrderNotification = ({ order, visible, onClose }) => {
  if (!order || !visible) return null;

  const images = getProductImages(order.imagePath, "/fallback.png");

  return (
    <div className="order-notification-modal">
      <div className="order-notification-item">
        <div className="product-image">
          <img src={images[0]} alt={order.productName} />
        </div>
        <div className="orderNotification-details">
          <div className="product-purchased-by ">Product Purchased By</div>
          <div className="customer-name">{order.customerName}</div>
          <div className="product-name">{order.productName}  {new Date(order.orderTime).toLocaleString()}</div>
        
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
    </div>
  );
};