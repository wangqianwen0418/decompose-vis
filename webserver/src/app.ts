import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";
import * as Redis from "ioredis";
import { createServer, Server } from "http";

const redis = new Redis({
    host: "localhost",
    port: 6379,
    db: 10
});

const logs = [];

const SaveLoadRouter: Router = new Router()
    .get("/load", async (ctx, next) => {
        const name: string = ctx.query.name;
        const data = await redis.get(name);
        if (data) {
            ctx.body = JSON.parse(data);
        } else {
            ctx.body = "nodata";
        }
        await next();
    })
    .get("/log", async (ctx, next) => {
        ctx.body = logs;
        await next();
    })
    .get("/save", async (ctx, next) => {
        const name: string = ctx.query.name;
        const data: string = JSON.stringify(ctx.query.data);
        logs.push({name, data});
        redis.set(name, data);
        await next();
    })
    .post("/save", async (ctx, next) => {
        const name: string = ctx.request.body.name;
        const data: string = JSON.stringify(ctx.request.body.data);
        logs.push({name, data});
        redis.set(name, data);
        await next();
    });

function WebServer(): Koa {
    const app: Koa = new Koa();

    app.use(require('kcors')());
    app.use(bodyParser());
    app.use(SaveLoadRouter.routes());

    return app;
}

const app: Koa = WebServer();
const port: number = process.env.PORT || "9999";
const server: Server = createServer(app.callback());

server.listen(port);
server.on("listening", () => {
    const addr = server.address();
    console.info(`Listening on port ${addr.port}`);
});

server.on("error", (error) => {
    if ((<any> error).syscall !== "listen") {
        throw error;
    }
    const bind = `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch ((<any> error).code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});
