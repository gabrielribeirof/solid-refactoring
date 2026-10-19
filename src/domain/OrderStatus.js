class OrderStatus {
  constructor(value) {
    this.value = value;
    Object.freeze(this);
  }

  isCreated() {
    return this === OrderStatus.CREATED;
  }

  isConfirmed() {
    return this === OrderStatus.CONFIRMED;
  }

  isWaitingPayment() {
    return this === OrderStatus.WAITING_PAYMENT;
  }

  toString() {
    return this.value;
  }
}

OrderStatus.CREATED = new OrderStatus("created");
OrderStatus.CONFIRMED = new OrderStatus("confirmed");
OrderStatus.WAITING_PAYMENT = new OrderStatus("waiting_payment");

module.exports = OrderStatus;