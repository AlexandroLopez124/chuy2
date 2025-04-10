const express = require('express');
const stripe = require('stripe')('sk_test_51P2PCqLOoj4xj39TGCIFH8eyUYftrtgI47HrWOEev2YaJJUy1Nhw5SDtglpqhXq89TVnkLdW4oNOObag4kZul7v300BSCUUP8C');
const cors = require('cors');

const app = express();

// Middleware para permitir solicitudes desde tu frontend
app.use(cors());
app.use(express.json());

// Ruta para crear PaymentIntent
app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // El monto es recibido desde el frontend

  try {
    // Crear PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir a centavos
      currency: 'mxn', // Puedes cambiar la moneda si lo necesitas
      
    });
    console.log(paymentIntent.currency)
    // Enviar client_secret al frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creando PaymentIntent:', error);
    res.status(500).send(error.message);
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
