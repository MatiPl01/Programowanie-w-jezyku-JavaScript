import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import { fileURLToPath } from 'node:url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const {
  PORT,
  DB_NAME,
  MONGO_PATH,
  VIEWS_PATH
} = process.env;

const app = express();

// Configuring the application
app.set('views', path.join(__dirname, VIEWS_PATH));
app.set('view engine', 'pug');

MongoClient.connect(MONGO_PATH, (err, result) => {
  if (err) throw err;
  console.log('📕 Database was successfully connected');
  const db = result.db(DB_NAME);
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get('/', (req, res) => {
    res.status(200).send('Wejdź na /add-product');
  })

  app.get('/add-product', (req, res) => {
    res.status(200).render('add-product');
  })

  app.get('/add-transaction', (req, res) => {
    res.status(200).render('add-transaction');
  })

  app.post('/', async (req, res) => {
    let { name, quantity, price } = req.body;
    quantity *= 1;
    price *= 1;

    const products = db.collection('product');
    const product = await products.findOne({ name });

    if (!product) {
      products.insertOne({
        name,
        quantity,
        price
      });
    } else {
      products.updateOne(
        { name },
        {
          $set: {
            quantity,
            price
          }
        }
      );
    }
    res.status(200).send('Dane zostały dodane');
  })

  app.post('/add-transaction', async (req, res) => {
    let { lastName, product: productName, quantity } = req.body;
    quantity *= 1;

    // Product
    const products = db.collection('product');
    const product = await products.findOne({ name: productName });

    if (!product) {
      return res.status(200).send('Product was not found');
    }

    if (product.quantity < quantity) {
      return res.status(400).send(`There are only ${product.quantity} units of ${product.name}`);
    }

    await products.updateOne({ _id: product._id }, {
      $set: { 'quantity': product.quantity - quantity }
    })

    // Transaction
    const transactions = db.collection('transactions');

    const transaction = await transactions.findOne({ buyer: lastName, product: product.name });
    if (transaction) {
      await transactions.updateOne({ buyer: lastName, product: product.name }, {
        $set: { quantity: transaction.quantity + quantity }
      });
    } else {
      await transactions.insertOne({
        buyer: lastName,
        product: product.name,
        quantity
      });
    }

    const productsBuyers = new Map();

    await transactions.find().forEach(({ buyer, product }) => {
      if (!productsBuyers.has(product)) {
        productsBuyers.set(product, []);
      }
      productsBuyers.get(product).push(buyer);
    });

    const summary = [];
    await products.find().forEach(product => {
      summary.push({
        product: product.name,
        stock: product.quantity,
        price: product.price,
        buyers: productsBuyers.get(product.name) || []
      });
    });

    res.status(200).render('summary', { summary })
  })

  app.listen(PORT, () => {
    console.log(`🚀 Server is set up on port ${PORT}`)
    console.log('Press CTRL + C to stop')
  })
})
