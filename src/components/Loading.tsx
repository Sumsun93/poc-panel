/**
 * Package import
 */
import Lottie from 'react-lottie'
import styled from 'styled-components'

/**
 * Local import
 */
import loading from '@/assets/animations/loading.json'

/**
 * Component
 */
const Loading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  return (
    <Container>
      <Lottie
        options={defaultOptions}
        height={300}
        width={300}
      />
      Chargement...
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default Loading
