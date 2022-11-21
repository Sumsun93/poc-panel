/**
 * Package import
 */
import styled from 'styled-components'
import { useState } from 'react'
import cguPdf from '@/assets/utils/cgu.pdf'
import { Dialog } from 'primereact/dialog'
import { Paginator } from 'primereact'
// @ts-ignore
import { Document, Page } from 'react-pdf/dist/esm/entry.vite'

/**
 * Local import
 */

/**
 * Component
 */
const Cgu = ({ titleButton }: { titleButton: string }) => {
  const [cguOpen, setCguOpen] = useState(false)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  const dialogFooter = (
    <div>
      <Paginator first={pageNumber - 1} rows={1} totalRecords={numPages} onPageChange={(e) => setPageNumber(e.page + 1)} template='FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink' />
    </div>
  )

  return (
    <>
      <CguText>
        En cliquant sur{' '}<span>{titleButton}</span>, vous acceptez nos
        {' '}
        <button onClick={() => setCguOpen(true)}>Conditions Générales d'Utilisation</button>
      </CguText>
      <Dialog visible={cguOpen} modal footer={dialogFooter} onHide={() => setCguOpen(false)} dismissableMask>
        <div style={{ width: '595px', height: '842px' }}>
          <Document file={cguPdf} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
        </div>
      </Dialog>
    </>
  )
}

const CguText = styled.p`
  width: 100%;
  padding: 0.5rem 2rem;
  font-size: 0.75rem;
  text-align: center;
  color: #fff;
  margin: 0;
  line-height: 1.2rem;

  button {
    color: #FFC115;
    cursor: pointer;
    background: none;
    border: none;
    text-decoration: underline;
  }

  span {
    color: #FFC115;
  }
`

export default Cgu
