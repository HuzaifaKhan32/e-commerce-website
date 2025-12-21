
import React from 'react';
import { FiCheckCircle, FiMail, FiTruck, FiArrowRight, FiFileText, FiDownload } from 'react-icons/fi';
import { CartItem } from '../types.ts';
import { CheckoutInfo } from '../App.tsx';

interface ConfirmationPageProps {
  order: {
    items: CartItem[];
    info: CheckoutInfo;
  };
  onContinueShopping: () => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ order, onContinueShopping }) => {
  const total = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleDownloadPDF = () => {
    // Creating a text-based invoice as a reliable download action
    const invoiceContent = `
LUXE LEATHER - ORDER INVOICE
---------------------------------------
Order Number: #890234-LUXE
Date: ${new Date().toLocaleDateString()}
Customer: ${order.info.fullName}
Email: ${order.info.email}

SHIPPING ADDRESS:
${order.info.fullName}
${order.info.address}
${order.info.city}, ${order.info.state} ${order.info.postalCode}
${order.info.country}

ORDER SUMMARY:
${order.items.map(item => `- ${item.name} (${item.color}): ${item.quantity} x $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

---------------------------------------
SUBTOTAL: $${total.toFixed(2)}
SHIPPING: FREE
TOTAL AMOUNT: $${total.toFixed(2)} (USD)
---------------------------------------

Thank you for your purchase from Luxe Leather.
Your order is currently being prepared for shipment.
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Luxe-Leather-Invoice-${order.info.fullName.split(' ')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleViewDetails = () => {
    const summarySection = document.getElementById('order-summary-section');
    if (summarySection) {
      summarySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in relative">
      {/* Decorative Confetti Representation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className={`absolute w-3 h-3 rounded-sm animate-bounce`} 
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 20}%`,
              backgroundColor: ['#C9A96E', '#3E2723', '#D4C5B9'][i % 3],
              animationDelay: `${Math.random() * 2}s`
            }} 
          />
        ))}
      </div>

      {/* Success Hero */}
      <div className="relative z-10 flex flex-col items-center text-center mb-20 animate-fade-in-up">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75 h-32 w-32 -m-4"></div>
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-white border-2 border-primary/30 shadow-2xl">
            <FiCheckCircle className="text-primary text-6xl" />
          </div>
        </div>
        <h1 className="font-serif text-5xl md:text-6xl text-secondary font-bold mb-6 tracking-tight">Order Confirmed!</h1>
        <p className="text-xl text-grey/80 mb-2 font-light">Thank you for your purchase, {order.info.fullName.split(' ')[0]}.</p>
        <p className="text-xs text-taupe font-bold uppercase tracking-[0.3em] mb-10">Order #890234-LUXE</p>
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full text-secondary text-sm font-bold border border-primary/20 shadow-sm">
          <FiMail className="text-primary text-lg" />
          <span>Confirmation sent to {order.info.email}</span>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Estimated Delivery */}
          <div className="bg-white rounded-2xl p-8 border border-secondary/5 shadow-soft flex gap-8 items-start">
            <div className="p-4 bg-ivory rounded-2xl text-primary shrink-0 shadow-inner">
              <FiTruck className="text-3xl" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-secondary mb-2">Estimated Delivery</h2>
              <p className="text-3xl font-serif text-primary font-bold mb-4">Oct 24 - Oct 26</p>
              <div className="w-full bg-ivory rounded-full h-2 mb-4">
                <div className="bg-primary h-2 rounded-full w-1/4 shadow-sm"></div>
              </div>
              <p className="text-sm text-grey font-medium">We are preparing your order for shipment.</p>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-2xl p-8 border border-secondary/5 shadow-soft">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-taupe mb-8">Shipping Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div>
                <h4 className="font-bold text-secondary mb-4 text-sm">Shipping Address</h4>
                <address className="not-italic text-grey text-sm leading-relaxed font-medium">
                  {order.info.fullName}<br />
                  {order.info.address}<br />
                  {order.info.city}, {order.info.state} {order.info.postalCode}<br />
                  {order.info.country}
                </address>
              </div>
              <div>
                <h4 className="font-bold text-secondary mb-4 text-sm">Payment Method</h4>
                <div className="flex items-center gap-3 text-grey font-medium text-sm">
                  <FiFileText className="text-taupe text-lg" />
                  <span>Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons (Desktop) */}
          <div className="hidden lg:flex flex-col gap-4 mt-4">
            <button 
              onClick={onContinueShopping}
              className="w-full bg-primary hover:bg-secondary text-white font-bold py-5 px-8 rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 group active:scale-95 uppercase tracking-widest text-sm"
            >
              Continue Shopping <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex gap-4">
              <button 
                onClick={handleViewDetails}
                className="flex-1 bg-white border border-taupe/30 hover:border-secondary text-secondary font-bold py-5 px-8 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md uppercase tracking-widest text-xs"
              >
                <FiFileText className="text-xl" /> View Details
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="flex-1 bg-white border border-taupe/30 hover:border-secondary text-secondary font-bold py-5 px-8 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md uppercase tracking-widest text-xs"
              >
                <FiDownload className="text-xl" /> Download Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5" id="order-summary-section">
          <div className="bg-white rounded-2xl p-8 border border-secondary/5 shadow-soft sticky top-28">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-taupe/10">
              <h3 className="text-lg font-bold text-secondary">Order Summary</h3>
              <span className="text-xs font-bold text-taupe uppercase tracking-widest">{order.items.length} Items</span>
            </div>

            <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 rounded-xl bg-ivory border border-taupe/10 overflow-hidden shrink-0 shadow-sm">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="font-bold text-secondary text-sm mb-1 leading-tight">{item.name}</h4>
                    <p className="text-[10px] text-taupe font-bold uppercase tracking-wider mb-2">{item.color} | Qty: {item.quantity}</p>
                    <p className="font-serif font-bold text-secondary text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 py-6 border-t border-taupe/10 text-sm font-medium text-grey">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-secondary font-bold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-700 font-bold uppercase text-[10px] tracking-widest">Free</span>
              </div>
            </div>

            <div className="pt-6 border-t border-taupe/10 mt-6 flex justify-between items-end">
              <span className="font-bold text-secondary text-lg">Total</span>
              <div className="flex flex-col items-end">
                <span className="font-serif text-3xl font-bold text-primary">${total.toFixed(2)}</span>
                <span className="text-[10px] font-bold text-taupe uppercase tracking-widest">USD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (Mobile) */}
        <div className="lg:hidden flex flex-col gap-4 mt-8">
          <button 
            onClick={onContinueShopping}
            className="w-full bg-primary hover:bg-secondary text-white font-bold py-5 rounded-xl shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
          >
            Continue Shopping <FiArrowRight />
          </button>
          <button 
            onClick={handleViewDetails}
            className="w-full bg-white border border-taupe/30 text-secondary font-bold py-5 rounded-xl shadow-sm uppercase tracking-widest text-xs flex items-center justify-center gap-3"
          >
            <FiFileText className="text-xl" /> View Details
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="w-full bg-white border border-taupe/30 text-secondary font-bold py-5 rounded-xl shadow-sm uppercase tracking-widest text-xs flex items-center justify-center gap-3"
          >
            <FiDownload className="text-xl" /> Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
