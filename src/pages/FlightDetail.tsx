import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Flight } from "../types";
import { fetchFlightDetails } from "../api";
import FlightDetailCard from "../components/FlightDetailCard";

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
      <FlightDetailCard flight={flight} loading={loading} error={error} fetchFlightDetail={fetchFlightDetail}/>
    </div>
  );
};

export default FlightDetail;
