/**
 * Importamos el SDK CORRECTO de PayPal
 * (el mismo que usaste en la configuración)
 */
const paypal = require("@paypal/checkout-server-sdk");

/**
 * Importamos el cliente ya configurado
 * (Sandbox, credenciales, etc.)
 */
const { paypalClient } = require("../config/paypal.config");

/**
 * ======================================================
 * CREAR ORDEN EN PAYPAL
 * ======================================================
 */
const createPayPalOrder = async (totalAmount) => {
  try {
    /**
     * PayPal Sandbox NO acepta DOP (pesos dominicanos)
     * Convertimos el total a USD solo para pruebas
     */
    const USD_RATE = Number(process.env.USD_RATE) || 60; // tasa ficticia SOLO para sandbox este valor se mandaria al .env
    const usdAmount = (totalAmount / USD_RATE).toFixed(2);

    /**
     * Creamos la solicitud para crear una orden
     * Esta clase REEMPLAZA al OrdersController
     */
    const request = new paypal.orders.OrdersCreateRequest();

    /**
     * Le pedimos a PayPal que nos devuelva
     * toda la información de la orden
     */
    request.prefer("return=representation");

    /**
     * Cuerpo de la orden que se envía a PayPal
     */
    request.requestBody({
      intent: "CAPTURE", // cobrar inmediatamente
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: usdAmount,
          },
          description: "Compra de Pastelería - AnthonyWeb",
        },
      ],
    });

    /**
     * Ejecutamos la petición contra PayPal
     */
    const response = await paypalClient.execute(request);

    /**
     * response.result contiene:
     * - id  -> orderId de PayPal
     * - status
     * - links
     */
    return response.result;

  } catch (error) {
    console.error("❌ Error creando orden en PayPal:", error);
    throw error;
  }
};

/**
 * ======================================================
 * CAPTURAR PAGO EN PAYPAL
 * ======================================================
 */
const capturePayPalOrder = async (paypalOrderId) => {
  try {
    /**
     * Creamos la solicitud de captura
     * usando el orderId de PayPal
     */
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);

    /**
     * PayPal exige un body vacío
     */
    request.requestBody({});

    /**
     * Ejecutamos la captura del pago
     */
    const response = await paypalClient.execute(request);

    /**
     * Si todo sale bien:
     * response.result.status === "COMPLETED"
     */
    return response.result;

  } catch (error) {
    console.error("❌ Error capturando pago en PayPal:", error);
    throw error;
  }
};

module.exports = {
  createPayPalOrder,
  capturePayPalOrder,
};