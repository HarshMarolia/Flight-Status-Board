import { render, screen } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";
import Home from "./pages/Home";
import { fetchFlights, fetchFlightDetails } from "./api";
import { Flight } from "./types";

const mock = new MockAdapter(axios);

describe("Application Tests", () => {
  test("should return experiential travel", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const linkElement = screen.getByText(/experiential travel/i);
    expect(linkElement).toBeInTheDocument();
  });
});

describe("API Tests", () => {
  afterEach(() => {
    mock.reset();
  });

  test("fetchFlights should return flight data", async () => {
    const mockFlights: Flight[] = [
      {
        id: "1",
        flightNumber: "AA123",
        airline: "American Airlines",
        origin: "NYC",
        destination: "LAX",
        departureTime: new Date().toLocaleTimeString(),
        status: "On Time",
      },
    ];

    mock
      .onGet("https://flight-status-mock.core.travelopia.cloud/flights")
      .reply(200, mockFlights);

    const flights = await fetchFlights();
    expect(flights).toEqual(mockFlights);
  });

  test("fetchFlights should handle errors", async () => {
    mock
      .onGet("https://flight-status-mock.core.travelopia.cloud/flights")
      .reply(500);

    await expect(fetchFlights()).rejects.toThrow(
      "Server error. Please try again later."
    );
  });

  test("fetchFlightDetails should return flight details", async () => {
    const mockFlight: Flight = {
      id: "1",
      flightNumber: "AA123",
      airline: "American Airlines",
      origin: "NYC",
      destination: "LAX",
      departureTime: new Date().toLocaleTimeString(),
      status: "On Time",
    };

    mock
      .onGet("https://flight-status-mock.core.travelopia.cloud/flights/1")
      .reply(200, mockFlight);

    const flight = await fetchFlightDetails("1");
    expect(flight).toEqual(mockFlight);
  });

  test("fetchFlightDetails should handle errors", async () => {
    mock
      .onGet("https://flight-status-mock.core.travelopia.cloud/flights/1")
      .reply(500);

    await expect(fetchFlightDetails("1")).rejects.toThrow(
      "Server error. Please try again later."
    );
  });
});
