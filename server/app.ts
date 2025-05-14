import express, { Express } from "express";
import middleware from "@middleware/middleware.js";

let app: Express = express()
app = middleware(app)

export default app