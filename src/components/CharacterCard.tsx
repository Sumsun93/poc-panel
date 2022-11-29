/**
 * Package import
 */
import styled from 'styled-components'
import { Character } from '@/types/user'
import Button from '@/components/Button'
import { AiOutlineNotification } from 'react-icons/ai'
import { CiMedicalCross } from 'react-icons/ci'
import { GiHandcuffs, GiHighKick } from 'react-icons/gi'
import { TbHammer } from 'react-icons/tb'

/**
 * Local import
 */

/**
 * Component
 */
const CharacterCard = ({ character }: { character: Character }) => {
  const {
    id,
    teamspeak,
    online,
    firstname,
    lastname,
    position,
    rotation,
    hunger,
    thirst,
    health,
    dimension,
    // inventory_id,
  } = character

  return (
    <Container>
      <Snapshot />
      <Name>
        {firstname}
        {' '}
        {lastname}
      </Name>
      <Infos>
        <Info>
          ID:
          {' '}
          <span>
            {id}
          </span>
        </Info>
        <Info>
          Teamspeak:
          {' '}
          <span>
            {teamspeak}
          </span>
        </Info>
        <Info>
          Position:
          {' '}
          <span>
            {position.x}
            ,
            {' '}
            {position.y}
            ,
            {' '}
            {position.z}
          </span>
        </Info>
        <Info>
          Rotation:
          {' '}
          <span>
            {rotation}
          </span>
        </Info>
        <Info>
          Dimension:
          {' '}
          <span>
            {dimension}
          </span>
        </Info>
        <Info>
          Hunger:
          {' '}
          <span>
            {hunger}
          </span>
        </Info>
        <Info>
          Thirst:
          {' '}
          <span>
            {thirst}
          </span>
        </Info>
        <Info>
          Health:
          {' '}
          <span>
            {health}
          </span>
        </Info>
        <Info>
          Online:
          {' '}
          <span>
            {online ? 'Oui' : 'Non'}
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
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
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
`

const Name = styled.h2`
  margin: 0;
`

const Infos = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`

const Info = styled.p`
  margin: .2rem 0;

  span {
    font-weight: bold;
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
