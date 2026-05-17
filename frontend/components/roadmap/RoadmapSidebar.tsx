import { Card, Progress, Typography } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { type Stage, statusConfig } from './types'

const { Title, Text } = Typography

interface RoadmapSidebarProps {
  name: string
  daysPassed: number
  totalDays: number
  stages: Stage[]
  onTaskToggle?: (taskId: number, stageStatus: 'done' | 'current' | 'locked') => void
}

const RoadmapSidebar = ({
  name,
  daysPassed,
  totalDays,
  stages,
  onTaskToggle,
}: RoadmapSidebarProps) => {
  const totalTasks = stages.reduce((acc, stage) => acc + stage.tasks.length, 0)
  const completedTasks = stages.reduce(
    (acc, stage) => acc + stage.tasks.filter((t) => t.done).length,
    0
  )
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const currentStage = stages.find((s) => s.status === 'current')

  return (
    <Card
      style={{ borderRadius: 12, height: '100%' }}
      bodyStyle={{ padding: '24px 16px' }}
    >
      <Title level={5} style={{ margin: '0 0 4px', fontSize: 17 }}>
        {name}
      </Title>
      <Text style={{ color: '#999', fontSize: 15 }}>
        День {daysPassed} из {totalDays}
      </Text>

      <div style={{ marginTop: 16, marginBottom: 12 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          <Text style={{ fontSize: 14, color: '#bbb' }}>Прогресс</Text>
          <Text style={{ fontSize: 14, fontWeight: 600, color: '#ff6720' }}>
            {percent}%
          </Text>
        </div>
        <Progress
          percent={percent}
          strokeColor="#ff6720"
          trailColor="#ffe8dc"
          showInfo={false}
        />
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: '#fff3ee',
          border: '1px solid #ffd0b5',
          borderRadius: 8,
          padding: '5px 12px',
          marginBottom: 32,
        }}
      >
        <ClockCircleOutlined style={{ color: '#ff6720', fontSize: 13 }} />
        <Text style={{ fontSize: 14, color: '#ff6720', fontWeight: 500 }}>
          {currentStage?.title}
        </Text>
      </div>

      <div style={{ paddingLeft: 24 }}>
        {stages.map((stage, stageIdx) => {
          const config = statusConfig[stage.status]
          const isLastStage = stageIdx === stages.length - 1
          const prevConfig =
            stageIdx > 0 ? statusConfig[stages[stageIdx - 1].status] : null

          return (
            <div key={stage.id} style={{ position: 'relative' }}>
              {stageIdx > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    left: -12,
                    top: -16,
                    height: 18,
                    width: 2,
                    background:
                      prevConfig?.color === '#52c41a' ? '#52c41a' : '#f0f0f0',
                    zIndex: 0,
                  }}
                />
              )}

              <div
                style={{
                  position: 'absolute',
                  left: -20,
                  top: 0,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: config.color,
                  boxShadow:
                    stage.status === 'current'
                      ? `0 0 0 4px ${config.bg}`
                      : 'none',
                  zIndex: 2,
                }}
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 18,
                  marginBottom: 14,
                }}
              >
                <Text
                  strong
                  style={{
                    fontSize: 15,
                    color: stage.status === 'locked' ? '#bbb' : '#1a1a1a',
                  }}
                >
                  {stage.title}
                </Text>
                <Text style={{ fontSize: 13, color: '#bbb' }}>
                  {stage.durationDays}д
                </Text>
              </div>

              <div style={{ marginBottom: isLastStage ? 0 : 20 }}>
                {stage.tasks.map((task, taskIdx) => {
                  const isLastTask = taskIdx === stage.tasks.length - 1
                  const lineColor = task.done
                    ? '#52c41a'
                    : stage.status === 'locked'
                      ? '#f0f0f0'
                      : '#ffe8dc'

                  return (
                    <div
                      key={task.id}
                      style={{
                        position: 'relative',
                        marginBottom: 12,
                        cursor: stage.status !== 'locked' ? 'pointer' : 'default',
                      }}
                      onClick={() =>
                        stage.status !== 'locked' &&
                        onTaskToggle?.(task.id, stage.status)
                      }
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: -12,
                          top: -16,
                          height: 18,
                          width: 2,
                          background: lineColor,
                          zIndex: 0,
                        }}
                      />

                      <div
                        style={{
                          position: 'absolute',
                          left: -16,
                          top: 4,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: task.done
                            ? '#52c41a'
                            : task.overdue
                              ? '#ff4d4f'
                              : stage.status === 'locked'
                                ? '#ddd'
                                : '#ff6720',
                          border: '2px solid #fff',
                          zIndex: 1,
                        }}
                      />

                      {!(isLastTask && isLastStage) && (
                        <div
                          style={{
                            position: 'absolute',
                            left: -12,
                            top: 14,
                            bottom: isLastTask ? -20 : -12,
                            width: 2,
                            background: lineColor,
                            zIndex: 0,
                          }}
                        />
                      )}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            color: task.done
                              ? '#bbb'
                              : stage.status === 'locked'
                                ? '#ccc'
                                : '#555',
                            textDecoration: task.done ? 'line-through' : 'none',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            flex: 1,
                          }}
                        >
                          {task.title}
                        </Text>
                        {task.overdue && (
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: '#ff4d4f',
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default RoadmapSidebar
