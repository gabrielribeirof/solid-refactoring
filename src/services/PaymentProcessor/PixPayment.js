const PaymentStatus = require("../../domain/PaymentStatus");

class PixPayment {
  supports(order) {
    return order.getPaymentMethod() === "pix";
  }

  process(order) {
    return { status: PaymentStatus.APPROVED, fee: 0, discount: order.getSubtotal() * 0.03 };
  }
}

module.exports = PixPayment;