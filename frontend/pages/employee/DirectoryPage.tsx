import { useState, useMemo } from 'react'
import { Input, Typography, Row, Col, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { Employee } from '../../types/user'
import EmployeeCard from '../../components/directory/EmployeeCard'
import EmployeeModal from '../../components/directory/EmployeeModal'
import { useContacts } from '../../api/hooks/useContacts'

const { Text, Title } = Typography

const DirectoryPage = () => {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Employee | null>(null)
  const { data: allEmployees = [], isLoading } = useContacts()

  const filtered = useMemo(() => {
    if (!search.trim()) return allEmployees

    const lowerSearch = search.toLowerCase().trim()
    return allEmployees.filter(
      (e) =>
        e.full_name.toLowerCase().includes(lowerSearch) ||
        (e.department?.toLowerCase().includes(lowerSearch) ?? false) ||
        (e.position?.toLowerCase().includes(lowerSearch) ?? false) ||
        (e.responsibility_tags?.toLowerCase().includes(lowerSearch) ?? false)
    )
  }, [allEmployees, search])

  if (isLoading) {
    return <Spin />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Справочник сотрудников
          </Title>
          <Text style={{ color: '#999', fontSize: 15 }}>
            {filtered.length} сотрудников
          </Text>
        </div>
        <Input
          prefix={<SearchOutlined style={{ color: '#bbb' }} />}
          placeholder="Поиск по имени, отделу, должности..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300, borderRadius: 10 }}
          size="large"
        />
      </div>

      <Row gutter={[16, 16]}>
        {filtered.map((employee) => (
          <Col key={employee.id} span={6}>
            <EmployeeCard
              employee={employee}
              onClick={() => setSelected(employee)}
            />
          </Col>
        ))}
      </Row>

      <EmployeeModal employee={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

export default DirectoryPage
