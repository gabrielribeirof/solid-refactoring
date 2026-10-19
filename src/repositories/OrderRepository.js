class OrderRepository {
  constructor() {
    this.orders = [];
  }

  save(order) {
    this.orders.push(order);
    return order;
  }

  findAll() {
    return [...this.orders];
  }
}

module.exports = OrderRepository;