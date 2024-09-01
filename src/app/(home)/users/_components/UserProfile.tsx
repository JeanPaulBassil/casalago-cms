'use client'

import React from 'react'
import { Card, CardHeader, CardBody, Button, Avatar, Tabs, Tab, Chip } from '@nextui-org/react'
import { User } from '@/api/models/User'
import { Trash } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UserApi } from '@/api/user.api'
import { useToast } from '@/app/contexts/ToastContext'

export default function UserProfile({
  user,
  userQuery,
}: {
  user: User
  userQuery: {
    username: string
  }
}) {
  const userApi = new UserApi()
  const toast = useToast()
  const queryClient = useQueryClient()

  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: async () => {
      await userApi.deleteUser(user.id)
    },
    onSuccess: () => {
      toast.success('User deleted successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ['users', userQuery],
      })
      const previousUsers = queryClient.getQueryData<User[]>(['users', userQuery]) as User[]
      queryClient.setQueryData(
        ['users', userQuery],
        previousUsers.filter((u) => u.id !== user.id)
      )

      return { previousUsers }
    },
  })

  return (
    <Card className={`my-10 h-[170px] w-[200px] ${isPending ? 'opacity-50' : ''}`}>
      <CardHeader className="relative flex items-center justify-between overflow-visible bg-gradient-to-br from-[#92d7d3] via-[#59b6b2] to-[#0e958f]">
        <Avatar name={user.username} />
        <Button
          radius="full"
          size="sm"
          variant="light"
          endContent={<Trash color="white" />}
          isIconOnly
          onClick={() => deleteUser()}
        ></Button>
      </CardHeader>
      <CardBody>
        <div className="py-2">
          <p className="text-base font-medium">{user.username}</p>
          <div className="flex gap-2 pb-1 pt-2">
            <Chip variant="flat">Admin</Chip>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
