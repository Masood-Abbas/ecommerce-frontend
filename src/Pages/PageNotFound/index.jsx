import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PageNotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  const handleback = () => {
    console.log("count")
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center   p-4">
      <div className="text-center space-y-8 max-w-lg">
        <div className="relative">
          <h1 className="text-[12rem] font-bold leading-none bg-clip-text text-(--primary-color) ">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-muted-foreground/70">
            Attempted path:
            <code className="bg-muted px-2 py-1 rounded text-xs">
              {location.pathname}
            </code>
          </p>
        </div>

        {/*  Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="gap-2">
            <NavLink to="/">
              <Home className="h-4 w-4" />
              Go to Home
            </NavLink>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Button onClick={handleback} className="text-black">
              <ArrowLeft className="h-4 w-4 text-black"/>
              Go Back
            </Button>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
