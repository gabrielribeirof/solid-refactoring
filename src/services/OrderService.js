class OrderService {
  constructor({
    inventoryService,
    orderRepository,
    paymentProcessor,
    orderSummaryService,
    notificationService,
    logger,
    reporter
  }) {
    this.inventoryService = inventoryService;
    this.orderRepository = orderRepository;
    this.paymentProcessor = paymentProcessor;
    this.orderSummaryService = orderSummaryService;
    this.notificationService = notificationService;
    this.logger = logger;
    this.reporter = reporter;
  }

  process(order) {
    this.logger.info(`Iniciando processamento do pedido ${order.getId()}.`);

    const payment = this.paymentProcessor.process(order);
    order.pay(payment);

    this.inventoryService.reserve(order);
    this.orderRepository.save(order);

    if (order.isConfirmed()) {
      this.notificationService.sendOrderConfirmation(order);
    } else {
      this.logger.warn(`Pedido ${order.getId()} aguardando pagamento.`);
    }

    const orderSummary = this.orderSummaryService.create(order);

    this.reporter.report(orderSummary, order);

    return orderSummary;
  }

}

module.exports = OrderService;