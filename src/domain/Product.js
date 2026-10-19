class Product {
  constructor(id, name, category, price, weight, stock) {
    this.#id = id;
    this.#name = name;
    this.#category = category;
    this.#price = price;
    this.#weight = weight;
    this.#stock = stock;
  }

  #id;
  #name;
  #category;
  #price;
  #weight;
  #stock;

  getId() {
    return this.#id;
  }

  getName() {
    return this.#name;
  }

  getPrice() {
    return this.#price;
  }

  getWeight() {
    return this.#weight;
  }

  getStock() {
    return this.#stock;
  }

  hasStock(quantity) {
    return this.#stock >= quantity;
  }

  decreaseStock(quantity) {
    if (!this.hasStock(quantity)) {
      throw new Error(`Estoque insuficiente para ${this.#name}.`);
    }

    this.#stock -= quantity;
  }
}

module.exports = Product;
