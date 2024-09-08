'use client'

import type { InputProps } from '@nextui-org/react'

import React, { Suspense } from 'react'
import { Button, Input, Checkbox, Link, Divider } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { useForm } from 'react-hook-form'
import Joi from 'joi'
import { joiResolver } from '@hookform/resolvers/joi'
import { AuthApi } from '@/api/auth.api'
import { AnimatedList } from '../_components/AnimatedList'
import { useNotification } from '@/providers/NotificationProvider'
import saveTokensAction from '../actions/save-tokens.action'
import { useToaster } from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useToast } from '../contexts/ToastContext'

type FormValues = {
  username: string
  password: string
}

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})

function LoginComponent() {
  const [isVisible, setIsVisible] = React.useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)
  const toast = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirectParam = searchParams.get('redirect')

  const inputClasses: InputProps['classNames'] = {
    inputWrapper:
      'border-transparent bg-default-50/40 dark:bg-default-50/20 group-data-[focus=true]:border-primary data-[hover=true]:border-foreground/20',
  }

  const buttonClasses = 'bg-foreground/10 dark:bg-foreground/20'

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: joiResolver(loginSchema),
  })

  const onSubmit = async (data: FormValues) => {
    const authApi = new AuthApi()
    try {
      const response = await authApi.login(data.username, data.password)
      toast.success('Logged in successfully')
      const { access_token, refresh_token } = response.payload
      saveTokensAction(access_token, refresh_token)

      setTimeout(() => {
        router.replace(redirectParam ?? '/')
      }, 200)
    } catch (error) {
      toast.error('Invalid credentials')
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-[#ffd2d2] via-[#abfffb] to-[#a8fffb] p-2 sm:p-4 lg:p-8">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-md bg-background/60 px-8 pb-10 pt-6 shadow-small backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
        <p className="pb-2 text-xl font-medium">Log In</p>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <Input
            classNames={inputClasses}
            label="Email Address"
            radius="sm"
            placeholder="Enter your email"
            type="text"
            {...register('username')}
            errorMessage={errors.username?.message}
            isInvalid={!!errors.username}
            isRequired
            isDisabled={isSubmitting}
            variant="bordered"
          />
          <Input
            classNames={inputClasses}
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-foreground/50"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-foreground/50"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Password"
            radius="sm"
            placeholder="Enter your password"
            type={isVisible ? 'text' : 'password'}
            variant="bordered"
            {...register('password')}
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            isRequired
            isDisabled={isSubmitting}
          />
          <Button className={buttonClasses} isLoading={isSubmitting} radius="sm" type="submit">
            Log In
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function page() {
  return (
    <Suspense>
      <LoginComponent />
    </Suspense>
  )
}
