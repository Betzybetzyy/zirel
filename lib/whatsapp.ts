import { CartItem } from "./cart-store";
import { formatCLP } from "./utils-format";

type Customer = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  comuna?: string;
  notes?: string;
};

export function buildWhatsAppMessage(
  orderNumber: number,
  customer: Customer,
  items: CartItem[],
  total: number
): string {
  const lines: string[] = [];

  lines.push(`✦ *NUEVO PEDIDO ZIREL #${orderNumber}* ✦`);
  lines.push("");
  lines.push("*Cliente:*");
  lines.push(`${customer.name}`);
  lines.push(`Email: ${customer.email}`);
  lines.push(`Tel: ${customer.phone}`);
  if (customer.address) {
    lines.push(`Dir: ${customer.address}${customer.comuna ? `, ${customer.comuna}` : ""}`);
  }
  lines.push("");
  lines.push("*Productos:*");

  items.forEach((item) => {
    lines.push(
      `• ${item.name} (${item.sku})`
    );
    lines.push(
      `  ${item.quantity} × ${formatCLP(item.price)} = ${formatCLP(item.price * item.quantity)}`
    );
  });

  lines.push("");
  lines.push(`*TOTAL: ${formatCLP(total)}*`);

  if (customer.notes) {
    lines.push("");
    lines.push("*Comentarios:*");
    lines.push(customer.notes);
  }

  lines.push("");
  lines.push("¿Coordinamos pago y envío? ✦");

  return lines.join("\n");
}

export function buildWhatsAppUrl(
  phoneNumber: string,
  message: string
): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}