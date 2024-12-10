import { t } from "elysia";
import { createElysia } from "./utils";
import { feedRoutes } from "./routes/feed";
import { merkleTreeRoutes } from "./routes/merkle-tree";
import { getPostRoutes } from "./routes/post";
import { uploadRoutes } from "./routes/upload";
import { neynar } from "./services/neynar";
import { getProvingBackend, ProofType } from "@anon/utils/src/proofs";
import { contract } from "./services/contract";
(async () => {
  const [createPostBackend, submitHashBackend] = await Promise.all([
    getProvingBackend(ProofType.CREATE_POST),
    getProvingBackend(ProofType.PROMOTE_POST),
  ]);
  const postRoutes = getPostRoutes(createPostBackend, submitHashBackend);

  const app = createElysia()
    .use(feedRoutes)
    .use(merkleTreeRoutes)
    .use(postRoutes)
    .use(uploadRoutes)
    .get("/health", () => {
      return "OK";
    })
    .get(
      "/get-cast",
      async ({ query }) => {
        const response = await neynar.getCast(query.identifier);
        return response.cast;
      },
      {
        query: t.Object({
          identifier: t.String(),
        }),
      }
    )
    .get(
      "/get-channel",
      async ({ query }) => {
        const response = await neynar.getChannel(query.identifier);
        return response.channel;
      },
      {
        query: t.Object({
          identifier: t.String(),
        }),
      }
    )
    .get(
      "/validate-frame",
      async ({ query }) => {
        return await neynar.validateFrame(query.data);
      },
      {
        query: t.Object({
          data: t.String(),
        }),
      }
    )
    .get(
      "/identity",
      async ({ query }) => {
        const users = await neynar.getBulkUsers([query.address.toLowerCase()]);
        return users?.[query.address.toLowerCase()]?.[0];
      },
      {
        query: t.Object({
          address: t.String(),
        }),
      }
    )
    .get(
      "/get-token-id",
      async ({ query }) => {
        const tokenId = await contract.getOrCreateTokenId(query.identifier);
        return {tokenId};
      },
      {
        query: t.Object({
          identifier: t.String(),
        }),
      }
    )
    .get(
      "/get-mint-price",
      async () => {
        const mintPrice = await contract.getMintPrice();
        return {mintPrice};
      },
    )
    .get(
      "/get-max-mint-limit",
      async () => {
        const maxMintLimit = await contract.getMaxMintLimit();
        return {maxMintLimit};
      },
    )
    .get(
      "/get-token-mint-count",
      async ({ query }) => {
        const count = await contract.getTokenMintCount(query.identifier);
        return {count};
      },
      {
        query: t.Object({
          identifier: t.String(),
        }),
      }
    );

  app.listen({
    port: 3001,
    hostname: "0.0.0.0",
    development: false,
  });

  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
})();
