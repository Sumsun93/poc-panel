/**
 * Package import
 */
import { useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

/**
 * Local import
 */
import { useGetLogsCharacterMutation } from '@/services/live'
import Loading from '@/components/Loading'
import LeaftletMap from '@/components/LeaftletMap'
import L from 'leaflet'

/**
 * Component
 */
const Session = () => {
  const params = useParams()

  const [
    getLogsCharacter,
    resultGetLogsCharacter,
  ] = useGetLogsCharacterMutation()

  const [markerSelected, setMarkerSelected] = useState<number | null>(null)

  useEffect(() => {
    getLogsCharacter({
      id: parseInt(params.id as string),
      startTime: parseInt(params.startTime as string),
      endTime: parseInt(params.endTime as string),
    })
  }, [params.id, params.startTime, params.endTime, getLogsCharacter])

  const actionsReverse = useMemo(() => [...(resultGetLogsCharacter.data || [])].reverse(), [resultGetLogsCharacter?.data])

  const actions = useMemo(() => actionsReverse.map((action: any, index: number) => {
    const pos = action.pos.split(',')
    return {
      position: new L.LatLng(pos[0], pos[1]),
      selected: markerSelected === index,
      label: action.action,
      key: action.time,
    }
  }), [actionsReverse, markerSelected])

  if (resultGetLogsCharacter.isLoading && !resultGetLogsCharacter.data) {
    return (
      <Container>
        <Loading />
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <h1>Session du {new Date(parseInt(params.startTime as string)).toLocaleString()}</h1>
      </Header>
      <Content>
        <ActionsList>
          {actionsReverse.map((action: any, index: number) => (
            <Action
              key={action.time}
              onClick={() => setMarkerSelected(index)}
              selected={markerSelected === index}
            >
              <ActionTime>{new Date(action.time).toLocaleTimeString()}</ActionTime>
              <ActionContent>{action.action}</ActionContent>
            </Action>
          ))}
        </ActionsList>
        <MapContainer>
          <LeaftletMap
            layer='satellite'
            markers={actions}
            markerZoomIndex={markerSelected}
          />
        </MapContainer>
      </Content>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  flex-basis: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1rem;
`

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 5rem;
  margin-bottom: 1rem;

  h1 {
    margin-right: 1rem;
  }
`

const Content = styled.div`
  width: 100%;
  height: calc(100% - 5rem);
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`

const ActionsList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow-y: auto;
  width: 30%;
  height: 100%;
`

const Action = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 0.5rem;
  margin-right: 1rem;
  cursor: pointer;
  background-color: #fff;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  padding: 1rem;
  ${({ selected }: { selected: boolean }) => selected && `
    box-shadow: rgb(0 0 0 / 10%) 0 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0 0.125rem 0.25rem -0.0625rem;
    border: 1px solid #FFC115;
  `})
`

const ActionTime = styled.div`
  font-weight: bold;
  margin-right: 0.5rem;
`

const ActionContent = styled.div`
  font-weight: normal;
`

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: .75rem;
  overflow: hidden;
  box-shadow: rgb(0 0 0 / 10%) 0 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0 0.125rem 0.25rem -0.0625rem;
`

export default Session
