/**
 * Package import
 */
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import Lottie from 'react-lottie'
import styled, { keyframes } from 'styled-components'
import { Character } from '@/types/user'
import Button from '@/components/Button'
import { AiOutlineNotification } from 'react-icons/ai'
import { GiHandcuffs, GiHighKick, GiWaterDrop } from 'react-icons/gi'
import { TbHammer } from 'react-icons/tb'
import { FaHandHoldingMedical, FaHeartbeat } from 'react-icons/fa'
import { IoRestaurant } from 'react-icons/io5'
import { OverlayPanel } from 'primereact/overlaypanel'
import { InputTextarea } from 'primereact/inputtextarea'
import { useDispatch } from 'react-redux'

/**
 * Local import
 */
import noSignal from '@/assets/animations/nosignal.json'
import LeaftletMap from '@/components/LeaftletMap'
import {
  useCuffCharacterMutation,
  useReviveCharacterMutation,
  useNotifyCharacterMutation,
  useKickCharacterMutation,
  useBanCharacterMutation,
} from '@/services/live'
import { showToast } from '@/features/utilsSlice'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup'

/**
 * Component
 */
const CharacterCard = ({ character }: { character: Character }) => {
  const dispatch = useDispatch()

  const [triggerCuffCharacter, resultCuffCharacter] = useCuffCharacterMutation()
  const [triggerReviveCharacter, resultReviveCharacter] = useReviveCharacterMutation()
  const [triggerNotifyCharacter, resultNotifyCharacter] = useNotifyCharacterMutation()
  const [triggerKickCharacter, resultKickCharacter] = useKickCharacterMutation()
  const [triggerBanCharacter, resultBanCharacter] = useBanCharacterMutation()

  const [notifyMessage, setNotifyMessage] = useState('')
  const [kickMessage, setKickMessage] = useState('')

  const notifyRef = useRef(null)
  const kickRef = useRef(null)

  useEffect(() => {
    if (resultCuffCharacter.data) {
      if (resultCuffCharacter.data.success) {
        dispatch(
          showToast({
            severity: 'success',
            summary: 'Succès',
            detail: 'Le joueur a bien été menotté/démenotter.',
            life: 3000,
          }),
        )
      } else {
        dispatch(
          showToast({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue.',
            life: 3000,
          }),
        )
      }
    }
  }, [dispatch, resultCuffCharacter.data])

  useEffect(() => {
    if (resultReviveCharacter.data) {
      if (resultReviveCharacter.data.success) {
        dispatch(
          showToast({
            severity: 'success',
            summary: 'Succès',
            detail: 'Le joueur a bien été réanimé.',
            life: 3000,
          }),
        )
      } else {
        dispatch(
          showToast({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue.',
            life: 3000,
          }),
        )
      }
    }
  }, [dispatch, resultReviveCharacter.data])

  useEffect(() => {
    if (resultNotifyCharacter.data) {
      if (resultNotifyCharacter.data.success) {
        dispatch(
          showToast({
            severity: 'success',
            summary: 'Succès',
            detail: 'Le joueur a bien été notifié.',
            life: 3000,
          }),
        )
      } else {
        dispatch(
          showToast({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue.',
            life: 3000,
          }),
        )
      }
    }
  }, [dispatch, resultNotifyCharacter.data])

  useEffect(() => {
    if (resultKickCharacter.data) {
      if (resultKickCharacter.data.success) {
        dispatch(
          showToast({
            severity: 'success',
            summary: 'Succès',
            detail: 'Le joueur a bien été kick.',
            life: 3000,
          }),
        )
      } else {
        dispatch(
          showToast({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue.',
            life: 3000,
          }),
        )
      }
    }
  }, [dispatch, resultKickCharacter.data])

  useEffect(() => {
    if (resultBanCharacter.data) {
      if (resultBanCharacter.data.success) {
        dispatch(
          showToast({
            severity: 'success',
            summary: 'Succès',
            detail: 'Le joueur a bien été ban.',
            life: 3000,
          }),
        )
      } else {
        dispatch(
          showToast({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Une erreur est survenue.',
            life: 3000,
          }),
        )
      }
    }
  }, [dispatch, resultBanCharacter.data])

  const {
    id,
    teamspeak,
    online,
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

  const handleNotifyOpen = (event: React.MouseEvent<HTMLElement>) => {
    // @ts-ignore
    notifyRef.current?.toggle(event)
  }

  const handleKickOpen = (event: React.MouseEvent<HTMLElement>) => {
    // @ts-ignore
    kickRef.current?.toggle(event)
  }

  const handleBanOpen = (event: React.MouseEvent<HTMLElement>) => {
    const confirm = confirmPopup({
      target: event.currentTarget,
      message: `Êtes-vous sûr de vouloir bannir ${firstname} ${lastname} ?`,
      icon: 'pi pi-exclamation-triangle',
      rejectIcon: 'pi pi-times',
      acceptIcon: 'pi pi-check',
      acceptLabel: 'Oui (IRRÉVERSIBLE FAIS PAS LE CON)',
      rejectLabel: 'Non',
      acceptClassName: 'p-button-danger',
      rejectClassName: 'p-button-secondary p-button-outlined',
      accept: () => {
        triggerBanCharacter(id)
      },
    })

    confirm.show()
  }

  return (
    <Container>
      <Snapshot online={online} />
      <OnlineStatusText online={online}>
        {online ? 'En ligne' : 'Hors ligne'}
      </OnlineStatusText>
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
        <Button style={{ fontSize: '2rem', width: 'fit-content', margin: '.5rem' }} tooltip='Menotter' onClick={() => triggerCuffCharacter(id)} gradient='linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))'>
          <GiHandcuffs />
        </Button>
        <Button style={{ fontSize: '2rem', width: 'fit-content', margin: '.5rem' }} tooltip='Réanimer' onClick={() => triggerReviveCharacter(id)}>
          <FaHandHoldingMedical />
        </Button>
        <Button style={{ fontSize: '2rem', width: 'fit-content', margin: '.5rem' }} tooltip='Notifier' onClick={handleNotifyOpen} gradient='linear-gradient(195deg,rgb(178, 120, 212),rgb(146, 92, 177))'>
          <AiOutlineNotification />
        </Button>
        <Button style={{ fontSize: '2rem', width: 'fit-content', margin: '.5rem' }} tooltip='Kick' onClick={handleKickOpen} gradient='linear-gradient(195deg,rgb(255, 189, 103),rgb(255, 193, 21))'>
          <GiHighKick />
        </Button>
        <Button style={{ fontSize: '2rem', width: 'fit-content', margin: '.5rem' }} tooltip='Ban' onClick={handleBanOpen} gradient='linear-gradient(195deg,rgb(233, 86, 86),rgb(202, 44, 44))'>
          <TbHammer />
        </Button>
      </Actions>

      <OverlayPanel ref={notifyRef}>
        <PanelContent>
          <InputTextarea placeholder='Écrivez un message...' rows={5} cols={30} autoResize style={{ marginBottom: '1rem', width: '100%' }} value={notifyMessage} onChange={(event) => setNotifyMessage(event.target.value)} />
          <Button
            style={{ width: 'fit-content' }} onClick={() => {
              triggerNotifyCharacter({ characterId: id, message: notifyMessage })
              setNotifyMessage('')
              // @ts-ignore
              notifyRef.current?.hide()
            }}
          >
            <>
              Envoyer
            </>
          </Button>
        </PanelContent>
      </OverlayPanel>

      <OverlayPanel ref={kickRef}>
        <PanelContent>
          <InputTextarea placeholder='Écrivez une raison...' rows={5} cols={30} autoResize style={{ marginBottom: '1rem', width: '100%' }} value={kickMessage} onChange={(event) => setKickMessage(event.target.value)} />
          <Button
            style={{ width: 'fit-content' }} onClick={() => {
              setKickMessage('')
              triggerKickCharacter({ characterId: id, reason: kickMessage })
              // @ts-ignore
              kickRef.current?.hide()
            }}
          >
            <>
              Kicker
            </>
          </Button>
        </PanelContent>
      </OverlayPanel>

      <ConfirmPopup />
    </Container>
  )
}

const onlineBubblePulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(67, 160, 71, 1);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(67, 160, 71, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(67, 160, 71, 0);
  }
`

const Container = styled.div`
  position: relative;
  background-color: #fff;
  border-radius: .75rem;
  box-shadow: rgb(0 0 0 / 10%) 0 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0 0.125rem 0.25rem -0.0625rem;
  padding: calc(128px - 32px + 1rem) 1rem 1rem 1rem;
  margin: 42px 10px 10px 10px;
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

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: .75rem;
    background-color: transparent;
    animation: ${({ online }: { online: boolean }) => online ? onlineBubblePulse : 'none'} 2s infinite;
    ${({ online }: { online: boolean }) => !online && 'box-shadow: 0 0 10px rgba(202, 44, 44, 0.5);'}
  }
`

const OnlineStatusText = styled.span`
  position: absolute;
  top: calc(128px - 32px - 1rem);
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ online }: { online: boolean }) => online ? 'rgb(67,160,71)' : 'rgb(202,44,44)'};
  font-size: .7rem;
  font-weight: 700;
  ${({ online }: { online: boolean }) => online && 'text-shadow: 0 0 10px rgb(67,160,71);'}
  margin: 0 0 1rem 0;
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

const PanelContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default CharacterCard
