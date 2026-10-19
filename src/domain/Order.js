const OrderStatus = require("./OrderStatus");
const OrderPricing = require("./OrderPricing");

class Order {
  constructor(id, customer, items = [], couponCode, paymentMethod, installments) {
    if (!id) {
      throw new Error("Identificador do pedido obrigatorio.");
    }

    if (!customer) {
      throw new Error("Cliente obrigatorio.");
    }

    this.#id = id;
    this.#customer = customer;
    this.#items = [];
    this.#couponCode = couponCode;
    this.#paymentMethod = paymentMethod;
    this.#installments = installments;
    this.#status = OrderStatus.CREATED;
    this.#createdAt = new Date();
    this.#pricing = null;

    items.forEach((item) => this.addItem(item));
    this.validate();
  }

  #id;
  #customer;
  #items;
  #couponCode;
  #paymentMethod;
  #installments;
  #status;
  #createdAt;
  #pricing;

  addItem(item) {
    if (!item || typeof item.getSubtotal !== "function") {
      throw new Error("Item de pedido invalido.");
    }

    this.#items.push(item);
    return this;
  }

  getItems() {
    return [...this.#items];
  }

  changeItemQuantity(index, quantity) {
    const item = this.#items[index];

    if (!item) {
      throw new Error("Item de pedido nao encontrado.");
    }

    item.changeQuantity(quantity);
  }

  getId() {
    return this.#id;
  }

  getCustomer() {
    return this.#customer;
  }

  getPaymentMethod() {
    return this.#paymentMethod;
  }

  getInstallments() {
    return this.#installments;
  }

  hasCoupon(couponCode) {
    return this.#couponCode === couponCode;
  }

  applyCoupon(couponCode) {
    this.#couponCode = couponCode;
  }

  getStatus() {
    return this.#status;
  }

  isConfirmed() {
    return this.#status.isConfirmed();
  }

  getCreatedAt() {
    return this.#createdAt;
  }

  getPricing() {
    if (!this.#pricing) {
      throw new Error("Pedido ainda nao foi precificado.");
    }

    return { ...this.#pricing };
  }

  getTotalItems() {
    return this.#items.reduce((total, item) => total + item.getQuantity(), 0);
  }

  getSubtotal() {
    return this.#items.reduce((total, item) => total + item.getSubtotal(), 0);
  }

  getTotalWeight() {
    return this.#items.reduce((total, item) => total + item.getProductWeight() * item.getQuantity(), 0);
  }

  validate() {
    if (this.#items.length === 0) {
      throw new Error("Pedido sem itens.");
    }
  }

  pay(payment) {
    this.#pricing = OrderPricing.from(this, payment);

    if (payment.status.isApproved()) {
      this.confirm();
    } else {
      this.awaitPayment();
    }

    return this.getPricing();
  }

  confirm() {
    if (!this.#status.isCreated()) {
      throw new Error("Pedido nao pode ser confirmado neste estado.");
    }

    this.#status = OrderStatus.CONFIRMED;
  }

  awaitPayment() {
    if (!this.#status.isCreated()) {
      throw new Error("Pedido nao pode aguardar pagamento neste estado.");
    }

    this.#status = OrderStatus.WAITING_PAYMENT;
  }
}

module.exports = Order;
