const PixPayment = require("./PixPayment");
const CreditCardPayment = require("./CreditCardPayment");
const BoletoPayment = require("./BoletoPayment");

class PaymentProcessor {
  constructor(paymentMethods = [
    new PixPayment(),
    new CreditCardPayment(),
    new BoletoPayment()
  ]) {
    this.paymentMethods = paymentMethods;
  }

  process(order) {
    const paymentMethod = this.paymentMethods.find((method) => method.supports(order));

    if (!paymentMethod) {
      throw new Error("Forma de pagamento invalida.");
    }

    return paymentMethod.process(order);
  }
}

module.exports = PaymentProcessor;