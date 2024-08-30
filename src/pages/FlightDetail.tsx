// src/components/FlightDetail.tsx
import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Flight } from "../types";
import BlueTick from "../components/BlueTick";

const FlightDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFlightDetail = useCallback(async () => {
    try {
      const response = await axios.get<Flight>(
        `https://flight-status-mock.core.travelopia.cloud/flights/${id}`
      );
      setFlight(response.data);
    } catch (err) {
      setError("Failed to fetch flight details. Please try again later.");
    }
  }, [id]);

  useEffect(() => {
    fetchFlightDetail();
  }, [fetchFlightDetail]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!flight) {
    return <div className="text-white">Loading...</div>;
  }

  const dateFormatter = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString();
  };

  return (
    <div className="w-screen h-[100vh] relative isolate overflow-hidden bg-[#111828] p-6 shadow-2xl sm:p-16">
      <div className="mb-4 flex items-center gap-4">
        <Link
          to="/"
          className="text-indigo-400 hover:text-indigo-300 transition ease-in-out duration-150"
        >
          &larr; Back to Flight Status Board
        </Link>
      </div>
      <div className="w-full max-w-xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto">
        <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
          Flight Details
        </h5>
        <div className="flex items-baseline justify-between text-gray-900 dark:text-white">
          <span className="text-3xl font-semibold">Flight Number:</span>
          <span className="text-5xl font-extrabold tracking-tight">
            {flight.flightNumber}
          </span>
        </div>
        <ul className="space-y-5 my-7">
          <li className="flex items-center">
            <BlueTick />
            <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
              Airline: {flight.airline}
            </span>
          </li>
          <li className="flex items-center">
            <BlueTick />
            <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
              Route: {flight.origin} to {flight.destination}
            </span>
          </li>
          <li className="flex items-center">
            <BlueTick />
            <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
              Departure Time: {dateFormatter(flight.departureTime)}
            </span>
          </li>
          <li className="flex items-center">
            <BlueTick />
            <span
              className={
                "text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3"
              }
            >
              Status: {flight.status}
            </span>
          </li>
        </ul>
        <button
          type="button"
          onClick={fetchFlightDetail}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default FlightDetail;
