export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  status: string;
}

export interface CardProps {
  flight: Flight | null;
  loading: boolean;
  error: string | null;
  fetchFlightDetail: () => void;
}
