'use client'
import Widget from '@/app/_components/shared/Widget'
import { useSidebarContext } from '@/app/contexts/SidebarContext'
import { Button } from '@nextui-org/button'
import { useDisclosure } from '@nextui-org/modal'
import { Plus, Search, Sidebar } from 'lucide-react'
import React, { useState } from 'react'
import AddUserModal from './_components/AddUserModal'
import { Input, Spacer } from '@nextui-org/react'
import UserProfile from './_components/UserProfile'
import { useQuery } from '@tanstack/react-query'
import { UserApi } from '@/api/user.api'
import { User } from '@/api/models/User'
import useOrderedQueries from '@/hooks/useQueries'
import useDebouncedCallback from '@/hooks/useDebounceCallback'
import { ServerError } from '@/api/utils'

const page = () => {
  const { onToggle } = useSidebarContext()
  const userApi = new UserApi()

  const {
    isOpen: isOpenCreateModal,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal,
  } = useDisclosure()

  const [searchUsers, setSearchUsers] = useState<string>('')
  const { get: getQueries, set: setQueries } = useOrderedQueries<{
    username: string
  }>({
    username: '',
  })

  const debounceUsername = useDebouncedCallback((value: string) => {
    setQueries({ username: value })
  }, 500)

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery<User[], ServerError>({
    queryKey: ['users', getQueries()],
    queryFn: async () => {
      const response = await userApi.getUsers({ queries: getQueries() })
      return response.payload
    },
  })

  console.log('users', users)
  return (
    <div className="h-screen">
      <AddUserModal isOpen={isOpenCreateModal} onClose={onCloseCreateModal} />
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
            <h2 className="text-lg font-bold">Users</h2>
          </div>
          <Button
            radius="sm"
            className="hidden bg-[#417D7A] text-white md:flex"
            onClick={onOpenCreateModal}
            startContent={<Plus />}
          >
            Add User
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
          value={searchUsers}
          isClearable
          onChange={(e) => {
            setSearchUsers(e.target.value)
            debounceUsername(e.target.value)
          }}
          onClear={() => {
            setSearchUsers('')
            setQueries({ username: '' })
          }}
        />
        <div className="flex flex-wrap gap-4">
          <UserProfile
            user={{
              username: 'John Doe',
            }}
          />
          <UserProfile
            user={{
              username: 'John Doe',
            }}
          />
        </div>
      </Widget>
    </div>
  )
}

export default page
