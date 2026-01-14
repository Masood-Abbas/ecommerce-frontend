import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const PageHeader = ({ data, buttonLabel, onButtonClick }) => {
  const { heading, para } = data;

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:items-center">
      <div>
        <h2 className="text-3xl font-semibold">{heading}</h2>
        <p className="text-muted-foreground">{para}</p>
      </div>

      {buttonLabel && (
        <Button onClick={onButtonClick} className="gap-2">
          <Plus size={16} />
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
