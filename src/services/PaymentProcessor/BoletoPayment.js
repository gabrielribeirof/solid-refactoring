const PaymentStatus = require("../../domain/PaymentStatus");

class BoletoPayment {
  supports(order) {
    return order.getPaymentMethod() === "boleto";
  }

  process() {
    return { status: PaymentStatus.WAITING_PAYMENT, fee: 0, discount: 0 };
  }
}

module.exports = BoletoPayment;