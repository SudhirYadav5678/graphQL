import express, { Request, Response } from "express"
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from "dotenv"
import cors from "cors"
import { prismaClient } from "./lib/db";

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
        }
        type Mutation {
            createUser(firstName:String!, LastName:String!, email:String!, password:String!):Boolean
        }`,
        resolvers: {
            Query: {
                hello: () => `Hello sudhirYadav`
            },
            Mutation: {
                createUser: async (_,
                    { firstName, lastName, email, password }: { firstName: string, lastName: string, email: string, password: string }) => {
                    await prismaClient.user.create({
                        data: {
                            email,
                            password,
                            firstName,
                            lastName,
                            salt: "random_salt"
                        }
                    })
                    return true;
                }
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