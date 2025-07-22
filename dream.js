const express = require ("express")
const app = express();
const methodOverride = require("method-override");
const { v4: uuid } = require('uuid');
const path = require("path");


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));

    let dreams = [
      { id: '1', text:'Delve deep into Web Delopment'},
      { id: '2', text:'Buy a new phone'},
      { id: '3', text:'Open a money market fund savings account'},
    ]

app.get("/dreams/new", (req, res) => {
   console.log("Form data:", req.body);
  res.render("new");
});


app.post("/dreams", (req, res) => {
  const { text } = req.body;
  dreams.push({ id: uuid(), text });
  res.redirect("/dreams");
});



app.get("/dreams/:id", (req, res) => {
  const { id } = req.params;
  const dream = dreams.find(d => d.id === id); 

  if (!dream) {
    return res.status(404).send("Dream not found");
  }
  res.render("show", { dream });
});

app.patch("/dreams/:id", (req, res) => {
  const { id } = req.params;
  console.log("Form data:", req.body);
  const newText = req.body.text;
  const dream = dreams.find(d => d.id === id);
  if (dream) dream.text = newText;
  res.redirect("/dreams");
});

app.get("/dreams/:id/edit", (req, res) => {
  const { id } = req.params;
  const dream = dreams.find(d => d.id === id);
  if (!dream) {
    return res.status(404).send("Dream not found");
  }
  res.render("update", { dream }); 
});

app.get("/dreams", async (req, res) => {
  try {
    const response = await fetch("https://zenquotes.io/api/random");
    const data = await response.json();
    const quote = data[0].q;
    const author = data[0].a;

    res.render("index", { dreams, quote, author });
  } catch (err) {
    console.error("Fetch error:", err);
    res.render("index", {
      dreams,
      quote: "Stay focused and keep building!",
      author: "Unknown"
    });
  }
});


app.delete("/dreams/:id", (req,res) => {
     dreams = dreams.filter(d => d.id !== req.params.id);
  res.redirect("/dreams");
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
})