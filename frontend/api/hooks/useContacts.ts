import { useQuery } from '@tanstack/react-query'
import { getContacts } from '../contacts'

export const useContacts = (search?: string) => {
  return useQuery({
    queryKey: ['contacts', search],
    queryFn: () => getContacts(search),
  })
}
