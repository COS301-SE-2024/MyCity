
export const getGiveawayEntries = async (userSession: string) => {
    const url = `/api/giveaway/participant/count`;
  
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
      console.error("Error fetching the number of entries:", error);
      throw error;
    }
  };
  