//imports
const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()

// mw
app.use(express.json())
app.use(cors())
app.use("/users" ,require("./routes/users"))
app.use("/vacations" ,require("./routes/vacations"))
app.use("/orders" ,require("./routes/orders"))
app.use("/search" ,require("./routes/search"))
app.use("/public",express.static("public"))

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

app.get("*", (req, res) => {
  res.redirect("/");
});

const PORT = process.env.PORT || 1000;

// listiner
app.listen(PORT, () => console.log("up and running on "+ PORT))


