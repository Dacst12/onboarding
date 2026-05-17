import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import router from '../router'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#ff6720',
            colorPrimaryHover: '#e55a1a',
            colorLink: '#ff6720',
            colorLinkHover: '#e55a1a',
            borderRadius: 8,
            fontFamily: "'Inter', sans-serif",
          },
          components: {
            Menu: {
              itemSelectedBg: '#fff3ee',
              itemSelectedColor: '#ff6720',
              itemHoverBg: '#fff8f5',
            },
            Layout: {
              siderBg: '#FFFFFF',
              headerBg: '#FFFFFF',
            },
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>
)
