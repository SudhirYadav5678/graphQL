
import { ApolloServer } from '@apollo/server';
import { prismaClient } from "../lib/db";

async function graphqlServer() {
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

    return graphQlServer;
}

export { graphqlServer };