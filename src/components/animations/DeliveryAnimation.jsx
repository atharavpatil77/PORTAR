import Lottie from 'lottie-react';
import deliveryAnimation from '../../assets/animations/delivery-animation.json';

function DeliveryAnimation({ className }) {
  return (
    <div className={className}>
      <Lottie
        animationData={deliveryAnimation}
        loop={true}
        autoplay={true}
      />
    </div>
  );
}

export default DeliveryAnimation;