import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { User } from '../../types/user'
import type { CreateAdminUserPayload } from '../types/admin'
import {
  getAdminUsers,
  getAdminUser,
  updateAdminUser,
  createAdminUser,
  deactivateAdminUser,
  getMenteeOnboardingPlan,
  getTemplatePlans,
  getTemplatePlan,
  createTemplatePlan,
  updateTemplatePlan,
  deleteTemplatePlan,
  getProgressAnalytics,
  getMoodAnalytics,
  updateTaskStatus,
  getUserFeedback,
  addTaskToMentee,
  deleteTaskFromMentee,
  getSurveySettings,
  updateSurveySettings,
} from '../admin'

// Хуки для пользователей

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: getAdminUsers,
  })
}

export const useAdminUser = (userId: number) => {
  return useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: () => getAdminUser(userId),
  })
}

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: number
      payload: Partial<User>
    }) => updateAdminUser(userId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['admin', 'users', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateAdminUserPayload) => createAdminUser(payload),
    onSuccess: (newUser) => {
      queryClient.setQueryData(['admin', 'users'], (oldData?: User[]) => {
        return [...(oldData || []), newUser]
      })
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'mentors'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'departments'] })
    },
  })
}

export const useDeactivateAdminUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) => deactivateAdminUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

// Хуки для онбординг планов

export const useMenteeOnboardingPlan = (userId: number) => {
  return useQuery({
    queryKey: ['mentor', 'mentees', userId, 'plan'],
    queryFn: () => getMenteeOnboardingPlan(userId),
  })
}

// Хуки для шаблонов планов

export const useTemplatePlans = () => {
  return useQuery({
    queryKey: ['admin', 'templates'],
    queryFn: getTemplatePlans,
  })
}

export const useTemplatePlan = (templateId: number) => {
  return useQuery({
    queryKey: ['admin', 'templates', templateId],
    queryFn: () => getTemplatePlan(templateId),
  })
}

export const useCreateTemplatePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { title: string }) => createTemplatePlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] })
    },
  })
}

export const useUpdateTemplatePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      templateId,
      payload,
    }: {
      templateId: number
      payload: Partial<{ title: string }>
    }) => updateTemplatePlan(templateId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['admin', 'templates', data.id], data)
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] })
    },
  })
}

export const useDeleteTemplatePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (templateId: number) => deleteTemplatePlan(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] })
    },
  })
}

// Хуки для аналитики

export const useProgressAnalytics = () => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'progress'],
    queryFn: getProgressAnalytics,
  })
}

export const useMoodAnalytics = () => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'mood'],
    queryFn: getMoodAnalytics,
  })
}

// Хуки для справочников

export const useMentors = () => {
  return useQuery({
    queryKey: ['admin', 'mentors'],
    queryFn: async () => {
      const { getMentors } = await import('../admin')
      return getMentors()
    },
  })
}

export const useDepartments = () => {
  return useQuery({
    queryKey: ['admin', 'departments'],
    queryFn: async () => {
      const { getDepartments } = await import('../admin')
      return getDepartments()
    },
  })
}

export const useTemplatePlanNames = () => {
  return useQuery({
    queryKey: ['admin', 'template-plan-names'],
    queryFn: async () => {
      const { getTemplatePlanNames } = await import('../admin')
      return getTemplatePlanNames()
    },
  })
}

// Хуки для стадий и задач

export const useAddTemplateStage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      templateId,
      payload,
    }: {
      templateId: number
      payload: { title: string; order_index: number }
    }) => {
      const { addTemplateStage } = await import('../admin')
      return addTemplateStage(templateId, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] })
    },
  })
}

export const useUpdateTemplateStage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      templateId,
      stageId,
      payload,
    }: {
      templateId: number
      stageId: number
      payload: { title?: string; order_index?: number }
    }) => {
      const { updateTemplateStage } = await import('../admin')
      return updateTemplateStage(templateId, stageId, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] })
    },
  })
}

export const useDeleteTemplateStage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      templateId,
      stageId,
    }: {
      templateId: number
      stageId: number
    }) => {
      const { deleteTemplateStage } = await import('../admin')
      return deleteTemplateStage(templateId, stageId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] })
    },
  })
}

export const useAddTemplateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      stageId,
      payload,
    }: {
      stageId: number
      payload: {
        title: string
        description?: string
        offset_days: number
      }
    }) => {
      const { addTemplateTask } = await import('../admin')
      return addTemplateTask(stageId, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] })
    },
  })
}

export const useUpdateTemplateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      stageId,
      taskId,
      payload,
    }: {
      stageId: number
      taskId: number
      payload: {
        title?: string
        description?: string
        offset_days?: number
      }
    }) => {
      const { updateTemplateTask } = await import('../admin')
      return updateTemplateTask(stageId, taskId, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] })
    },
  })
}

export const useDeleteTemplateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      stageId,
      taskId,
    }: {
      stageId: number
      taskId: number
    }) => {
      const { deleteTemplateTask } = await import('../admin')
      return deleteTemplateTask(stageId, taskId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] })
    },
  })
}

export const useUpdateTaskStatus = () => {
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
    }) => updateTaskStatus(userId, taskId, isCompleted),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'users', variables.userId, 'plan'],
      })
    },
  })
}

export const useAddTaskToMentee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      stageId,
      payload,
    }: {
      userId: number
      stageId: number
      payload: {
        title: string
        description?: string
        due_date: string
      }
    }) => addTaskToMentee(userId, stageId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'users', variables.userId, 'plan'],
      })
    },
  })
}

export const useDeleteTaskFromMentee = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      taskId,
    }: {
      userId: number
      taskId: number
    }) => deleteTaskFromMentee(userId, taskId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'users', variables.userId, 'plan'],
      })
    },
  })
}

// Хуки для обратной связи

export const useUserFeedback = (userId: number) => {
  return useQuery({
    queryKey: ['admin', 'users', userId, 'feedback'],
    queryFn: () => getUserFeedback(userId),
    enabled: userId > 0,
  })
}

// Хуки для настроек опросов

export const useSurveySettings = () => {
  return useQuery({
    queryKey: ['admin', 'survey-settings'],
    queryFn: getSurveySettings,
  })
}

export const useUpdateSurveySettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
      enabled: boolean
      frequency: string
      day_of_week: string
    }) => updateSurveySettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin', 'survey-settings'],
      })
    },
  })
}
