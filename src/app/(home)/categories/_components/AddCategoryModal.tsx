import { CategoryApi } from '@/api/category.api'
import { FileUploadApi } from '@/api/file-upload.api'
import { CreateCategory } from '@/api/models/Category'
import { FileUpload } from '@/api/models/FileUpload'
import { ApiResponse } from '@/api/utils'
import { useToast } from '@/app/contexts/ToastContext'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/modal'
import { Image } from '@nextui-org/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Joi from 'joi'
import { ImageUp, Plus, X } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
  isOpen: boolean
  onClose: () => void
  queries: {
    name: string
  }
}

const categorySchema = Joi.object({
  name: Joi.string().required(),
})

const AddCategoryModal = ({ isOpen, onClose, queries }: Props) => {
  const toast = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateCategory>({
    resolver: joiResolver(categorySchema),
  })

  const onSubmit = (data: CreateCategory) => {
    createCategory(data)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setError(null)
      setFile(selectedFile)
    }
  }

  const { mutateAsync: createCategory } = useMutation({
    mutationFn: async (data: CreateCategory) => {
      const fileUploadApi = new FileUploadApi()
      const categoryApi = new CategoryApi()

      if (file) {
        const uploadResponse = (await fileUploadApi.uploadSingle(file)) as ApiResponse<FileUpload>
        data.image = uploadResponse.payload.image_url
      }

      return await categoryApi.create(data)
    },
    onSuccess: () => {
      toast.success('Category created successfully')
      handleClose()
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', queries] })
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
    event.preventDefault()
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
              <h2 className="text-2xl font-normal">Add Category</h2>
              <p className="text-small font-light text-gray-500 dark:text-gray-300">
                Add a new category to the system
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
            <div
              className="flex w-full items-center justify-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <label
                htmlFor="dropzone-file"
                className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-800"
              >
                {file ? (
                  <div className="flex flex-wrap gap-4">
                    <div className="relative">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded Image`}
                        className="h-[100px] w-[100px] rounded-md object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <ImageUp className="mb-4 h-8 w-8 text-[#417D7A]" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold text-[#417D7A]">Click to upload</span> or drag
                      and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Images only</p>
                  </div>
                )}
                <input
                  id="dropzone-file"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
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
              Add Category
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default AddCategoryModal
