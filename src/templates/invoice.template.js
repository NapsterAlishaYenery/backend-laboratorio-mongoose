function buildInvoiceTemplate(data) {
  // 1. Definimos la nota según el método de pago que VIENE en 'data'
  let notaMetodoPago = '';

  if (data.paymentMethod === 'pay-later') {
    notaMetodoPago = `
      <div style="background: #fff9e6; padding: 10px; border-radius: 4px; margin-top: 20px; font-size: 13px; color: #856404; border-left: 4px solid #ffc107;">
        <strong>Instrucciones de Pago:</strong> Este pedido está pendiente de pago. Por favor, realice la transferencia a:<br>
        <strong>Banco Popular:</strong> 123-456789-0 | <strong>A nombre de:</strong> AnthonyWeb SRL<br>
        <em>Envíe su comprobante respondiendo a este correo o vía WhatsApp.</em>
      </div>`;
  } else {
    notaMetodoPago = `
      <div style="background: #e9f5ff; padding: 10px; border-radius: 4px; margin-top: 20px; font-size: 11px; color: #555; border-left: 4px solid #007bff;">
        <strong>Nota aclaratoria:</strong> Este pedido fue procesado de forma segura a través de PayPal. El monto reflejado en su estado de cuenta bancario podría aparecer en USD según la tasa de cambio vigente de su entidad financiera.
      </div>`;
  }


  // --- ADAPTACIÓN DE DATOS PARA MANTENER TU DISEÑO ---
  // Extraemos de 'summary' y 'customer' para que tus variables sigan funcionando
  const subtotal = data.summary?.subtotal || 0;
  const delivery = data.summary?.delivery || 0;
  const itbisValue = data.summary?.itbis || 0;

  const itbis = Number(itbisValue.toFixed(2));
  const total = Number((subtotal + itbisValue + delivery).toFixed(2));

  // Datos del cliente
  const name = data.customer?.name || '';
  const email = data.customer?.email || '';
  const phone = data.customer?.phone || '';

  const itemsHtml = data.items.map(item => {

    const unitPrice = (item.breakdown && item.breakdown.unitTotal) ? item.breakdown.unitTotal : item.price;

    let html = `
      <tr style="border-bottom:1px solid #eee">
        <td style="padding:8px 0">
          <strong>${item.name}</strong><br/>
          <span style="color:#666; font-size:13px">
            Cantidad: ${item.quantity} &nbsp;|&nbsp;
            Precio unitario: RD$ ${unitPrice}
          </span>
        </td>
        <td align="right" style="padding:8px 0">
          <strong>RD$ ${item.total}</strong>
        </td>
      </tr>
    `;


    // DETALLE DE PRODUCTO PERSONALIZADO
    if (item.breakdown && item.breakdown.basePrice) {
      html += `
        <tr>
          <td colspan="2" style="padding-left:20px; padding-bottom:10px; font-size:13px; color:#444">
            <div>
              <strong>Detalle del producto:</strong>
            </div>
            <div>Precio base: RD$ ${item.breakdown.basePrice}</div>

            ${item.breakdown.weightPrice
          ? `<div>Peso (${item.weight?.label}): +RD$ ${item.breakdown.weightPrice}</div>`
          : ""
        }

            ${item.fillings?.length
          ? `
                  <div style="margin-top:6px">
                    <strong>Rellenos:</strong>
                    <ul style="margin:4px 0 0 16px; padding:0">
                      ${item.fillings.map(f =>
            `<li>
                          ${f.label} ${f.totalPrice > 0
              ? `(+RD$ ${f.totalPrice})`
              : `(Incluido)`
            }
                        </li>`
          ).join("")}
                    </ul>
                  </div>
                `
          : ""
        }

            ${item.flavors?.length
          ? `<div><strong>Sabores:</strong> ${item.flavors.join(", ")}</div>`
          : ""
        }
          </td>
        </tr>
      `;
    }

    return html;

  }).join("");

  return `
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin:auto; background:#ffffff; padding:20px; border:1px solid #eee">

    <div style="text-align:center; margin-bottom:20px">
      <img src="https://backend-laboratorio-mongoose.onrender.com/uploads/logo2.jpg" width="120" />
    </div>

    <h2 style="margin-bottom:4px">Factura de tu pedido</h2>
    <p style="color:#666">Orden #${data.orderNumber}</p>

    <hr/>

    <p><strong>Cliente:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Teléfono:</strong> ${phone}</p>

    <hr/>

    <table width="100%" cellpadding="0" cellspacing="0">
      <thead>
        <tr style="background:#f5f5f5">
          <th align="left" style="padding:8px">Producto</th>
          <th align="right" style="padding:8px">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <hr/>

    <table width="100%" cellpadding="6">
      <tr>
        <td align="right">Subtotal:</td>
        <td align="right" width="120">RD$ ${subtotal}</td>
      </tr>
      <tr>
        <td align="right">ITBIS (18%):</td>
        <td align="right">RD$ ${itbis}</td>
      </tr>
      <tr>
        <td align="right">Delivery:</td>
        <td align="right">RD$ ${delivery}</td>
      </tr>
      <tr>
        <td align="right"><strong>Total a pagar:</strong></td>
        <td align="right"><strong>RD$ ${total}</strong></td>
      </tr>
    </table>

    <hr/>

   ${notaMetodoPago}

    <hr/>

    <p style="font-size:12px; color:#777; text-align:center">
      Gracias por tu compra ❤️<br/>
      Este correo es una confirmación automática de tu pedido.
    </p>

  </div>
  `;
}

module.exports = { buildInvoiceTemplate };
