# Diagrama de Classes Atual

O diagrama abaixo representa a arquitetura refatorada. `repositories` e `infrastructure` pertencem à mesma camada de infraestrutura; o domínio concentra entidades, estados e pricing; e `OrderService` coordena os serviços especializados. Os atributos com `-` são campos privados das entidades. Os contratos das dependências são implícitos, seguindo o duck typing do JavaScript.

```mermaid
classDiagram
    namespace Dominio {
        class Address {
            -street
            -number
            -city
            -state
            -zipCode
            -region
            +getRegion()
            +getLocation()
            +getCity()
            +getState()
        }

        class Customer {
            -id
            -name
            -email
            -phone
            -type
            -address
            +getId()
            +getName()
            +getEmail()
            +getType()
            +changeType(type)
            +getRegion()
            +getLocation()
            +getCity()
            +getState()
        }

        class Product {
            -id
            -name
            -category
            -price
            -weight
            -stock
            +getId()
            +getName()
            +getPrice()
            +getWeight()
            +getStock()
            +hasStock(quantity)
            +decreaseStock(quantity)
        }

        class OrderItem {
            -product
            -quantity
            +getSubtotal()
            +getProductId()
            +getProductName()
            +getProductWeight()
            +getQuantity()
            +changeQuantity(quantity)
        }

        class Order {
            -id
            -customer
            -items
            -couponCode
            -paymentMethod
            -installments
            -status
            -createdAt
            -pricing
            +addItem(item)
            +getItems()
            +changeItemQuantity(index, quantity)
            +getId()
            +getCustomer()
            +getPaymentMethod()
            +getInstallments()
            +hasCoupon(couponCode)
            +applyCoupon(couponCode)
            +getStatus()
            +isConfirmed()
            +getCreatedAt()
            +getPricing()
            +getTotalItems()
            +pay(payment)
            +confirm()
            +awaitPayment()
            +getSubtotal()
            +getTotalWeight()
            +validate()
        }

        class OrderPricing {
            +subtotal
            +discount
            +freight
            +paymentFee
            +total
            +payment
            +from(order, payment)$
        }

        class OrderStatus {
            +isCreated()
            +isConfirmed()
            +isWaitingPayment()
        }

        class PaymentStatus {
            +isApproved()
            +isWaitingPayment()
        }
    }

    namespace Servicos {
        class OrderService {
            +process(order)
        }

        class PaymentProcessor {
            +paymentMethods
            +process(order)
        }

        class PixPayment {
            +supports(order)
            +process(order)
        }

        class CreditCardPayment {
            +supports(order)
            +process(order)
        }

        class BoletoPayment {
            +supports(order)
            +process(order)
        }

        class InventoryService {
            +reserve(order)
        }

        class OrderSummaryService {
            +create(order)
        }
    }

    namespace Entrada {
        class Index {
            <<composition root>>
        }
    }

    namespace Infraestrutura {
        class ProductRepository {
            +products
            +findById(id)
            +findAll()
            +save(product)
        }

        class OrderRepository {
            +orders
            +findAll()
            +save(order)
        }

        class NotificationService {
            +sendOrderConfirmation(order)
        }

        class ConsoleOrderReporter {
            +report(summary, order)
        }

        class Logger {
            +info(message)
            +warn(message)
            +error(message)
        }
    }

    Order *-- Customer : possui
    Customer *-- Address : possui
    Order *-- OrderItem : contem
    OrderItem --> Product : referencia
    Order *-- OrderPricing : produz
    Order --> OrderStatus : usa

    Index ..> ProductRepository : cria
    Index ..> OrderRepository : cria
    Index ..> OrderService : monta
    Index ..> InventoryService : injeta
    Index ..> PaymentProcessor : injeta
    Index ..> NotificationService : injeta
    Index ..> ConsoleOrderReporter : injeta
    Index ..> Logger : injeta

    OrderService ..> PaymentProcessor : solicita pagamento
    OrderService ..> InventoryService : reserva estoque
    OrderService ..> OrderRepository : persiste
    OrderService ..> OrderSummaryService : cria resumo
    OrderService ..> NotificationService : notifica
    OrderService ..> ConsoleOrderReporter : relata
    OrderService ..> Logger : registra

    PaymentProcessor o-- PixPayment : estrategia
    PaymentProcessor o-- CreditCardPayment : estrategia
    PaymentProcessor o-- BoletoPayment : estrategia
    PixPayment --> PaymentStatus : retorna
    CreditCardPayment --> PaymentStatus : retorna
    BoletoPayment --> PaymentStatus : retorna

    InventoryService ..> ProductRepository : consulta e salva
    ProductRepository o-- Product : armazena
    OrderRepository o-- Order : armazena
    OrderSummaryService ..> OrderPricing : le pricing
    NotificationService ..> Order : le pedido
    ConsoleOrderReporter ..> Order : le pedido
```
