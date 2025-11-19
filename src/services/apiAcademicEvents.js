import client from "../../sanity";


//current and upcoming events
export const academicEventsQuery = `
*[
  _type == "academicEvent" && (
    // Current events
    (startDate <= now() && endDate >= now()) ||
    // Upcoming events
    startDate > now()
  )
]
| order(startDate asc)[0...6] {
  title,
  description,
  startDate,
  endDate,
  iconName,
  linkUrl
}
`;

// const query = `
//   *
// `;

export async function getAcademicEvents() {
  return await client.fetch(academicEventsQuery, {}, { cache: "no-store" });
}
