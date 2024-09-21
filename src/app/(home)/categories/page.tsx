'use client'
import Widget from '@/app/_components/shared/Widget'
import { useSidebarContext } from '@/app/contexts/SidebarContext'
import { Button } from '@nextui-org/button'
import { Modal, ModalBody, ModalContent, useDisclosure } from '@nextui-org/modal'
import { Plus, Search, Sidebar, Trash, X } from 'lucide-react'
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
  Image,
} from '@nextui-org/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useOrderedQueries from '@/hooks/useQueries'
import useDebouncedCallback from '@/hooks/useDebounceCallback'
import { ServerError } from '@/api/utils'
import AddBrandModal from './_components/AddCategoryModal'
import { BrandApi } from '@/api/brand.api'
import { Brand } from '@/api/models/Brand'
import { useToast } from '@/app/contexts/ToastContext'
import { CategoryApi } from '@/api/category.api'
import { Category } from '@/api/models/Category'
import AddCategoryModal from './_components/AddCategoryModal'

const columns = [
  {
    name: 'Name',
    accessorKey: 'name',
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
  const categoryApi = new CategoryApi()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const {
    isOpen: isOpenCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal,
  } = useDisclosure()

  const [searchCategories, setSearchCategories] = useState<string>('')
  const { get: getQueries, set: setQueries } = useOrderedQueries<{
    name: string
  }>({
    name: '',
  })

  const debounceName = useDebouncedCallback((value: string) => {
    setQueries({ name: value })
  }, 500)

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery<Category[], ServerError>({
    queryKey: ['categories', getQueries()],
    queryFn: async () => {
      const response = await categoryApi.getCategories({ queries: getQueries() })
      return response.payload
    },
  })

  const onDeleteCategory = (id: string) => {
    deleteCategory(id)
  }

  const { mutateAsync: deleteCategory } = useMutation({
    mutationFn: (id: string) => {
      const categoryApi = new CategoryApi()
      return categoryApi.delete(id)
    },
    onSuccess: () => {
      toast.success('Category deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onMutate: (id) => {
      queryClient.cancelQueries({ queryKey: ['categories', getQueries()] })

      const previousCategories = queryClient.getQueryData<Category[]>(['categories', getQueries()])
      queryClient.setQueryData(['categories', getQueries()], (old: Category[] | undefined) => {
        return old?.filter((currentCategory) => currentCategory.id !== id)
      })

      return { previousCategories }
    },
  })

  console.log('categories', categories)

  return (
    <div className="h-screen">
      <AddCategoryModal
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
            <h2 className="text-lg font-bold">Categories</h2>
          </div>
          <Button
            radius="sm"
            className="hidden bg-[#417D7A] text-white md:flex"
            onClick={onOpenCreateModal}
            startContent={<Plus />}
          >
            Add Category
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
          value={searchCategories}
          isClearable
          onChange={(e) => {
            setSearchCategories(e.target.value)
            debounceName(e.target.value)
          }}
          onClear={() => {
            setSearchCategories('')
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
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody items={categories}>
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell className="flex items-center gap-2">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="aspect-square w-10 rounded-md object-cover hover:scale-110"
                      />
                      {item.name}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => onDeleteCategory(item.id)}
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
