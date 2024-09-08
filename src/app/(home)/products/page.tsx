'use client'
import { Button } from '@nextui-org/button'
import { useDisclosure } from '@nextui-org/modal'
import { Plus, Search, Sidebar } from 'lucide-react'
import React, { useState } from 'react'
import { Input, Spacer, Spinner } from '@nextui-org/react'
import { useSidebarContext } from '@/app/contexts/SidebarContext'
import useOrderedQueries from '@/hooks/useQueries'
import useDebouncedCallback from '@/hooks/useDebounceCallback'
import Widget from '@/app/_components/shared/Widget'
import AddProductModal from './_components/AddProductModal'
import { cn } from '@/lib/utils'
import ProductCard from './_components/ProductCard'
import { useQuery } from '@tanstack/react-query'
import { Product } from '@/api/models/Product'
import { ServerError } from '@/api/utils'
import { ProductApi } from '@/api/product.api'
import Link from 'next/link'

const page = () => {
  const { onToggle } = useSidebarContext()
  const productApi = new ProductApi()
  const {
    isOpen: isOpenCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal,
  } = useDisclosure()

  const [searchBrands, setSearchBrands] = useState<string>('')
  const { get: getQueries, set: setQueries } = useOrderedQueries<{
    name: string
    brandId: string
    category: string
    tags: string[]
  }>({
    name: '',
    brandId: '',
    category: '',
    tags: [],
  })

  const debounceName = useDebouncedCallback((value: string) => {
    setQueries({ name: value })
  }, 500)

  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery<Product[], ServerError>({
    queryKey: ['products', getQueries()],
    queryFn: async () => {
      const response = await productApi.getProducts({ queries: getQueries() })
      return response.payload
    },
  })

  return (
    <div className="h-screen">
      <AddProductModal
        isOpen={isOpenCreateModal}
        onClose={onCloseCreateModal}
        queries={getQueries()}
      />
      <Widget className="border-2 border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={onToggle}
              isIconOnly
              endContent={<Sidebar />}
              variant="light"
              className="max-md:hidden"
            />
            <h2 className="text-lg font-bold">Products</h2>
          </div>
          <Button
            radius="sm"
            className="hidden bg-[#417D7A] text-white md:flex"
            onClick={onOpenCreateModal}
            startContent={<Plus />}
          >
            Add Product
          </Button>
          <Button
            radius="sm"
            className="bg-[#417D7A] text-white md:hidden"
            onClick={onOpenCreateModal}
            isIconOnly
            startContent={<Plus />}
          />
        </div>
      </Widget>
      <Spacer y={2} />
      <Widget className="flex h-[calc(100vh-6rem)] flex-col overflow-y-scroll border-2 border-gray-200 px-5 pt-4">
        <Input
          placeholder="Search"
          startContent={<Search />}
          radius="sm"
          variant="bordered"
          className="max-w-[400px]"
          value={searchBrands}
          isClearable
          onChange={(e) => {
            setSearchBrands(e.target.value)
            debounceName(e.target.value)
          }}
          onClear={() => {
            setSearchBrands('')
            setQueries({ name: '' })
          }}
        />
        {isLoading ? (
          <div className="flex h-screen items-center justify-center">
            <Spinner />
          </div>
        ) : !products ? (
          <div className="flex h-screen items-center justify-center">
            <p>No products found</p>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap">
              <div
                className={cn(
                  'my-auto grid max-w-7xl grid-cols-1 gap-5 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                )}
              >
                {products?.map((product) => {
                  return (
                    <Link href={`products/${product.id}`} key={product.id}>
                      <ProductCard product={product} />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </Widget>
    </div>
  )
}

export default page
