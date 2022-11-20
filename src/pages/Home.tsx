/**
 * Package import
 */
import { useState } from 'react'
import styled from 'styled-components'
import { Button } from 'primereact/button'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog } from 'primereact/dialog'
// @ts-ignore
import { Document, Page } from 'react-pdf/dist/esm/entry.vite'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

/**
 * Local import
 */
import logo from '@/assets/images/logo.png'
import Login from '@/components/Login'
import Register from '@/components/Register'
import { setIsRegistering } from '@/features/authSlice'
import cguPdf from '@/assets/utils/cgu.pdf'
import { Paginator } from 'primereact'

/**
 * Component
 */
const Home = () => {
  const dispatch = useDispatch()
  const { isRegistering } = useSelector((state: any) => state.auth)
  const [cguOpen, setCguOpen] = useState(false)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)

  const handleClick = () => {
    dispatch(setIsRegistering(!isRegistering))
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const dialogFooter = (
    <div>
      <Paginator first={pageNumber - 1} rows={1} totalRecords={numPages} onPageChange={(e) => setPageNumber(e.page + 1)} template='FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink' />
    </div>
  )

  return (
    <Container>
      <Content>
        <Logo src={logo} />
        {isRegistering
          ? (
            <Register />
            )
          : <Login />}
        <ButtonStyled className='p-button-outlined' onClick={handleClick}>{isRegistering ? 'Connexion' : 'Inscription'}</ButtonStyled>
        <CguText>
          En cliquant sur{' '}<span>{isRegistering ? 'S\'inscrire' : 'Se connecter'}</span>, vous acceptez nos
          {' '}
          <button onClick={() => setCguOpen(true)}>Conditions Générales d'Utilisation</button>
        </CguText>
      </Content>

      <Dialog visible={cguOpen} modal footer={dialogFooter} onHide={() => setCguOpen(false)} dismissableMask>
        <div style={{ width: '595px', height: '842px' }}>
          <Document file={cguPdf} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
        </div>
      </Dialog>
    </Container>
  )
}

/**
 * Styled Component
 */
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Content = styled.div`
  width: 400px;
  background: linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25));
  box-shadow: rgb(0 0 0 / 5%) 0 1.25rem 1.6875rem 0;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`

const Logo = styled.img`
  width: 256px;
`

const ButtonStyled = styled(Button)`
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  color: #FFC115 !important;

  &:hover {
    color: #fff !important;
    border: 1px solid #fff !important;
  }
`

const CguText = styled.p`
  width: 100%;
  padding: 0.5rem 2rem;
  font-size: 0.75rem;
  text-align: center;
  color: #fff;
  margin-top: 1rem;
  line-height: 1.2rem;

  button {
    color: #FFC115;
    cursor: pointer;
    background: none;
    border: none;
  }

  span {
    color: #FFC115;
  }
`

export default Home
