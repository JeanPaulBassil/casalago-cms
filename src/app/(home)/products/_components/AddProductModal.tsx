import { BrandApi } from '@/api/brand.api'
import { FileUploadApi } from '@/api/file-upload.api'
import { Brand } from '@/api/models/Brand'
import { MultipleFileUpload } from '@/api/models/FileUpload'
import { Product } from '@/api/models/Product'
import { ProductApi } from '@/api/product.api'
import { ApiResponse } from '@/api/utils'
import { useToast } from '@/app/contexts/ToastContext'
import { joiResolver } from '@hookform/resolvers/joi'
import { Avatar, AvatarProps } from '@nextui-org/avatar'
import { Button } from '@nextui-org/button'
import { Input, Textarea } from '@nextui-org/input'
import { Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/modal'
import {
  Autocomplete,
  AutocompleteItem,
  Chip,
  Image,
  Select,
  SelectItem,
  Tooltip,
} from '@nextui-org/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  brandId: Joi.string().required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).required(),
})

const AddProductModal = ({ isOpen, onClose, queries }: Props) => {
  const toast = useToast()
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [currentTagName, setCurrentTagName] = useState<string>('')
  const brandApi = new BrandApi()
  const productApi = new ProductApi()
  const fileUploadApi = new FileUploadApi()

  const { data: brands } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await brandApi.getBrands({ queries: { name: '' } })
      if (response.payload.length === 0) {
        setErrorCreate('brandId', { message: 'You need to create a brand first' })
      }
      return response.payload
    },
  })

  const handleClose = () => {
    setFiles([])
    setSelectedBrand(null)
    setCurrentTagName('')
    resetCreate()
    onClose()
  }

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await productApi.getAllCategories()
      return response.payload
    },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.length > 0) {
      setError(null)
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles])
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFiles = Array.from(event.dataTransfer.files).filter((file) =>
      ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
    )
    if (droppedFiles.length > 0) {
      setError(null)
      setFiles((prevFiles) => [...prevFiles, ...droppedFiles])
    } else {
      setError('Please upload valid image files')
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const removeImage = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const {
    handleSubmit: handleCreateSubmit,
    register: registerCreate,
    setValue: setValueCreate,
    getValues: getValuesCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate },
    setError: setErrorCreate,
  } = useForm<Product>({
    resolver: joiResolver(productSchema),
  })

  const handleCreate = async (data: Product) => {
    const response = await createProduct(data)
  }

  const {
    mutateAsync: createProduct,
  } = useMutation({
    mutationFn: async (data: Product) => {
      const images = await fileUploadApi.uploadMultiple(files) as ApiResponse<MultipleFileUpload>
      const response = await productApi.create({ ...data, images: images.payload.image_urls })
      return response
    },
    onSuccess: () => {
      toast.success('Product created successfully')
      handleClose()
    },
    onError: (error) => {
      toast.error('Error creating product')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const addTag = () => {
    const newTag = currentTagName
    if (newTag) {
      setValueCreate('tags', [...(getValuesCreate('tags') || []), newTag])
      setCurrentTagName('')
    }
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
        <form className="px-10 py-8" onSubmit={handleCreateSubmit(handleCreate)}>
          {/* Modal Header */}
          <div className="flex flex-row items-start justify-between">
            {/* Left */}
            <div className="flex flex-col space-y-2">
              <h2 className="text-2xl font-normal">Add Product</h2>
              <p className="text-small font-light text-gray-500 dark:text-gray-300">
                Add a new product to the system
              </p>
            </div>
            {/* Right */}
            <Button
              isIconOnly
              startContent={<X size={24} strokeWidth={1.5} />}
              variant="light"
              onClick={handleClose}
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
              radius="sm"
              {...registerCreate('name')}
              isInvalid={!!errorsCreate.name}
              errorMessage={errorsCreate.name?.message}
            />
            <Textarea
              label="Description"
              aria-label="Description"
              placeholder="Enter the description"
              variant="bordered"
              className="w-full"
              isRequired
              radius="sm"
              {...registerCreate('description')}
              isInvalid={!!errorsCreate.description}
              errorMessage={errorsCreate.description?.message}
            />
            <div className="flex w-full flex-row justify-between gap-4">
              <Select
                isDisabled={!brands}
                isLoading={!brands}
                items={brands}
                label="Brand"
                placeholder="Select a brand"
                isRequired
                radius="sm"
                variant="bordered"
                selectionMode="single"
                {...registerCreate('brandId')}
                isInvalid={!!errorsCreate.brandId}
                errorMessage={errorsCreate.brandId?.message}
              >
                {(brand) => (
                  <SelectItem key={brand.id} startContent={<Avatar src={brand.image} />}>
                    {brand.name}
                  </SelectItem>
                )}
              </Select>
              <Autocomplete
                label="Category"
                placeholder="Select a category"
                isRequired
                radius="sm"
                variant="bordered"
                allowsCustomValue
                items={categories?.map((category) => ({ label: category, value: category })) || []}
                {...registerCreate('category')}
                isInvalid={!!errorsCreate.category}
                errorMessage={errorsCreate.category?.message}
              >
                {(category) => (
                  <AutocompleteItem key={category.value}>{category.label}</AutocompleteItem>
                )}
              </Autocomplete>
            </div>
            <div className="flex flex-row flex-wrap items-center gap-1">
              {getValuesCreate('tags')?.map((tag: string, index: number) => (
                <Chip key={index} variant="bordered">
                  {tag}
                </Chip>
              ))}
              <Input
                placeholder="add tag"
                variant="bordered"
                value={currentTagName}
                onChange={(e) => setCurrentTagName(e.target.value)}
                className="min-w-[100px] max-w-[200px]"
                isRequired
                size="sm"
                radius="full"
                classNames={{
                  inputWrapper: 'pr-0',
                }}
                endContent={
                  <Button
                    type="button"
                    isIconOnly
                    size="sm"
                    variant="light"
                    radius="full"
                    endContent={<Plus size={16} strokeWidth={1.5} />}
                    onClick={addTag}
                  ></Button>
                }
              />
            </div>
            <div
              className="flex w-full items-center justify-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <label
                htmlFor="dropzone-file"
                className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-800"
              >
                {files.length > 0 ? (
                  <div className="flex flex-wrap gap-4">
                    {files.map((file, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Uploaded Image ${index + 1}`}
                          className="h-[100px] w-[100px] rounded-md object-cover"
                          onClick={() => removeImage(index)}
                        />
                      </div>
                    ))}
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
                  multiple
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

export default AddProductModal
