import { User } from '@/api/models/User'
import { UserApi } from '@/api/user.api'
import { useToast } from '@/app/contexts/ToastContext'
import { joiResolver } from '@hookform/resolvers/joi'
import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { Modal, ModalBody, ModalContent, ModalFooter } from '@nextui-org/modal'
import { useMutation } from '@tanstack/react-query'
import Joi from 'joi'
import { Eye, EyeOff, Icon, Lock, Plus, X } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})

const AddUserModal = ({ isOpen, onClose }: Props) => {
  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<User>({
    resolver: joiResolver(userSchema),
  })

  const onSubmit = (data: User) => {
    createUser(data)
  }

  const { mutateAsync: createUser } = useMutation({
    mutationFn: (data: User) => {
      const userApi = new UserApi()
      return userApi.create(data)
    },
    onSuccess: () => {
      toast.success('User created successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSettled: () => {
      reset()
      onClose()
    },
  })

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
              <h2 className="text-2xl font-normal">Add User</h2>
              <p className="text-small font-light text-gray-500 dark:text-gray-300">
                Add a new user to the system
              </p>
            </div>
            {/* Right */}
            <Button
              isIconOnly
              onClick={onClose}
              startContent={<X size={24} strokeWidth={1.5} />}
              variant="light"
            />
          </div>

          {/* Modal Content */}
          <ModalBody className="my-4 flex flex-col items-start justify-center px-0">
            <Input
              label="Username"
              aria-label="Username"
              placeholder="Enter the username"
              variant="bordered"
              className="w-full"
              isRequired
              isDisabled={isSubmitting}
              radius="sm"
              {...register('username')}
              errorMessage={errors.username?.message}
              isInvalid={!!errors.username}
            />
            <Input
              endContent={
                <button type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <Eye size={24} strokeWidth={1.5} />
                  ) : (
                    <EyeOff size={24} strokeWidth={1.5} />
                  )}
                </button>
              }
              label="Password"
              aria-label="Password"
              radius="sm"
              placeholder="Enter your password"
              type={isVisible ? 'text' : 'password'}
              variant="bordered"
              isDisabled={isSubmitting}
              isRequired
              {...register('password')}
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password}
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
              Add User
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default AddUserModal
