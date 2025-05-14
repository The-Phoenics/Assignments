const dotenv = await import("dotenv")
dotenv.config();

import { Request, Response } from "express";
import app from "./app.js";
import { connectDB } from "./db.js";

app.get('*', (req: Request, res: Response) => {
    res.status(404).json({ message: "404 NOT FOUND" })
})

async function startServer(): Promise<void> {
    await connectDB(() => {
        app.listen(process.env.SERVER_PORT, () => console.log(`SUCCESS: Server started at port ${process.env.SERVER_PORT}`))
    })
}

startServer()