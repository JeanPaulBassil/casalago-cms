'use client'

import React from 'react'
import {
  Accordion,
  AccordionItem,
  Button,
  Chip,
  Image,
  Link,
  RadioGroup,
  ScrollShadow,
} from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import { Product } from '@/api/models/Product'
import { Badge, X } from 'lucide-react'

type ProductViewInfoProps = {
  product?: Product
}

const ProductViewInfo = ({ product }: ProductViewInfoProps) => {
  const [isStarred, setIsStarred] = React.useState(false)
  const [selectedImage, setSelectedImage] = React.useState(product?.images[0] || 'https://developers.elementor.com/docs/hooks/placeholder-image/')

  return (
    <div
      className={cn(
        'relative flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8'
      )}
    >
      <div className="relative h-full w-full flex-none">
        <Image
          alt={product?.name}
          className="h-[500px] w-full object-contain"
          radius="lg"
          src={selectedImage}
        />
        <ScrollShadow
          className="-mx-2 -mb-4 mt-4 flex w-full max-w-full gap-4 px-2 pb-4 pt-2"
          orientation="horizontal"
        >
          {product?.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  className="relative h-24 w-24 flex-none cursor-pointer items-center justify-center rounded-medium ring-offset-background transition-shadow data-[selected=true]:outline-none data-[selected=true]:ring-2 data-[selected=true]:ring-focus data-[selected=true]:ring-offset-2"
                  data-selected={image === selectedImage}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    removeWrapper
                    alt={product.name}
                    classNames={{
                      img: 'h-full w-full object-contain',
                    }}
                    radius="lg"
                    src={image}
                  />
                </button>
          ))}
        </ScrollShadow>
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">{product?.name}</h1>
        <div className="mt-4">
          <p className="line-clamp-3 text-medium text-default-500">{product?.description}</p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <p className="text-medium text-default-500">Brand:</p>
          <p className="text-medium text-default-900">{product?.brand.name}</p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <p className="text-medium text-default-500">Category:</p>
          <p className="text-medium text-default-900">{product?.category}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {product?.tags.map((tag) => (
            <Chip key={tag}>{tag}</Chip>
          ))}
        </div>
      </div>
    </div>
  )
}

ProductViewInfo.displayName = 'ProductViewInfo'

export default ProductViewInfo
