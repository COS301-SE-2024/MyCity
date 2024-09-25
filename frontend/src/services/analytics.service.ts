// analytics.service.ts
const baseUrl = process.env.NEXT_PUBLIC_NODEAPI_URL; // Base URL for the API

// Function to fetch tickets per municipality
export const getTicketsPerMunicipality = async (municipalityId: string, userSession: string) => {
  const url = `${baseUrl}/analytics/tickets_per_municipality?municipality_id=${municipalityId}`;

  // Set up the headers, including the session token for authorization
  const headers = {
    "Authorization": `Bearer ${userSession}`,
    "Content-Type": "application/json"
  };

  // Perform the API request
  try {
    const response = await fetch(url, { headers });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse and return the response data
    return await response.json();
  } catch (error) {
    // Handle and propagate the error
    console.error("Error fetching tickets per municipality:", error);
    throw error;
  }
};
