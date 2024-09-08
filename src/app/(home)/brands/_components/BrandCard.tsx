'use client'
import React from 'react'
import { Button, Card, Image, CardBody } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { Brand } from '@/api/models/Brand'
import { Trash } from 'lucide-react'
import { BrandApi } from '@/api/brand.api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/app/contexts/ToastContext'

export default function BrandCard({
  brand,
  queries,
}: {
  brand: Brand
  queries: {
    name: string
  }
}) {
  const queryClient = useQueryClient()
  const toast = useToast()

  const { mutateAsync: deleteBrand } = useMutation({
    mutationFn: (id: string) => {
      const brandApi = new BrandApi()
      return brandApi.delete(id)
    },
    onSuccess: () => {
      toast.success('Brand deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ['brands', queries] })

      const previousBrands = queryClient.getQueryData<Brand[]>(['brands', queries])
      queryClient.setQueryData(['brands', queries], (old: Brand[] | undefined) => {
        return old?.filter((currentBrand) => currentBrand.id !== brand.id)
      })

      return { previousBrands }
    },
  })

  return (
    <Card className="w-full max-w-[520px]">
      <Button
        isIconOnly
        className="absolute left-2 top-2 z-20"
        radius="full"
        size="sm"
        variant="light"
        onClick={() => {
          deleteBrand(brand.id)
        }}
      >
        <Trash strokeWidth={1.5} size={18} color="#417D7A" />
      </Button>
      <CardBody className="flex flex-row flex-wrap p-0 sm:flex-nowrap">
        <Image
          removeWrapper
          alt={brand.name}
          className="h-auto w-full flex-none object-cover object-top md:w-48"
          src={brand.image}
        />
        <div className="px-4 py-5">
          <h3 className="text-large font-medium">{brand.name}</h3>
          <div className="flex flex-col gap-3 pt-2 text-small text-default-400">
            <p>{brand.description}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
