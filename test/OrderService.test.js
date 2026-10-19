const assert = require("node:assert/strict");
const test = require("node:test");

const Address = require("../src/domain/Address");
const Customer = require("../src/domain/Customer");
const Order = require("../src/domain/Order");
const PaymentStatus = require("../src/domain/PaymentStatus");
const OrderItem = require("../src/domain/OrderItem");
const ProductRepository = require("../src/repositories/ProductRepository");
const OrderRepository = require("../src/repositories/OrderRepository");
const OrderService = require("../src/services/OrderService");
const PaymentProcessor = require("../src/services/PaymentProcessor/PaymentProcessor");
const OrderSummaryService = require("../src/services/OrderSummaryService");
const InventoryService = require("../src/services/InventoryService");

function createService(overrides = {}) {
  const dependencies = {
    productRepository: new ProductRepository(),
    inventoryService: null,
    orderRepository: new OrderRepository(),
    paymentProcessor: new PaymentProcessor(),
    orderSummaryService: new OrderSummaryService(),
    notificationService: { sendOrderConfirmation() {} },
    logger: { info() {}, warn() {} },
    reporter: { report() {} },
    ...overrides
  };

  dependencies.inventoryService = dependencies.inventoryService || new InventoryService(dependencies.productRepository);
  return { service: new OrderService(dependencies), ...dependencies };
}

function createOrder(paymentMethod = "credit_card", installments = 3) {
  const customer = new Customer(
    "c1",
    "Ana Souza",
    "ana.souza@example.com",
    "18999990000",
    "vip",
    new Address("Rua das Palmeiras", "120", "Presidente Prudente", "SP", "19000-000", "sudeste")
  );
  const productRepository = new ProductRepository();

  return {
    order: new Order(
      "o1001",
      customer,
      [
        new OrderItem(productRepository.findById("p1"), 1),
        new OrderItem(productRepository.findById("p2"), 2)
      ],
      "TECH10",
      paymentMethod,
      installments
    ),
    customer
  };
}

test("processa pedido aprovado e persiste o resumo", () => {
  const { service, orderRepository } = createService();
  const { order } = createOrder();

  const summary = service.process(order);

  assert.equal(summary.total, 5471.8);
  assert.equal(summary.status, "confirmed");
  assert.equal(orderRepository.findAll().length, 1);
  assert.equal(order.getStatus().isConfirmed(), true);
});

test("Customer rejeita e-mail invalido na construcao", () => {
  assert.throws(
    () => new Customer(
      "c1",
      "Ana Souza",
      "email-invalido",
      "18999990000",
      "vip",
      new Address("Rua das Palmeiras", "120", "Presidente Prudente", "SP", "19000-000", "sudeste")
    ),
    /E-mail do cliente invalido/
  );
});

test("mantem pedido aguardando pagamento para boleto", () => {
  const notifications = [];
  const { service } = createService({
    notificationService: {
      sendOrderConfirmation(...args) {
        notifications.push(args);
      }
    }
  });
  const { order } = createOrder("boleto");

  const summary = service.process(order);

  assert.equal(summary.status, "waiting_payment");
  assert.deepEqual(notifications, []);
});

test("rejeita estoque insuficiente antes de alterá-lo", () => {
  const { service, productRepository } = createService();
  const { order } = createOrder();
  const notebook = productRepository.findById("p1");
  const initialStock = notebook.getStock();
  order.changeItemQuantity(0, initialStock + 1);

  assert.throws(() => service.process(order), /Estoque insuficiente/);
  assert.equal(notebook.getStock(), initialStock);
});

test("usa as dependências fornecidas pelo composition root", () => {
  const savedOrders = [];
  const orderRepository = {
    save(order) {
      savedOrders.push(order);
    }
  };
  const { service } = createService({ orderRepository });
  const { order } = createOrder();

  service.process(order);

  assert.equal(savedOrders.length, 1);
});

