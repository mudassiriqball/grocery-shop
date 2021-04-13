const express = require("express");
const next = require("next");
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const dotenv = require('dotenv');
dotenv.config();

const pino = require('express-pino-logger')();

app
    .prepare()
    .then(() => {
        const app = express();
        const http = require("http");
        const server = http.createServer(app);
        require("dotenv").config();

        const errorHandler = require("./api/middleware/error-handler");
        const errorMessage = require("./api/middleware/error-message");
        const accessControls = require("./api/middleware/access-controls");
        const mongoose = require("mongoose");
        const cors = require("cors");
        const bodyParser = require("body-parser");
        app.use(
            bodyParser.urlencoded({
                extended: true
            })
        );
        app.use(bodyParser.json());

        app.use(express.static("public"));

        // connection to mongoose
        const mongoCon = process.env.mongoCon;

        const connect = async function () {
            return mongoose.connect(mongoCon, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
            });
        };

        (async () => {
            try {
                const connected = await connect();
            } catch (e) {
                console.log("Error happend while connecting to the DB: ", e.message);
            }
        })();
        const fs = require("fs");
        fs.readdirSync(__dirname + "/api/models").forEach(function (file) {
            require(__dirname + "/api/models/" + file);
        });

        // in case you want to serve images
        app.use(express.static("public"));

        app.use(cors())
        app.get("/api", function (req, res) {
            res.status(200).send({
                message: "Express backend server"
            });
        });

        app.set("port", process.env.PORT);
        app.use(accessControls);

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(pino);

        const UsersRoutes = require("./api/routes/users.routes");
        const ProductRoutes = require("./api/routes/products.routes");
        const CategoryRoutes = require("./api/routes/categories.routes");
        const SlidersRoutes = require("./api/routes/sliders.routes");
        const OrdersRoutes = require("./api/routes/orders.routes");
        app.use("/api/users", UsersRoutes);
        app.use("/api/products", ProductRoutes);
        app.use("/api/categories", CategoryRoutes);
        app.use("/api/sliders", SlidersRoutes);
        app.use("/api/orders", OrdersRoutes);

        app.get("*", (req, res) => {
            return handle(req, res);
        });


        app.set("port", process.env.PORT);
        server.listen(process.env.PORT || 5000, '0.0.0.0');
        console.log("listening on port", process.env.PORT);
    })
    .catch(ex => {
        console.error(ex.stack);
    });