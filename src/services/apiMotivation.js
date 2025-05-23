const getTodayDate = () => new Date().toISOString().split("T")[0];

export async function getMotivation() {
  try {
    const response = await fetch("https://zenquotes.io/api/random");
    if (!response.ok) {
      throw new Error("Failed to fetch motivation");
    }
    const data = await response.json();
    // console.log("apiMotivation", data);

    if (!data || !data[0]?.q || !data[0]?.a) {
      throw new Error("Invalid quote data received");
    }

    return {
      quote: data[0].q,
      author: data[0].a,
      date: getTodayDate(),
    };
  } catch (error) {
    console.error("Error fetching motivation:", error);
    // Return a default quote instead of null
    return {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      date: getTodayDate(),
    };
  }
}
