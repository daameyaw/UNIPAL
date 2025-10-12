import client from "../../sanity";

const query = `
*[_type == "location" && category == $category] | order(name asc) {
  _id,
  category,
  name,
  description,
  image,
  hours,
  latitude,
  longitude,
  additionalInfo
}
`;

export async function getLocationsByCategory(category) {
  return await client.fetch(query, { category }, { cache: "no-store" });
}
