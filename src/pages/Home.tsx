import FlightTable from "../components/FlightTable";
import HeroSection from "../components/HeroSection";

const Home = () => {
  return (
    <div className="bg-[#111828]">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <HeroSection />
        <FlightTable />
      </div>
    </div>
  );
};

export default Home;
