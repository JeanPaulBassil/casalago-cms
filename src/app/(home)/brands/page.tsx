'use client'
import Widget from '@/app/_components/shared/Widget'
import { useSidebarContext } from '@/app/contexts/SidebarContext'
import { Button } from '@nextui-org/button'
import { useDisclosure } from '@nextui-org/modal'
import { Plus, Search, Sidebar } from 'lucide-react'
import React, { useState } from 'react'
import { Input, Spacer, Spinner } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { UserApi } from '@/api/user.api'
import { User } from '@/api/models/User'
import useOrderedQueries from '@/hooks/useQueries'
import useDebouncedCallback from '@/hooks/useDebounceCallback'
import { ServerError } from '@/api/utils'
import AddBrandModal from './_components/AddBrandModal'
import { BrandApi } from '@/api/brand.api'
import { Brand } from '@/api/models/Brand'
import BrandCard from './_components/BrandCard'

const page = () => {
  const { onToggle } = useSidebarContext()
  const {
    isOpen: isOpenCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal,
  } = useDisclosure()

  const brandApi = new BrandApi()

  const [searchBrands, setSearchBrands] = useState<string>('')
  const { get: getQueries, set: setQueries } = useOrderedQueries<{
    name: string
  }>({
    name: '',
  })

  const debounceName = useDebouncedCallback((value: string) => {
    setQueries({ name: value })
  }, 500)

  const {
    data: brands,
    isLoading,
    isError,
    error,
  } = useQuery<Brand[], ServerError>({
    queryKey: ['brands', getQueries()],
    queryFn: async () => {
      const response = await brandApi.getBrands({ queries: getQueries() })
      return response.payload
    },
  })

  return (
    <div className="h-screen">
      <AddBrandModal isOpen={isOpenCreateModal} onClose={onCloseCreateModal} queries={getQueries()} />
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
            <h2 className="text-lg font-bold">Brands</h2>
          </div>
          <Button
            radius="sm"
            className="hidden bg-[#417D7A] text-white md:flex"
            onClick={onOpenCreateModal}
            startContent={<Plus />}
          >
            Add Brand
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
      <Widget className="flex h-[calc(100vh-6rem)] flex-col border-2 border-gray-200 px-5 pt-4">
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
        <div className="flex flex-wrap gap-4 overflow-scroll h-[calc(100vh-8rem)]">
          {isLoading ? (
            <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
              <Spinner color="success" />
            </div>
          ) : (
            brands?.length === 0 ? <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
              <p className="text-lg text-gray-500">No brands found</p>
            </div> :
            <div className="flex flex-wrap gap-4 mt-4">
              {brands?.map((brand) => <BrandCard key={brand.id} brand={brand} queries={getQueries()} />)}
            </div>
          )}
        </div>
      </Widget>
    </div>
  )
}

export default page
