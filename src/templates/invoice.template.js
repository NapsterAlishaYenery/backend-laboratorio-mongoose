function buildInvoiceTemplate(data) {

  const itbis = Number(data.itbis.toFixed(2));
  const total = Number((data.subtotal + itbis + data.delibery).toFixed(2));

  const itemsHtml = data.items.map(item => {

    const unitPrice = item.breakdown
      ? item.breakdown.unitTotal
      : item.price;

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
    if (item.breakdown) {
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

    <p><strong>Cliente:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Teléfono:</strong> ${data.phone}</p>

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
        <td align="right" width="120">RD$ ${data.subtotal}</td>
      </tr>
      <tr>
        <td align="right">ITBIS (18%):</td>
        <td align="right">RD$ ${itbis}</td>
      </tr>
      <tr>
        <td align="right">Delivery:</td>
        <td align="right">RD$ ${data.delibery}</td>
      </tr>
      <tr>
        <td align="right"><strong>Total a pagar:</strong></td>
        <td align="right"><strong>RD$ ${total}</strong></td>
      </tr>
    </table>

    <hr/>

    <p style="font-size:12px; color:#777; text-align:center">
      Gracias por tu compra ❤️<br/>
      Este correo es una confirmación automática de tu pedido.
    </p>

  </div>
  `;
}

module.exports = { buildInvoiceTemplate };
