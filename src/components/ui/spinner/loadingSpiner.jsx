import Spinner from "./spiner";


const LoadingSpot = ({ text = "Loading...",className="" }) => {
  return (
    <div className={`flex items-center justify-center gap-2 ${className || "pt-10"}`}>
      <span><Spinner className={className}/></span>
      <span className={`text-(--primary-color) font-semiobold text-lg ${className}`}>{text}</span>
    </div>
  );
};

export default LoadingSpot;
