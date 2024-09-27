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

// Function to fetch contracts per service provider
export const getContractsPerServiceProvider = async (serviceProviderId: string, userSession: string) => {
  // Encode the serviceProviderId to handle spaces and special characters
  const encodedServiceProviderId = encodeURIComponent(serviceProviderId);

  const url = `${baseUrl}/analytics/contracts_per_service_provider?service_provider=${encodedServiceProviderId}`;

  // Set up the headers, including the session token for authorization
  const headers = {
    "Authorization": `Bearer ${userSession}`,
    "Content-Type": "application/json",
  };

  // Perform the API request
  try {
    const response = await fetch(url, { headers });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse the response data
    return await response.json();
  } catch (error) {
    // Handle and propagate the error
    console.error("Error fetching contracts per service provider:", error);
    throw error;
  }
};

// Function to fetch tenders per service provider
export const getTendersPerServiceProvider = async (serviceProviderId: string, userSession: string) => {
  const url = `${baseUrl}/analytics/tenders_per_service_provider?service_provider_id=${serviceProviderId}`;

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
    console.error("Error fetching tenders per service provider:", error);
    throw error;
  }
};
