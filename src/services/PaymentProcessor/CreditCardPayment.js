const PaymentStatus = require("../../domain/PaymentStatus");

class CreditCardPayment {
  supports(order) {
    return order.getPaymentMethod() === "credit_card";
  }

  process(order) {
    const subtotal = order.getSubtotal();

    return {
      status: PaymentStatus.APPROVED,
      fee: order.getInstallments() > 1 ? subtotal * 0.025 : 0,
      discount: 0
    };
  }
}

module.exports = CreditCardPayment;