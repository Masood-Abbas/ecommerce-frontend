
import { Card, CardContent } from "@/components/ui/card";

const  ContactInfoCard=({ icon: Icon, title, lines })=> {
  return (
    <Card className="bg-white rounded-xl shadow-sm border">
      <CardContent className=" space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-(--primary-color) text-white">
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-medium">{title}</h2>
        </div>

        {lines.map((txt, i) => (
          <p key={i} className="text-sm">
            {txt}
          </p>
        ))}
      </CardContent>
    </Card>
  );
}

export default  ContactInfoCard