test("publica o resumo pela porta de saída", () => {
  const reports = [];
  const { service } = createService({
    reporter: {
      report(summary, order) {
        reports.push({ summary, order });
      }
    }
  });
  const { order } = createOrder();

  service.process(order);

  assert.equal(reports.length, 1);
  assert.equal(reports[0].summary.id, "o1001");
  assert.equal(reports[0].order, order);
});

test("Order rejeita total invalido como regra de dominio", () => {
  const { order } = createOrder();

  assert.throws(
    () => order.pay({ status: PaymentStatus.APPROVED, discount: 7000, fee: 0 }),
    /Total do pedido invalido/
  );
});

test("Order calcula sua própria precificação de domínio", () => {
  const { order } = createOrder();
  const paymentProcessor = new PaymentProcessor();
  const payment = paymentProcessor.process(order);
  const pricing = order.pay(payment);

  assert.equal(pricing.subtotal, 6440);
  assert.equal(pricing.discount, 1159.2);
  assert.equal(pricing.freight, 30);
  assert.equal(pricing.paymentFee, 161);
  assert.equal(pricing.total, 5471.8);
});

test("PaymentProcessor aceita uma nova estrategia sem alterar o processador", () => {
  const { order } = createOrder("debit_card");
  const debitCardPayment = {
    supports(paymentOrder) {
      return paymentOrder.getPaymentMethod() === "debit_card";
    },
    process() {
      return { status: PaymentStatus.APPROVED, fee: 1.5, discount: 0 };
    }
  };
  const processor = new PaymentProcessor([debitCardPayment]);

  assert.deepEqual(processor.process(order), {
    status: PaymentStatus.APPROVED,
    fee: 1.5,
    discount: 0
  });
});

test("ProductRepository persiste alterações usando apenas save", () => {
  const productRepository = new ProductRepository();
  const product = productRepository.findById("p1");

  product.decreaseStock(1);
  productRepository.save(product);

  assert.equal(productRepository.findById("p1").getStock(), 7);
  assert.equal(typeof productRepository.updateStock, "undefined");
});

test("processa pagamento PIX com desconto e sem taxa", () => {
  const { service } = createService();
  const { order } = createOrder("pix");

  const summary = service.process(order);

  assert.equal(summary.paymentFee, 0);
  assert.equal(summary.discount, 1352.4);
  assert.equal(summary.status, "confirmed");
});

test("processa cartão à vista sem taxa", () => {
  const { service } = createService();
  const { order } = createOrder("credit_card", 1);
  order.changeItemQuantity(1, 1);

  const summary = service.process(order);

  assert.equal(summary.paymentFee, 0);
});

test("aplica frete grátis pelo cupom", () => {
  const { service } = createService();
  const { order } = createOrder();
  order.applyCoupon("FRETEGRATIS");

  const summary = service.process(order);

  assert.equal(summary.freight, 0);
});

test("aplica desconto de funcionário", () => {
  const { service } = createService();
  const { order, customer } = createOrder();
  customer.changeType("employee");

  const summary = service.process(order);

  assert.equal(summary.discount, 1610);
});

test("aplica desconto fixo para pedidos acima de oito mil", () => {
  const { service } = createService();
  const { order } = createOrder();
  order.changeItemQuantity(0, 2);

  const summary = service.process(order);

  assert.equal(summary.discount, 2525.2);
});

test("rejeita produto inexistente no estoque", () => {
  const { service } = createService({
    productRepository: { findById: () => undefined }
  });
  const { order } = createOrder();

  assert.throws(() => service.process(order), /Produto p1 nao encontrado/);
});

test("rejeita pedido sem cliente", () => {
  assert.throws(() => new Order("o1002", null, []), /Cliente obrigatorio/);
});

test("rejeita pedido sem itens", () => {
  const customer = createOrder().customer;

  assert.throws(() => new Order("o1002", customer, []), /Pedido sem itens/);
});

test("impede alteração direta do estado encapsulado", () => {
  const { order } = createOrder();

  assert.equal(Object.hasOwn(order, "items"), false);
  assert.equal(Object.hasOwn(order.getItems()[0], "quantity"), false);
  assert.equal(Object.hasOwn(order.getCustomer(), "email"), false);
});