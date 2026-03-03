router.get("/", (req, res) => {
  const products = JSON.parse(fs.readFileSync("./productos.json"));
  res.render("home", { products });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts");
});
