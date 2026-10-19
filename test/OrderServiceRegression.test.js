const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const test = require("node:test");

const ORIGINAL_OUTPUT = `[INFO] Iniciando processamento do pedido o1001.
Pedido o1001 confirmado para ana.souza@example.com: R$ 5471.80
Resumo do pedido
Cliente: Ana Souza
Cidade: Presidente Prudente/SP
Itens: 3
Subtotal: R$ 6440.00
Desconto: R$ 1159.20
Frete: R$ 30.00
Taxas: R$ 161.00
Total: R$ 5471.80
{
  "id": "o1001",
  "customerName": "Ana Souza",
  "customerEmail": "ana.souza@example.com",
  "city": "Presidente Prudente",
  "state": "SP",
  "items": [
    {
      "productId": "p1",
      "name": "Notebook Pro 14",
      "quantity": 1,
      "subtotal": 6200
    },
    {
      "productId": "p2",
      "name": "Mouse Sem Fio",
      "quantity": 2,
      "subtotal": 240
    }
  ],
  "subtotal": 6440,
  "discount": 1159.2,
  "freight": 30,
  "paymentFee": 161,
  "total": 5471.8,
  "paymentMethod": "credit_card",
  "status": "confirmed",
  "createdAt": "<createdAt>"
}
`;

function runApplication() {
  return spawnSync(process.execPath, [path.join(__dirname, "../src/index.js")], {
    encoding: "utf8"
  });
}

function normalizeDynamicValues(output) {
  return output.replace(/"createdAt": "[^"]+"/, '"createdAt": "<createdAt>"');
}

test("preserva exatamente a saida observavel do codigo original", () => {
  const result = runApplication();

  assert.equal(result.status, 0, result.stderr);
  assert.equal(normalizeDynamicValues(result.stdout), ORIGINAL_OUTPUT);
});