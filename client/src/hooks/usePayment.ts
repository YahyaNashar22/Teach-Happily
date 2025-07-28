import { useState } from 'react';
import axios from 'axios';
import { useUserStore } from '../store';

interface PaymentItem {
  _id: string;
  title: string;
  price: number;
  image: string;
  teacher?: {
    fullname: string;
  };
}

interface UsePaymentProps {
  item: PaymentItem;
  itemType: 'course' | 'product';
}

export const usePayment = ({ item, itemType }: UsePaymentProps) => {
  const backend = import.meta.env.VITE_BACKEND;
  const { user } = useUserStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Form states
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  const validateCardForm = () => {
    if (!cardName.trim()) return "يرجى إدخال اسم حامل البطاقة";
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) return "رقم البطاقة غير صحيح (16 رقم)";
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) return "تاريخ الانتهاء يجب أن يكون بالشكل MM/YY";
    if (!/^\d{3,4}$/.test(cardCVV)) return "رمز التحقق (CVV) غير صحيح";
    if (!agreeTerms) return "يجب الموافقة على الشروط والأحكام";
    return "";
  };

  const handlePayment = async () => {
    setError('');
    const validationError = validateCardForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const paymentData = {
        [itemType === 'course' ? 'courseId' : 'productId']: item._id,
        userId: user?._id,
        amount: item.price,
        userEmail: user?.email,
        userName: user?.fullName,
        isDigitalProduct: itemType === 'product',
      };

      const res = await axios.post(
        `${backend}/payment/myfatoorah`,
        paymentData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data && res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        setError("حدث خطأ أثناء إنشاء الدفع. حاول مرة أخرى.");
      }
    } catch {
      setError("حدث خطأ أثناء الاتصال ببوابة الدفع. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    if (!user) {
      // Redirect to sign in or handle authentication
      return false;
    }
    setIsModalOpen(true);
    return true;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    setSuccess(false);
    // Reset form
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCVV('');
    setAgreeTerms(false);
  };

  return {
    // States
    isModalOpen,
    loading,
    error,
    success,
    agreeTerms,
    paymentMethod,
    cardName,
    cardNumber,
    cardExpiry,
    cardCVV,
    
    // Actions
    openModal,
    closeModal,
    handlePayment,
    setAgreeTerms,
    setPaymentMethod,
    setCardName,
    setCardNumber,
    setCardExpiry,
    setCardCVV,
  };
}; 