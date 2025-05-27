import client from "../../sanity";

const query = `
*[_type == "academicEvent" && endDate >= now()] | order(startDate asc)[0...3] {
  title,
  description,
  startDate,
  endDate,
  iconName
}
`;

// const query = `
//   *
// `;

export async function getAcademicEvents() {
  return await client.fetch(query, {}, { cache: "no-store" });
}
