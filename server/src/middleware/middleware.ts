import express, { Express } from "express"
import cors from "cors";

const clientReqUrl = "http://localhost:5173"

function middleware(app: Express): Express {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(
        cors({
            origin: [`${clientReqUrl}`],
            methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"],
            credentials: true
        })
    );
    return app
}

export default middleware;