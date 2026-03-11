import { StreamClient } from "@stream-io/node-sdk";

const streamClient = new StreamClient(
  process.env.STREAM_API_KEY,
  process.env.STREAM_SECRET
);

export const generateStreamToken = (userId) => {
  const token = streamClient.generateUserToken({ user_id: userId });
  return token;
};