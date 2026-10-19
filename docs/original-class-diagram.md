# Diagrama de Classes Original

Este diagrama representa a estrutura antes da refatoração. O `OrderService` concentrava validação, cálculo de preços, pagamento, estoque, persistência, notificação e saída em console.

```mermaid
classDiagram
    namespace Entrada {
        class Index {
            <<src/index.js>>
        }
    }

    namespace Dominio {
        class Address {
            +street
            +number
            +city
            +state
            +zipCode
            +region
        }

        class Customer {
            +id
            +name
            +email
            +phone
            +type
            +address
        }

        class Product {
            +id
            +name
            +category
            +price
            +weight
            +stock
        }

        class OrderItem {
            +product
            +quantity
            +getSubtotal()
        }

        class Order {
            +id
            +customer
            +items
            +couponCode
            +paymentMethod
            +installments
            +status
            +createdAt
            +getTotalItems()
            +getSubtotal()
            +getTotalWeight()
        }
    }

    namespace Aplicacao {
        class OrderService {
            +productRepository
            +orderRepository
            +notificationService
            +logger
            +process(order)
        }
    }

    namespace Infraestrutura {
        class ProductRepository {
            +products
            +findById(id)
            +updateStock(productId, quantity)
            +list()
        }

        class OrderRepository {
            +orders
            +save(orderSummary)
            +findAll()
        }

        class NotificationService {
            <<referenciado, mas ausente>>
            +sendOrderConfirmation(customer, orderId, total)
        }

        class Logger {
            +info(message)
            +warn(message)
            +error(message)
        }
    }

    Index ..> OrderService : inicia
    Index ..> ProductRepository : consulta

    Order *-- Customer : pertence a
    Customer *-- Address : possui
    Order *-- OrderItem : contem
    OrderItem --> Product : referencia
    ProductRepository o-- Product : armazena

    OrderService ..> ProductRepository : consulta e atualiza
    OrderService ..> OrderRepository : persiste
    OrderService ..> NotificationService : notifica
    OrderService ..> Logger : registra
    OrderService ..> Customer : acessa campos
    OrderService ..> Address : acessa campos aninhados
    OrderService ..> OrderItem : calcula subtotais
```