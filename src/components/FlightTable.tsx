import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Flight } from "../types";

const FlightTable: React.FC = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const refetchTime = 20000;

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Flight[]>(
        "https://flight-status-mock.core.travelopia.cloud/flights"
      );
      setFlights(response.data);
      setLastUpdated(new Date()); // Update the timestamp when data is fetched
    } catch (err) {
      setError("Failed to fetch flight data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
    const intervalId = setInterval(fetchFlights, refetchTime);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Calculate pagination details
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = flights.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(flights.length / rowsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when rows per page change
  };

  const dateFormatter = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString();
  };

  const handleRowClick = (flightId: string) => {
    navigate(`/flight/${flightId}`);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="relative isolate overflow-hidden bg-gray-900 p-6 shadow-2xl sm:rounded-3xl sm:p-16" id="flight-table">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-white text-lg font-semibold flex gap-4 items-center justify-center">
          <h2 className="text-xl font-semibold">Real-Time Flight Status Board</h2>
          {/* Last Updated Timestamp */}
          <div className="text-sm text-gray-400 text-center">
            {lastUpdated
              ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
              : ""}
          </div>
          <button
            onClick={fetchFlights}
            className={`p-1 rounded-full hover:bg-gray-700 transition ease-in-out duration-150 ${
              loading ? "animate-spin" : ""
            }`}
            title="Refresh Data"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="20"
              height="20"
              viewBox="0 0 30 30"
              fill="white"
            >
              <path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></path>
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-white">
            <label className="mr-2" htmlFor="rowsPerPage">
              Rows per page:
            </label>
            <input
              id="rowsPerPage"
              type="number"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="w-16 bg-gray-800 text-white rounded p-1 text-center"
              min="1"
              max="50"
            />
          </div>
        </div>
      </div>
      <table className="min-w-full bg-gray-800 text-white shadow-md rounded-lg border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-left text-sm font-semibold uppercase tracking-wider text-white">
            <th className="py-5 px-4 rounded-tl-lg">Flight Number</th>
            <th className="py-5 px-4">Airline</th>
            <th className="py-5 px-4">Origin</th>
            <th className="py-5 px-4">Destination</th>
            <th className="py-5 px-4">Departure Time</th>
            <th className="py-5 px-4 rounded-tr-lg">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-gray-700">
          {currentRows.map((flight) => (
            <tr
              key={flight.id}
              className="hover:bg-gray-700 transition ease-in-out duration-150 cursor-pointer"
              onClick={() => handleRowClick(flight.id)}
            >
              <td className="py-4 px-4">{flight.flightNumber}</td>
              <td className="py-4 px-4">{flight.airline}</td>
              <td className="py-4 px-4">{flight.origin}</td>
              <td className="py-4 px-4">{flight.destination}</td>
              <td className="py-4 px-4">
                {dateFormatter(flight.departureTime)}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    flight.status === "On Time"
                      ? "bg-green-500 text-white"
                      : flight.status === "Delayed"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {flight.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center items-center gap-4">
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          className="p-2 disabled:opacity-50 cursor-pointer text-white opacity-70 hover:opacity-100 transition"
          disabled={currentPage === 1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            fill="white"
            stroke="white"
            className="h-5 w-5"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
          </svg>
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            handlePageChange(Math.min(currentPage + 1, totalPages))
          }
          className="p-2 disabled:opacity-50 cursor-pointer text-white opacity-70 hover:opacity-100 transition rotate-180"
          disabled={currentPage === totalPages}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
            fill="white"
            stroke="white"
            className="h-5 w-5"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FlightTable;
