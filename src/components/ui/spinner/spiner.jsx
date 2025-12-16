import { Loader2 } from "lucide-react";

const Spinner = ({ size = 28,className="" }) => {
  return (
    <Loader2
      className={`animate-spin text-(--primary-color) flex justify-center w-full ${className}`}
      size={size}
      aria-label="Loading"
    />
  );
};

export default Spinner;
