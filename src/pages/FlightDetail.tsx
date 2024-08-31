// src/components/FlightDetail.tsx
import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Flight } from "../types";
import BlueTick from "../components/BlueTick";
import { fetchFlightDetails } from "../api";
import { dateFormatter } from "../utility";

const FlightDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchFlightDetail = useCallback(async () => {
    try {
      setLoading(true);
      const flightData = await fetchFlightDetails(id!);
      setFlight(flightData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchFlightDetail();
  }, [fetchFlightDetail]);

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
        {error && (
          <div className="text-red-500 text-center text-lg mb-4">{error}</div>
        )}
        {flight && (
          <>
            <div className="flex items-baseline justify-between text-gray-900 dark:text-white">
              <span className="text-3xl font-semibold">Flight Number:</span>
              <span className="text-5xl font-extrabold tracking-tight">
                {flight.flightNumber || "-"}
              </span>
            </div>
            <ul className="space-y-5 my-7">
              <li className="flex items-center">
                <BlueTick />
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                  Airline: {flight.airline || "-"}
                </span>
              </li>
              <li className="flex items-center">
                <BlueTick />
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                  Route: {flight.origin} to {flight.destination || "-"}
                </span>
              </li>
              <li className="flex items-center">
                <BlueTick />
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                  Departure Time: {dateFormatter(flight.departureTime) || "-"}
                </span>
              </li>
              <li className="flex items-center">
                <BlueTick />
                <span
                  className={
                    "text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3"
                  }
                >
                  Status: {flight.status || "-"}
                </span>
              </li>
            </ul>
          </>
        )}
        <button
          type="button"
          onClick={fetchFlightDetail}
          className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="20"
            height="20"
            viewBox="0 0 30 30"
            fill="white"
            className={`${loading ? "animate-spin" : ""} mr-1.5`}
          >
            <path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></path>
          </svg>
          Refresh
        </button>
      </div>
    </div>
  );
};

export default FlightDetail;
