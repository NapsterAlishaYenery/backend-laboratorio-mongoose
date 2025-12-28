/**
 * SDK OFICIAL DE PAYPAL PARA CHECKOUT (SERVER)
 * npm install @paypal/checkout-server-sdk
 */

const paypal = require("@paypal/checkout-server-sdk");

/**
 * Creamos el entorno de PayPal
 * Sandbox = dinero falso (para pruebas)
 * Live = dinero real (producción)
 */
function environment() {
  return new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,      // Client ID del dashboard de PayPal
    process.env.PAYPAL_CLIENT_SECRET   // Secret del dashboard de PayPal
  );
}

/**
 * Cliente HTTP que se usará para TODAS
 * las peticiones a PayPal (crear y capturar órdenes)
 */
const paypalClient = new paypal.core.PayPalHttpClient(environment());

/**
 * Exportamos el cliente
 */
module.exports = { paypalClient };