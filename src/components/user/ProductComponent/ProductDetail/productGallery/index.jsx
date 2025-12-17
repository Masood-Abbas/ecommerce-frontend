import { Card } from "@/components/ui/card";

const ProductGallery = ({ images,altname, selectedImage, setSelectedImage }) => {
  if (!images?.length) return null;

  return (
    <>
      {/* Mobile */}
     <div className="lg:hidden flex flex-col items-center gap-4 w-full">
          <Card className="rounded-3xl shadow-xl p-6 bg-[#d4d4d4] w-full">
            <img
              src={selectedImage}
              alt={altname}
              className="w-full h-[350px] object-contain border-gray-200 rounded-xl"
            />
          </Card>

          {/* Thumbnails mobile below main image */}
          <div className="flex gap-4 overflow-x-auto py-3">
            {images?.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt={altname}
                onClick={() => setSelectedImage(img.url)}
                className={`w-20 h-20 rounded-xl border cursor-pointer transition 
              ${
                selectedImage === img.url ? "border-black" : "border-gray-300"
              }`}
              />
            ))}
          </div>
        </div>

        {/* LEFT THUMBNAILS  */}
        <div className="hidden lg:flex flex-col gap-4">
          {images?.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt={altname}
              onClick={() => setSelectedImage(img.url)}
              className={`w-24 h-24 rounded-xl border cursor-pointer transition 
            ${selectedImage === img.url ? "border-black" : "border-gray-300"}`}
            />
          ))}
        </div>

        {/*MAIN IMAGE   */}
        <div className="hidden lg:flex flex-1">
          <Card className="rounded-3xl shadow-xl p-6 bg-[#d4d4d4] w-full flex justify-center">
            <img
              src={selectedImage}
              alt={altname}
              className="w-full h-[450px] object-contain  rounded-2xl"
            />
          </Card>
        </div>
    </>
  );
};

export default ProductGallery;
