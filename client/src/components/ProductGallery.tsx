import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Button } from "./ui/button";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-square bg-gradient-to-br from-yellow-50/50 to-amber-50/50 rounded-2xl overflow-hidden border-2 border-yellow-100 shadow-cream group">
        <img
          src={images[selectedIndex]}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          className={`w-full h-full object-contain p-8 transition-transform duration-300 ${
            isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {/* Zoom Icon Indicator */}
        {!isZoomed && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-5 h-5 text-slate-700" />
          </div>
        )}

        {/* Navigation Arrows - Only show if multiple images */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNext}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation - Only show if multiple images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? "border-yellow-400 shadow-gold ring-2 ring-yellow-400/50"
                  : "border-yellow-100 hover:border-yellow-300 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-contain p-2 bg-gradient-to-br from-yellow-50/50 to-amber-50/50"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Labels */}
      {images.length > 1 && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50/80 border border-yellow-200 rounded-full text-sm text-slate-700">
            <span className="font-semibold">
              {selectedIndex === 0 && "Product Bottle"}
              {selectedIndex === 1 && "Supplement Facts"}
              {selectedIndex === 2 && "Capsule Close-up"}
              {selectedIndex === 3 && "Lifestyle"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
