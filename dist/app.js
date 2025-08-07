import express from 'express';
import productsData from './products.json' with { type: 'json' };
const app = express();
app.use(express.json());
function validarCodigo(input) {
    if (!input || input.trim() === "")
        return false;
    const regex = /^[1-9][0-9]{5}$/;
    return regex.test(input);
}
let products = productsData.map(product => ({
    code: product.code,
    name: product.name,
    price: product.price,
    photoUrl: product.photoUrl,
}));
app.get('/products', (req, res) => {
    res.json(products);
});
// find by code
app.get('/products/:code', (req, res) => {
    const { code } = req.params;
    const product = products.find(t => t.code === code);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});
app.post('/products', (req, res) => {
    const isCodeValid = validarCodigo(req.body.code);
    if (!isCodeValid) {
        return res.status(400).json({ error: 'Invalid code format' });
    }
    const { code, name, price, photoUrl, } = req.body;
    if (!code && name && price && photoUrl) {
        return res.status(400).json({ error: 'Data missing' });
    }
    const newProduct = {
        code,
        name,
        price,
        photoUrl,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});
app.put('/products/:code', (req, res) => {
    const { code } = req.params;
    const { name, price, photoUrl } = req.body;
    const product = products.find(t => t.code === code);
    if (!product) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (photoUrl)
        product.photoUrl = photoUrl;
    res.json(product);
});
app.delete('/products/:code', (req, res) => {
    const { code } = req.params;
    const index = products.findIndex(t => t.code === code);
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    products.splice(index, 1);
    res.status(204).send();
});
app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://localhost:3000');
});
