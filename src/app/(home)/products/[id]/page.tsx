'use client'
import { Button } from '@nextui-org/button'
import { useDisclosure } from '@nextui-org/modal'
import { Pen, Plus, Sidebar, Trash } from 'lucide-react'
import React from 'react'
import { Skeleton, Spacer, Spinner } from '@nextui-org/react'
import { useSidebarContext } from '@/app/contexts/SidebarContext'
import Widget from '@/app/_components/shared/Widget'
import { ProductApi } from '@/api/product.api'
import { useParams } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import ProductViewInfo from '../_components/ProductDetails'
import { Product } from '@/api/models/Product'
import EditProductModal from '../_components/EditProductModal'
import useOrderedQueries from '@/hooks/useQueries'
import { useToast } from '@/app/contexts/ToastContext'
import { useRouter } from 'next/navigation'

type Props = {
  params: { id: string }
}

const page = ({ params }: Props) => {
  const { onToggle } = useSidebarContext()
  const {
    isOpen: isOpenCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal,
  } = useDisclosure()
  const toast = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { get: getQueries, set: setQueries } = useOrderedQueries<{
    productId: string
  }>({
    productId: params.id,
  })

  const productApi = new ProductApi()
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', getQueries()],
    queryFn: () => productApi.getProduct(getQueries().productId),
  })

  const { mutateAsync: deleteProduct } = useMutation({
    mutationFn: async () => {
      return await productApi.delete(getQueries().productId)
    },
    onSuccess: () => {
      toast.success('Product deleted successfully')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      router.push('/products')
    },
  })

  return (
    <div className="h-screen">
      <EditProductModal isOpen={isOpenCreateModal} onClose={onCloseCreateModal} product={product?.payload as Product} queries={getQueries()} />
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
            <h2 className="text-lg font-bold">
              {isLoading ? <Skeleton className="h-6 w-40 rounded-md"/> : product?.payload?.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              radius="sm"
              onClick={onOpenCreateModal}
              isIconOnly
              variant='light'
              startContent={<Pen color='#417D7A'/>}
            />
            <Button
              radius="sm"
              variant='light'
              onPress={() => deleteProduct()}
              isIconOnly
              startContent={<Trash color='red'/>}
            />
          </div>
        </div>
      </Widget>
      <Spacer y={2} />
      <Widget className="flex h-[calc(100vh-6rem)] flex-col overflow-y-scroll border-2 border-gray-200 px-5 pt-4">
        {isLoading ? (
          <div className="flex h-screen items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <ProductViewInfo product={product?.payload as Product}/>
        )}
      </Widget>
    </div>
  )
}

export default page
