export const LiquidFeatureCard = ({ icon, title, desc }) => {
  return (
    <div className="flex flex-col items-center text-center group relative w-[25%] p-6">
      <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center relative overflow-hidden text-white">
        {icon}
      </div>
      <h3 className="mt-4 font-bold text-lg">{title}</h3>
      <p className="mt-2 text-gray-500">{desc}</p>
    </div>
  );
};
