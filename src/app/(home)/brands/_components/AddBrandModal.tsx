import { BrandApi } from '@/api/brand.api'
import { FileUploadApi } from '@/api/file-upload.api'
import { CreateBrand } from '@/api/models/Brand'
import { FileUpload } from '@/api/models/FileUpload'
import { ApiResponse } from '@/api/utils'
import { useToast } from '@/app/contexts/ToastContext'
import { joiResolver } from '@hookform/resolvers/joi'
import { Avatar, AvatarProps } from '@nextui-org/avatar'
import { Button } from '@nextui-org/button'
import { Input, Textarea } from '@nextui-org/input'
import { Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/modal'
import { Image } from '@nextui-org/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Joi from 'joi'
import { Eye, EyeOff, Icon, ImageUp, Lock, Plus, Upload, UploadCloud, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
  isOpen: boolean
  onClose: () => void
  queries: {
    name: string
  }
}

const brandSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
})

const AddBrandModal = ({ isOpen, onClose, queries }: Props) => {
  const toast = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateBrand>({
    resolver: joiResolver(brandSchema),
  })

  const onSubmit = (data: CreateBrand) => {
    createBrand(data)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setError(null)
      setFile(selectedFile)
    }
  }

  const { mutateAsync: createBrand } = useMutation({
    mutationFn: async (data: CreateBrand) => {
      const fileUploadApi = new FileUploadApi()
      const brandApi = new BrandApi()

      if (file) {
        const uploadResponse = (await fileUploadApi.uploadSingle(file)) as ApiResponse<FileUpload>
        data.image = uploadResponse.payload.image_url
      }

      return await brandApi.create(data)
    },
    onSuccess: () => {
      toast.success('Brand created successfully')
      handleClose()
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['brands', queries] })
    },
  })

  const handleClose = () => {
    reset()
    setFile(null)
    onClose()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'image/png') {
      setError(null)
      setFile(droppedFile)
    } else {
      setError('Please upload an image file')
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault() // Prevents default browser behavior
  }

  return (
    <Modal
      classNames={{
        closeButton: 'hidden',
      }}
      backdrop={'blur'}
      size={'3xl'}
      isOpen={isOpen}
      onClose={onClose}
      radius="sm"
    >
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)} className="px-10 py-8">
          {/* Modal Header */}
          <div className="flex flex-row items-start justify-between">
            {/* Left */}
            <div className="flex flex-col space-y-2">
              <h2 className="text-2xl font-normal">Add Brand</h2>
              <p className="text-small font-light text-gray-500 dark:text-gray-300">
                Add a new brand to the system
              </p>
            </div>
            {/* Right */}
            <Button
              isIconOnly
              onClick={handleClose}
              startContent={<X size={24} strokeWidth={1.5} />}
              variant="light"
            />
          </div>

          {/* Modal Content */}
          <ModalBody className="my-4 flex flex-col items-start justify-center px-0">
            <Input
              label="Name"
              aria-label="Name"
              placeholder="Enter the name"
              variant="bordered"
              className="w-full"
              isRequired
              isDisabled={isSubmitting}
              radius="sm"
              {...register('name')}
              errorMessage={errors.name?.message}
              isInvalid={!!errors.name}
            />
            <Textarea
              label="Description"
              aria-label="Description"
              placeholder="Enter the description"
              variant="bordered"
              className="w-full"
              isRequired
              isDisabled={isSubmitting}
              radius="sm"
              {...register('description')}
              errorMessage={errors.description?.message}
              isInvalid={!!errors.description}
            />
          </ModalBody>

          <ModalFooter className="px-0">
            <Button color="secondary" variant="light" onPress={onClose} size="sm">
              Cancel
            </Button>
            <Button
              color="primary"
              variant="solid"
              radius="sm"
              size="sm"
              className="bg-[#417D7A] text-white"
              startContent={<Plus />}
              isLoading={isSubmitting}
              type="submit"
            >
              Add Brand
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default AddBrandModal
