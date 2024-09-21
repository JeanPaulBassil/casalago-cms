'use client'
import Widget from '@/app/_components/shared/Widget'
import { useSidebarContext } from '@/app/contexts/SidebarContext'
import { Button } from '@nextui-org/button'
import { useDisclosure } from '@nextui-org/modal'
import { Plus, Search, Sidebar, Trash } from 'lucide-react'
import React, { useState } from 'react'
import {
  Input,
  Spacer,
  Spinner,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Table,
  Avatar,
} from '@nextui-org/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useOrderedQueries from '@/hooks/useQueries'
import useDebouncedCallback from '@/hooks/useDebounceCallback'
import { ServerError } from '@/api/utils'
import AddBrandModal from './_components/AddBrandModal'
import { BrandApi } from '@/api/brand.api'
import { Brand } from '@/api/models/Brand'
import { useToast } from '@/app/contexts/ToastContext'

const columns = [
  {
    name: 'Name',
    accessorKey: 'name',
  },
  {
    name: 'Description',
    accessorKey: 'description',
  },
  {
    name: 'Actions',
    accessorKey: 'actions',
  },
]

const page = () => {
  const { onToggle } = useSidebarContext()
  const toast = useToast()
  const queryClient = useQueryClient()

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

  const onDeleteBrand = (id: string) => {
    deleteBrand(id)
  }

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
    onMutate: (id) => {
      queryClient.cancelQueries({ queryKey: ['brands', getQueries()] })

      const previousBrands = queryClient.getQueryData<Brand[]>(['brands', getQueries()])
      queryClient.setQueryData(['brands', getQueries()], (old: Brand[] | undefined) => {
        return old?.filter((currentBrand) => currentBrand.id !== id)
      })

      return { previousBrands }
    },
  })

  return (
    <div className="h-screen">
      <AddBrandModal
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
        <div className="mt-4 flex h-[calc(100vh-8rem)] flex-wrap gap-4 overflow-scroll">
          {isLoading ? (
            <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
              <Spinner color="success" />
            </div>
          ) : (
            <Table removeWrapper isStriped>
              <TableHeader columns={columns}>
                <TableColumn>Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody items={brands}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={item.image}
                          alt={item.name}
                          className="h-8 w-8 rounded-full"
                        />
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => onDeleteBrand(item.id)}
                        isIconOnly
                        variant="light"
                        size="sm"
                        startContent={<Trash color="red" size={16} />}
                      ></Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </Widget>
    </div>
  )
}

export default page
