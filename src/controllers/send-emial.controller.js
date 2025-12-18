const nodemailer = require("nodemailer");

// Funciones que construyen los HTML
const {buildContactTemplate} = require("../templates/contact.template");
const { buildInvoiceTemplate } = require("../templates/invoice.template");

exports.sendMail = async (req, res) => {
  try {

    // Extraer payload
    const { type, data } = req.body;

    if (!type || !data) {
      return res.status(400).json({
        error: "Payload inválido"
      });
    }


    //transporter SMTP optimizado para Render
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD
      },
      // Configuración de tiempos de espera para evitar ETIMEDOUT
      connectionTimeout: 30000, // 30 segundos
      greetingTimeout: 30000,   // 30 segundos
      socketTimeout: 45000,     // 45 segundos
      tls: {
        // Esto permite que la conexión pase aunque Render use un proxy intermedio
        rejectUnauthorized: false
      }
    });


    // Variables del email
    let subject = "";
    let html = "";
    let to = "";

    // EMAIL DE CONTACTO
    
    if (type === "contact") {
      subject = " Nuevo mensaje de contacto";

      // se envía a tu correo de la empresa
      to = process.env.CONTACT_EMAIL_RECEIVER;

      // Generar HTML del correo de contacto
      html = buildContactTemplate(data);
    }

  
    //  EMAIL DE CHECKOUT / FACTURA
    if (type === "checkout") {

      const orderNumber = `ORD-${Date.now()}`; // un ejemplo de id de factura si existiera en el backend

      subject = `# Factura de tu pedido #${orderNumber}`;

      // La factura se envía al cliente
      to = data.email;

      // Generar HTML de la factura
      html = buildInvoiceTemplate({
        orderNumber,
        ...data
      });
    }

    // Validación final
    // Si no se construyó el correo, el tipo es inválido
    if (!subject || !html || !to) {
      return res.status(400).json({
        error: "Tipo de email no soportado"
      });
    }


    // 1. Definimos las opciones básicas
    const mailOptions = {
      from: `"AnthonyWeb" <${process.env.EMAIL_SENDER}>`,
      to,
      subject,
      html
    };

    
    // verificar que sea checkout solamente
    if (type === "checkout") {
      mailOptions.bcc = process.env.CONTACT_EMAIL_RECEIVER;
    }

    // 3. Enviamos usando el objeto mailOptions
    await transporter.sendMail(mailOptions);


    // Respuesta al frontend
    return res.status(200).json({
      message: "Correo enviado correctamente"
    });

  } catch (error) {

    // Error inesperado (SMTP, credenciales, red, etc.)
    console.error("Error enviando correo:", error);

    return res.status(500).json({
      error: "Error enviando correo"
    });
  }
};
