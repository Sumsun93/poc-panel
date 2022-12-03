/**
 * Package import
 */
import { useEffect } from 'react'
import { Dialog } from 'primereact'

/**
 * Local import
 */
import { useLazyGetLogsQuery } from '@/services/live'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

/**
 * Component
 */
const UserLogs = ({ id, titleName, isVisible, onHide }: {
  id: number
  titleName: string
  isVisible: boolean
  onHide: () => void
}) => {
  const [trigger, result] = useLazyGetLogsQuery()

  useEffect(() => {
    if (isVisible) {
      trigger(id)
    }
  }, [id, isVisible, trigger])

  const timeTemplate = (rowData: any) => {
    return new Date(rowData.time).toLocaleString()
  }

  return (
    <Dialog header={`Logs de ${titleName}`} visible={isVisible} onHide={onHide} dismissableMask resizable blockScroll={false} style={{ minWidth: '775px', width: '775px' }}>
      <DataTable size='small' style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: 'rgb(0 0 0 / 10%) 0 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0 0.125rem 0.25rem -0.0625rem' }} value={result.data} paginator rows={50}>
        <Column field='action' header='Action' />
        <Column field='pos' header='Position' />
        <Column header='Date' body={timeTemplate} />
      </DataTable>
    </Dialog>
  )
}

export default UserLogs
