/**
 * Package import
 */
import L from 'leaflet'
import Lottie from 'react-lottie'
import styled from 'styled-components'
import { Character } from '@/types/user'
import Button from '@/components/Button'
import { AiOutlineNotification } from 'react-icons/ai'
import { CiMedicalCross } from 'react-icons/ci'
import { GiHandcuffs, GiHighKick, GiWaterDrop } from 'react-icons/gi'
import { TbHammer } from 'react-icons/tb'
import { FaHeartbeat } from 'react-icons/fa'
import { IoRestaurant } from 'react-icons/io5'
import noSignal from '@/assets/animations/nosignal.json'

/**
 * Local import
 */
import LeaftletMap from '@/components/LeaftletMap'

/**
 * Component
 */
const CharacterCard = ({ character }: { character: Character }) => {
  const {
    id,
    teamspeak,
    // online,
    firstname,
    lastname,
    position,
    // rotation,
    hunger,
    thirst,
    health,
    dimension,
    // inventory_id,
  } = character

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: noSignal,
  }

  return (
    <Container>
      <Snapshot />
      <Name>
        {firstname}
        {' '}
        {lastname}
        {' '}
        ({id})
      </Name>
      <Infos>
        {teamspeak && (
          <Info>
            Teamspeak:
            {' '}
            <span>
              {teamspeak}
            </span>
          </Info>
        )}
        <MapContainer>
          <LeaftletMap
            layer='satellite'
            markers={[{
              key: id.toString(),
              position: new L.LatLng(position.x, position.y),
            }]}
            positionValue={{ lat: position.x, lng: position.y }}
            zoomValue={4}
          />
          {dimension !== 0 && (
            <NoSignal>
              <Lottie
                options={defaultOptions}
              />
            </NoSignal>
          )}
        </MapContainer>
        <Info>
          <FaHeartbeat />
          <span>
            {health / 200 * 100}%
          </span>
        </Info>
        <Info>
          <IoRestaurant />
          <span>
            {hunger}%
          </span>
        </Info>
        <Info>
          <GiWaterDrop />
          <span>
            {thirst}%
          </span>
        </Info>
      </Infos>
      <Actions>
        <Button style={{ fontSize: '2rem', width: 'fit-content', margin: '.5rem' }} tooltip='Menotter' onClick={() => {}} gradient='linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))'>
          <GiHandcuffs />
        </Button>
        <Button style={{ fontSize: '2rem', width: 'fit-content', margin: '.5rem' }} tooltip='Réanimer' onClick={() => {}}>
          <CiMedicalCross />
        </Button>
        <Button style={{ fontSize: '2rem', width: 'fit-content', margin: '.5rem' }} tooltip='Notifier' onClick={() => {}} gradient='linear-gradient(195deg,rgb(178, 120, 212),rgb(146, 92, 177))'>
          <AiOutlineNotification />
        </Button>
        <Button style={{ fontSize: '2rem', width: 'fit-content', margin: '.5rem' }} tooltip='Kick' onClick={() => {}} gradient='linear-gradient(195deg,rgb(255, 189, 103),rgb(255, 193, 21))'>
          <GiHighKick />
        </Button>
        <Button style={{ fontSize: '2rem', width: 'fit-content', margin: '.5rem' }} tooltip='Ban' onClick={() => {}} gradient='linear-gradient(195deg,rgb(233, 86, 86),rgb(202, 44, 44))'>
          <TbHammer />
        </Button>
      </Actions>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  background-color: #fff;
  border-radius: .75rem;
  box-shadow: rgb(0 0 0 / 10%) 0 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0 0.125rem 0.25rem -0.0625rem;
  padding: calc(128px - 32px + 1rem) 1rem 1rem 1rem;
  margin: 32px 10px 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 365px;
`

const Snapshot = styled.div`
  position: absolute;
  top: -32px;
  border-radius: .75rem;
  background-color: grey;
  width: 128px;
  height: 128px;
  box-shadow: rgb(0 0 0 / 10%) 0 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0 0.125rem 0.25rem -0.0625rem;
`

const Name = styled.h2`
  margin: 0;
`

const Infos = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
`

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 333px;
  margin: 1rem 0;
  border-radius: .75rem;
  overflow: hidden;
  box-shadow: rgb(0 0 0 / 10%) 0 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0 0.125rem 0.25rem -0.0625rem;
`

const NoSignal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  opacity: 0.5;
  z-index: 1000;
  pointer-events: none;
`

const Info = styled.p`
  font-size: 1.25rem;
  margin: .2rem .5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    margin-left: .2rem;
  }
`

const Actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`

export default CharacterCard
