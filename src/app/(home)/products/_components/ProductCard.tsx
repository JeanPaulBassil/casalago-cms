'use client'

import React from 'react'
import { Button, cn, Image } from '@nextui-org/react'
import { Product } from '@/api/models/Product'

export type Pr = {
  name: string
  hex: string
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div
      className={cn(
        'relative flex w-full flex-none cursor-pointer flex-col gap-3 rounded-md transition-all duration-300 hover:shadow-md'
      )}
    >
      <Button
        isIconOnly
        className="absolute right-3 top-3 z-20 bg-background/60 backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
        radius="full"
        size="sm"
        variant="faded"
      >
        <Image
          alt={product.brand.name}
          className="w-10 rounded-full object-contain"
          src={product.brand.image}
        />
      </Button>
      <Image
        isBlurred
        isZoomed
        alt={product.name}
        className="aspect-square w-full hover:scale-110"
        src={product.images[0]}
      />

      <div className="mt-1 flex flex-col gap-2 px-1">
        <div className="flex items-start justify-between gap-1">
          <h3 className="text-small font-medium text-default-700">{product.name}</h3>

          {true !== undefined ? <div className="flex items-center gap-1"></div> : null}
        </div>
        {product.description ? (
          <p className="text-small text-default-500">{product.description}</p>
        ) : null}
        <p className="text-small font-medium text-default-500">{product.tags.join(', ')}</p>
      </div>
    </div>
  )
}

ProductCard.displayName = 'ProductCard'

export default ProductCard
