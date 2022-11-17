/**
 * Package import
 */
import styled from 'styled-components'
import { Link } from 'react-router-dom'

/**
 * Local import
 */

/**
 * Component
 */
const CharacterCard = ({ character }: any) => {
  const { firstname, lastname, id } = character

  return (
    <Container>
      <Link to={`/characters/${id}`}>
        <h1>
          {firstname}
          {' '}
          {lastname}
        </h1>
      </Link>
    </Container>
  )
}

const Container = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
  padding: 10px;
  margin: 10px;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default CharacterCard
