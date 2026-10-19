class OrderPricing {
  static from(order, payment) {
    const subtotal = order.getSubtotal();
    const discount = OrderPricing.calculateDiscount(order, subtotal) + payment.discount;
    const freight = OrderPricing.calculateFreight(order);

    return new OrderPricing({
      subtotal,
      discount,
      freight,
      paymentFee: payment.fee,
      payment
    });
  }

  static calculateDiscount(order, subtotal) {
    let discount = 0;

    if (order.getCustomer().getType() === "vip") {
      discount += subtotal * 0.08;
    }

    if (order.getCustomer().getType() === "employee") {
      discount += subtotal * 0.15;
    }

    if (order.hasCoupon("TECH10")) {
      discount += subtotal * 0.1;
    }

    if (subtotal > 8000) {
      discount += 250;
    }

    return discount;
  }

  static calculateFreight(order) {
    if (order.hasCoupon("FRETEGRATIS")) {
      return 0;
    }

    const rates = {
      sudeste: [20, 4],
      sul: [28, 5],
      "centro-oeste": [35, 6],
      nordeste: [45, 7],
      norte: [60, 9]
    };
    const [base, rate] = rates[order.getCustomer().getRegion()] || [50, 8];

    return base + order.getTotalWeight() * rate;
  }

  constructor({ subtotal, discount, freight, paymentFee, payment }) {
    const total = Number((subtotal - discount + freight + paymentFee).toFixed(2));

    if (total <= 0) {
      throw new Error("Total do pedido invalido.");
    }

    this.subtotal = subtotal;
    this.discount = discount;
    this.freight = freight;
    this.paymentFee = paymentFee;
    this.total = total;
    this.payment = payment;

    Object.freeze(this);
  }
}

module.exports = OrderPricing;