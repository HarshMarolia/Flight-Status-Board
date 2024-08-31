import axios from "axios";
import { Flight } from "./types";
import { handleError } from "./utility";

const API_URL = "https://flight-status-mock.core.travelopia.cloud/flights";

// Fetch all flights
export const fetchFlights = async (): Promise<Flight[]> => {
  try {
    const response = await axios.get<Flight[]>(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Fetch flight details by ID
export const fetchFlightDetails = async (id: string): Promise<Flight> => {
  try {
    const response = await axios.get<Flight>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
