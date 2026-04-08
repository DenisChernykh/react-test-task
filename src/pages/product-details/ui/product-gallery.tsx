import { useState } from 'react';
import { Button } from '@/shared/ui/components/button';
import { Card, CardContent } from '@/shared/ui/components/card';

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = images[activeImageIndex] ?? images[0];

  return (
    <Card className="rounded-[2rem]">
      <CardContent className="space-y-4 px-6">
        <div className="overflow-hidden rounded-[1.5rem] bg-muted">
          <img alt={productName} className="aspect-[4/5] w-full object-cover" src={activeImage} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {images.map((image, index) => {
            const isActive = image === activeImage;

            return (
              <Button
                className="h-auto overflow-hidden p-0"
                key={image}
                onClick={() => setActiveImageIndex(index)}
                size="sm"
                type="button"
                variant={isActive ? 'default' : 'outline'}
              >
                <img
                  alt={`${productName} preview ${index + 1}`}
                  className="aspect-square w-full object-cover"
                  src={image}
                />
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
