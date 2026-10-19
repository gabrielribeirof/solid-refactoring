class PaymentStatus {
  constructor(value) {
    this.value = value;
    Object.freeze(this);
  }

  isApproved() {
    return this === PaymentStatus.APPROVED;
  }

  isWaitingPayment() {
    return this === PaymentStatus.WAITING_PAYMENT;
  }

  toString() {
    return this.value;
  }
}

PaymentStatus.APPROVED = new PaymentStatus("approved");
PaymentStatus.WAITING_PAYMENT = new PaymentStatus("waiting_payment");

module.exports = PaymentStatus;