class OrderItem {
  constructor(product, quantity) {
    if (!product) {
      throw new Error("Item sem produto.");
    }

    if (quantity <= 0) {
      throw new Error("Quantidade invalida.");
    }

    this.#product = product;
    this.#quantity = quantity;
  }

  #product;
  #quantity;

  getSubtotal() {
    return this.#product.getPrice() * this.#quantity;
  }

  getProductId() {
    return this.#product.getId();
  }

  getProductName() {
    return this.#product.getName();
  }

  getProductWeight() {
    return this.#product.getWeight();
  }

  getQuantity() {
    return this.#quantity;
  }

  changeQuantity(quantity) {
    if (quantity <= 0) {
      throw new Error("Quantidade invalida.");
    }

    this.#quantity = quantity;
  }
}

module.exports = OrderItem;
