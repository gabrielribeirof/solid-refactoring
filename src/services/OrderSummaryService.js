class OrderSummaryService {
  create(order) {
    const customer = order.getCustomer();
    const pricing = order.getPricing();

    return {
      id: order.getId(),
      customerName: customer.getName(),
      customerEmail: customer.getEmail(),
      city: customer.getCity(),
      state: customer.getState(),
      items: order.getItems().map((item) => ({
        productId: item.getProductId(),
        name: item.getProductName(),
        quantity: item.getQuantity(),
        subtotal: item.getSubtotal()
      })),
      subtotal: pricing.subtotal,
      discount: Number(pricing.discount.toFixed(2)),
      freight: Number(pricing.freight.toFixed(2)),
      paymentFee: Number(pricing.paymentFee.toFixed(2)),
      total: pricing.total,
      paymentMethod: order.getPaymentMethod(),
      status: order.getStatus().toString(),
      createdAt: order.getCreatedAt()
    };
  }
}

module.exports = OrderSummaryService;