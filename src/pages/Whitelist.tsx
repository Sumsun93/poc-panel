/**
 * Package import
 */
import styled from 'styled-components'

/**
 * Local import
 */

/**
 * Component
 */
const Whitelist = () => {
  return (
    <Container>
      <h1>Gestion des whitelist</h1>
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

export default Whitelist
