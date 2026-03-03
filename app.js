import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import fs from "fs";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

let data = JSON.parse(fs.readFileSync("./productos.json", "utf-8"));
let products = data.productos;

app.get("/", (req, res) => {
  res.render("home", { products });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.emit("updateProducts", products);

  socket.on("newProduct", (product) => {
    product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    products.push(product);

    data.productos = products;

    fs.writeFileSync("./productos.json", JSON.stringify(data, null, 2));

    io.emit("updateProducts", products);
  });

  socket.on("deleteProduct", (id) => {
    products = products.filter((p) => p.id !== Number(id));

    data.productos = products;

    fs.writeFileSync("./productos.json", JSON.stringify(data, null, 2));

    io.emit("updateProducts", products);
  });
});

server.listen(8080, () => {
  console.log("Servidor corriendo en puerto 8080");
});
