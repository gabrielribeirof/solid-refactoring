class NotificationService {
  sendOrderConfirmation(order) {
    const pricing = order.getPricing();
    console.log(`Pedido ${order.getId()} confirmado para ${order.getCustomer().getEmail()}: R$ ${pricing.total.toFixed(2)}`);
  }
}

module.exports = NotificationService;