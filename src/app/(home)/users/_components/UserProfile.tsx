'use client'

import React from 'react'
import { Card, CardHeader, CardBody, Button, Avatar, Tabs, Tab, Chip } from '@nextui-org/react'
import { User } from '@/api/models/User'
import { Trash } from 'lucide-react'

export default function UserProfile({ user }: { user: User }) {
  return (
    <Card className="my-10 w-[200px] h-[170px]">
      <CardHeader className="relative flex items-center justify-between overflow-visible bg-gradient-to-br from-[#92d7d3] via-[#59b6b2] to-[#0e958f]">
        <Avatar name={user.username} />
        <Button
          radius="full"
          size="sm"
          variant="light"
          endContent={<Trash color="white" />}
          isIconOnly
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
