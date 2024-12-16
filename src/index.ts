import express, { Request, Response } from "express"
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from "dotenv"
import cors from "cors"
import { graphqlServer } from "./graphql/index"

//npx gitignore Node for gitignore generate
dotenv.config({
    path: "./.env"
})

async function init() {
    const app = express();



    app.use(cors({ origin: process.env.CORS, credentials: true }))
    app.use(express.json());
    app.get("/", (req: Request, res: Response) => {
        res.json({
            message: "Hello"
        })
    })
    const gqlServer = await graphqlServer();
    app.use("/graphql", expressMiddleware(gqlServer));

    app.listen(8000, () => {
        console.log("Server is running");

    })
}

init();