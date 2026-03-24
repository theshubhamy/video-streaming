import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { readFileSync } from 'fs';
import { join } from 'path';
import { VideoAPI, AccountAPI } from './datasources/index';

const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), { encoding: 'utf-8' });

export interface ContextValue {
  token?: string;
  dataSources: {
    videoAPI: VideoAPI;
    accountAPI: AccountAPI;
  };
}

const resolvers = {
  Query: {
    gatewayHealth: () => 'GraphQL Gateway is active and healthy!',
    videoServiceHealth: async (_: any, __: any, { dataSources }: ContextValue) => {
      return dataSources.videoAPI.getHealth();
    },
    accountServiceHealth: async (_: any, __: any, { dataSources }: ContextValue) => {
      return dataSources.accountAPI.getHealth();
    }
  },
};

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<ContextValue>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const { cache } = server;
        const token = req.headers.authorization;
        
        // Pass the context inside the DataSources manually (new Apollo v4 standard)
        const videoAPI = new VideoAPI({ cache });
        const accountAPI = new AccountAPI({ cache });
        (videoAPI as any).context = { token };
        (accountAPI as any).context = { token };

        return {
          token,
          dataSources: {
            videoAPI,
            accountAPI
          },
        };
      },
    })
  );

  app.get('/v1/health', (req: Request, res: Response) => {
    res.status(200).send('API Gateway running');
  });

  const PORT = process.env.PORT || 4000;
  
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Gateway ready at http://localhost:${PORT}/graphql`);
}

startApolloServer().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
