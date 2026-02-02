const express = require ("express");
const app = express();
const fs = require ("fs");

const PORT = 8080
const data = fs.readFileSync('productos.json', 'utf-8');
const productsData = JSON.parse(data);
const cData = fs.readFileSync('cart.json', 'utf-8');
const cartData = JSON.parse(cData);

app.use(express.json());

//Inicio 

app.get('/', (req, res)=>{
    res.status(200).json("Hola");
});

//Get de productos
app.get('/api/products/', (req, res)=>{
    res.status(200).json(productsData.productos)
});

//Get por id
app.get('/api/products/:id', (req, res)=>{
    const id = parseInt(req.params.id);
    console.log("ID consultado: ", id);
    const productoSolicitado = productsData.productos.find(p => p.id === id);
    if(!productoSolicitado){
        return res.status(404).json({error: "Producto no encontrado"});
    }
    res.status(200).json(productoSolicitado);
    
});

//Push
app.post('/api/products', (req,res) =>{
    const{ title, description, code, price, status, stock, category, thumbnails} = req.body;
    const nuevoProducto = { 
        id: productsData.productos.length ? productsData.productos[productsData.productos.length - 1].id + 1 : 1,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    };

    productsData.productos.push(nuevoProducto);
    fs.writeFileSync(
        'productos.json',
        JSON.stringify(productsData, null, 2),
        'utf-8'
    );
    res.status(201).json({message: "Producto creado"});
})

//Actualizar 
app.put('/api/products/:id', (req, res)=>{
    const id = parseInt(req.params.id);
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    console.log("ID consultado: ", id);
    const productoSolicitado = productsData.productos.find(p => p.id === id);

    if(!productoSolicitado){

        return res.status(404).json({error: "Producto no encontrado"});

    }

    productoSolicitado.title = title ?? productoSolicitado.title
    productoSolicitado.description = description ?? productoSolicitado.description
    productoSolicitado.code = code ?? productoSolicitado.code
    productoSolicitado.price = price ?? productoSolicitado.price
    productoSolicitado.status = status ?? productoSolicitado.status
    productoSolicitado.stock = stock ?? productoSolicitado.stock
    productoSolicitado.category = category ?? productoSolicitado.category
    productoSolicitado.thumbnails = thumbnails ?? productoSolicitado.thumbnails;

    fs.writeFileSync(
        'productos.json',
        JSON.stringify(productsData, null, 2),
        'utf-8'
    );

    res.status(200).json({message: "Producto actualizado"});
    
});

//Borrar por id
app.delete('/api/products/:id', (req, res)=>{
    const id = parseInt(req.params.id);
    const productoSolicitado = productsData.productos.find(p => p.id === id);

    if(!productoSolicitado){
        return res.status(404).json({error: "Producto no encontrado"});
    }

    productsData.productos = productsData.productos.filter(p => p.id !== id);
    
    fs.writeFileSync(
        'productos.json',
        JSON.stringify(productsData, null, 2),
        'utf-8'
    );
    res.status(204).send();

});

//Carrito
app.post('/api/carts', (req,res) =>{
    const nuevoCart = { 
        id: cartData.carts.length ? cartData.carts[cartData.cart.length - 1].id + 1 : 1,
        prodRef: []
    };
    
        cartData.carts.push(nuevoCart);
        fs.writeFileSync(
        'cart.json',
        JSON.stringify(cartData, null, 2),
        'utf-8'
    );
    

res.status(201).json({message: "Carrito creado"});   
})

app.get('/api/carts/:cid', (req, res)=>{
    const cid = parseInt(req.params.cid);
    console.log("ID de carrito consultado: ", cid);

    const carritoSolicitado = cartData.carts.find(p => p.id === cid);
    if(!carritoSolicitado){
        return res.status(404).json({error: "Carrito inexistente"});
    }
    res.status(200).json({message: "Carrito numero: ", cid: cid, Items: carritoSolicitado.prodRef});
});

app.post('/api/carts/:cid/product/:id', (req,res) =>{
    const cid = parseInt(req.params.cid);
    const pId = parseInt(req.params.id);


    const carritoSolicitado = cartData.carts.find(p => p.id === cid);
    if(!carritoSolicitado){
        return res.status(404).json({error: "Carrito no encontrado"});
    }
    console.log("Carrito consultado: ", cid);

    const productoParaAgregar = productsData.productos.find(pr => pr.id === pId);

    if(!productoParaAgregar){
        return res.status(404).json({error: "Producto no encontrado"});
    }
    else{
        const prodInCart = carritoSolicitado.prodRef.find(p => p.id === pId);

        if(!prodInCart){
            carritoSolicitado.prodRef.push({ id: pId, quantity: 1 });
        }
        else
        {
            prodInCart.quantity += 1;
        }
    }

    fs.writeFileSync(
    'cart.json',
    JSON.stringify(cartData, null, 2),
    'utf-8'

    );

res.status(201).json({message: "Carrito actualizado"});   
})


app.listen(PORT, () => console.log(`Servidor express escuchando en http://localhost:${PORT}`));