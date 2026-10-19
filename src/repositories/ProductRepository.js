const Product = require("../domain/Product");

class ProductRepository {
  constructor() {
    this.products = [
      new Product("p1", "Notebook Pro 14", "notebook", 6200, 2.1, 8),
      new Product("p2", "Mouse Sem Fio", "peripheral", 120, 0.2, 30),
      new Product("p3", "Monitor 27", "monitor", 1450, 5.4, 12),
      new Product("p4", "Teclado Mecanico", "peripheral", 380, 0.9, 15)
    ];
  }

  findById(id) {
    return this.products.find((product) => product.getId() === id);
  }

  save(product) {
    const index = this.products.findIndex((storedProduct) => storedProduct.getId() === product.getId());

    if (index === -1) {
      this.products.push(product);
    } else {
      this.products[index] = product;
    }

    return product;
  }

  findAll() {
    return [...this.products];
  }
}

module.exports = ProductRepository;