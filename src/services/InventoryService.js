class InventoryService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  reserve(order) {
    const products = order.getItems().map((item) => {
      const product = this.productRepository.findById(item.getProductId());

      if (!product) {
        throw new Error(`Produto ${item.getProductId()} nao encontrado.`);
      }

      if (!product.hasStock(item.getQuantity())) {
        throw new Error(`Estoque insuficiente para ${product.getName()}.`);
      }

      return { product, quantity: item.getQuantity() };
    });

    products.forEach(({ product, quantity }) => {
      product.decreaseStock(quantity);
      this.productRepository.save(product);
    });
  }
}

module.exports = InventoryService;