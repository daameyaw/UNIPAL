// sanity.js
import sanityClient, { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";


const client = createClient({
  projectId: "x60kx28g", // Replace with your actual project ID
  dataset: "production", // Or whatever dataset name you used
  apiVersion: "2025-05-24", // Safe, this will never change
  useCdn: true, // `true` makes it faster for read-only data
});

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);

export default client;
