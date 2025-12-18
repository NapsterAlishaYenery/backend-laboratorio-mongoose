function buildContactTemplate(data) {
  return `
  <div style="font-family: Arial; max-width: 600px; margin:auto">
    <img src="https://backend-laboratorio-mongoose.onrender.com/uploads/logo2.jpg" width="120" />

    <h2>Nuevo mensaje de contacto</h2>

    <p><strong>Nombre:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Teléfono:</strong> ${data.phone}</p>

    <hr />

    <p>${data.message}</p>
  </div>
  `;
}

module.exports = { buildContactTemplate};
