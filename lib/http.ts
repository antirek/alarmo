const express = require("express");
const bodyParser = require("body-parser");
const tracer = require("./httpConsole");
const counter = require("request-counter");
const basicAuth = require("express-basic-auth");
const path = require("path");

const TextMessage = require("viber-bot").Message.Text;

class HttpServer {
  expressApp: any;

  constructor(sender: Object, store: Object, auth: Object) {
    this.expressApp = express();

    this.expressApp.set("views", path.join(__dirname, "/views"));
    this.expressApp.set("view engine", "pug");
    this.expressApp.use(bodyParser.json());

    if (auth && auth.users) {
      tracer.log("use basic auth for access");
      this.expressApp.use(basicAuth({
        users: auth.users, // {'admin': 'supersecret'}
      }));
    }

    this.expressApp.get("/", (req, res) => {
      tracer.log("counter", counter.next());
      store.getUsers()
        .then((users) => {
          tracer.log("list users", users);
          res.render("index", {users});
        })
        .catch((err) => {
          tracer.log(err);
          res.sendStatus(500);
        });
    });

    this.expressApp.post("/send/telegram/:number", (req, res) => {
      tracer.log("counter", counter.next());
      const reqNumber = req.params.number;
      store.getUserByNumber(reqNumber)
        .then((currentUser) => {
          tracer.log("send to telegram:", reqNumber, "text:", req.body.text);
          if (currentUser) {
            const options = {
              parse_mode: "HTML",
            };

            sender.telegram.sendMessage(currentUser.telegramChatId, req.body.text, options);
            res.sendStatus("200");
          } else {
            tracer.log("not found");
            res.sendStatus("404");
          }
        })
        .catch((err) => {
          tracer.log(err);
          res.sendStatus(500);
        });
    });

    this.expressApp.post("/send/viber/:number", (req, res) => {
      tracer.log("counter", counter.next());
      const reqNumber = req.params.number;

      store.getUserByNumber(reqNumber)
        .then((currentUser: any) => {
          tracer.log("send to viber:", reqNumber, "text:", req.body.text);
          if (currentUser) {
            sender.viber.sendMessage({id: currentUser.viberUserId}, new TextMessage(req.body.text));
            res.sendStatus("200");
          } else {
            tracer.log("not found");
            res.sendStatus("404");
          }
        })
        .catch((err) => {
          tracer.log(err);
          res.sendStatus(500);
        });
    });
  }
};

export { HttpServer }