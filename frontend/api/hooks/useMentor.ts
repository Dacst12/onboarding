import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMentees, getMentee, getMenteeOnboardingPlan, updateMenteeTaskStatus, getMenteeUserFeedback } from '../mentor'

export const useMentees = () => {
  return useQuery({
    queryKey: ['mentor', 'mentees'],
    queryFn: getMentees,
  })
}

export const useMentee = (userId: number) => {
  return useQuery({
    queryKey: ['mentor', 'mentees', userId],
    queryFn: () => getMentee(userId),
    enabled: userId > 0,
  })
}

export const useMenteeOnboardingPlan = (userId: number) => {
  return useQuery({
    queryKey: ['mentor', 'mentees', userId, 'plan'],
    queryFn: () => getMenteeOnboardingPlan(userId),
    enabled: userId > 0,
  })
}

export const useUpdateMenteeTaskStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      taskId,
      isCompleted,
    }: {
      userId: number
      taskId: number
      isCompleted: boolean
    }) => updateMenteeTaskStatus(userId, taskId, isCompleted),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['mentor', 'mentees', variables.userId, 'plan'],
      })
    },
  })
}

export const useMenteeUserFeedback = (userId: number) => {
  return useQuery({
    queryKey: ['mentor', 'mentees', userId, 'feedback'],
    queryFn: () => getMenteeUserFeedback(userId),
    enabled: userId > 0,
  })
}
