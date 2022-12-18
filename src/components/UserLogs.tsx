/**
 * Package import
 */
import { useEffect, useState } from 'react'
import { Dialog, TabPanel, TabView } from 'primereact'

/**
 * Local import
 */
import { useGetLogsMutation, useGetSessionsMutation } from '@/services/live'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { useGetMemberCharactersByIdQuery } from '@/services/community'
import Button from '@/components/Button'
import { useNavigate } from 'react-router-dom'

/**
 * Component
 */
const UserLogs = ({ id, titleName, isVisible, onHide }: {
  id: number
  titleName: string
  isVisible: boolean
  onHide: () => void
}) => {
  const navigate = useNavigate()

  const [activeIndex, setActiveIndex] = useState(0)

  const { data: characters } = useGetMemberCharactersByIdQuery(id)
  const [triggerLogs, resultLogs] = useGetLogsMutation()
  const [triggerSessions, resultSessions] = useGetSessionsMutation()

  useEffect(() => {
    if (isVisible && activeIndex === 0) {
      triggerLogs(id)
    } else if (isVisible && activeIndex === 1) {
      triggerSessions(id)
    }
  }, [activeIndex, id, isVisible, triggerLogs, triggerSessions])

  const timeTemplate = (rowData: any) => {
    return new Date(rowData.time).toLocaleString()
  }

  return (
    <Dialog header={`Logs de ${titleName}`} visible={isVisible} onHide={onHide} dismissableMask resizable blockScroll={false} style={{ minWidth: '775px', width: '775px' }}>
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header='Logs'>
          <DataTable size='small' style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: 'rgb(0 0 0 / 10%) 0 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0 0.125rem 0.25rem -0.0625rem' }} value={resultLogs.data} paginator rows={50}>
            <Column field='action' header='Action' />
            <Column field='pos' header='Position' />
            <Column header='Date' body={timeTemplate} />
          </DataTable>
        </TabPanel>
        <TabPanel header='Sessions'>
          <DataTable size='small' style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: 'rgb(0 0 0 / 10%) 0 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0 0.125rem 0.25rem -0.0625rem' }} value={resultSessions.data} paginator rows={50}>
            <Column
              field='name'
              header='Personnage'
              body={(rowData: any) => {
                const character = characters?.list?.find((c: any) => c.id === rowData.id)
                return `${character?.firstname} ${character?.lastname}`
              }}
            />
            <Column
              field='startTime'
              header='Début'
              body={(rowData: any) => {
                return new Date(rowData.startTime).toLocaleString()
              }}
            />
            <Column
              field='endTime'
              header='Fin'
              body={(rowData: any) => {
                return new Date(rowData.endTime).toLocaleString()
              }}
            />
            <Column
              header='Durée'
              body={(rowData: any) => {
                const duration = new Date(rowData.endTime).getTime() - new Date(rowData.startTime).getTime()
                const hours = Math.floor(duration / (1000 * 60 * 60))
                const minutes = Math.floor((duration / (1000 * 60)) % 60)
                const seconds = Math.floor((duration / 1000) % 60)
                return `${hours}h ${minutes}m ${seconds}s`
              }}
            />
            <Column
              header='Consulter'
              body={(rowData: any) => {
                return (
                  <Button
                    onClick={() => {
                      navigate(`/session/${rowData.id}/${rowData.startTime}/${rowData.endTime}`)
                    }}
                    style={{ width: 'fit-content' }}
                    aloneContent
                  >
                    <i style={{ fontSize: '1rem' }} className='pi pi-eye' />
                  </Button>
                )
              }}
            />
          </DataTable>
        </TabPanel>
      </TabView>
    </Dialog>
  )
}

export default UserLogs
