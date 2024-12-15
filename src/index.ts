import express, { Request, Response } from "express"
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from "dotenv"
import cors from "cors"

//npx gitignore Node for gitignore generate
dotenv.config({
    path: "./.env"
})

async function init() {
    const app = express();

    //graphql server
    const graphQlServer = new ApolloServer({
        typeDefs: `
        type Query{
           hello:String
        }`,
        resolvers: {
            Query: {
                hello: () => `Hello suhidr`
            }
        },
    });

    //gql start
    await graphQlServer.start();

    app.use(cors({ origin: process.env.CORS, credentials: true }))
    app.use(express.json());
    app.get("/", (req: Request, res: Response) => {
        res.json({
            message: "Hello"
        })
    })

    app.use("/graphql", expressMiddleware(graphQlServer));

    app.listen(8000, () => {
        console.log("Server is running");

    })
}

init();