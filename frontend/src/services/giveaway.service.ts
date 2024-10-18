
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

  export async function AddEntry(ticketNumber: string, name: string, email: string, phoneNumber: string, user_session: string) {
    const data = {
        ticketNumber: ticketNumber,
        name: name,
        email: email,
        phoneNumber: phoneNumber,
    };

    const apiURL = "/api/giveaway/participant/add";
    const response = await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user_session}`,
        },
        body: JSON.stringify(data),
    });

    // If response is not OK, return false
    if (!response.ok) {
        return false;
    }

    // Try parsing the response as JSON
    try {
        const result = await response.json();
        // Check the 'message' field in the response
        if (result.message && result.message.toLowerCase() === "participant added successfully") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error parsing response:", error);
        return false;
    }
}
