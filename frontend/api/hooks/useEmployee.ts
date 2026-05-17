import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyPlan, getLastFeedback, getFeedbackAvailable, completeTask, uncompleteTask, createFeedback } from '../employee'

export const useMyPlan = () => {
  return useQuery({
    queryKey: ['employee', 'plan'],
    queryFn: getMyPlan,
  })
}

export const useLastFeedback = () => {
  return useQuery({
    queryKey: ['employee', 'feedback', 'last'],
    queryFn: getLastFeedback,
  })
}

export const useFeedbackAvailable = () => {
  return useQuery({
    queryKey: ['employee', 'feedback', 'available'],
    queryFn: getFeedbackAvailable,
  })
}

export const useCompleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', 'plan'] })
    },
  })
}

export const useUncompleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uncompleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', 'plan'] })
    },
  })
}

export const useCreateFeedback = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', 'feedback'] })
    },
  })
}
