'use client'

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from '@chakra-ui/react'

export const toaster = createToaster({
  placement: 'top',
  pauseOnPageIdle: true,
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {(toast) => (
          <Toast.Root 
            width={{ md: 'sm' }}
            bg={
              toast.type === 'success' ? 'green.700' :
              toast.type === 'error' ? 'red.700' :
              toast.type === 'warning' ? 'yellow.700' :
              'gray.700'
            }
            color="white"
            borderRadius="md"
            boxShadow="lg"
            p={3}
          >
            {toast.type === 'loading' ? (
              <Spinner size='sm' color='white' />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap='1' flex='1' maxWidth='100%'>
              {toast.title && (
                <Toast.Title fontWeight="bold" color="white">
                  {toast.title}
                </Toast.Title>
              )}
              {toast.description && (
                <Toast.Description color="whiteAlpha.900">
                  {toast.description}
                </Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger color="white" />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}