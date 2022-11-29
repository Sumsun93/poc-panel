/**
 * Package import
 */
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup'
import styled from 'styled-components'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

/**
 * Local import
 */
import {
  Member,
  useGetCommunityQuery,
  useGetLastMembersQuery,
  useLazyDeleteMemberQuery,
  useLazyFindMemberQuery,
} from '@/services/community'
import StatCard from '@/components/StatCard'
import Loading from '@/components/Loading'
import Button from '@/components/Button'
import { showToast } from '@/features/utilsSlice'

/**
 * Component
 */
let timeOutSearch: NodeJS.Timeout | null = null
const Members = () => {
  const {
    data: community, isLoading: communityLoading, refetch: refetchCommunity,
  } = useGetCommunityQuery('')
  const { data: lastMembers, isLoading: lastMembersLoading, refetch: refecthLastMembers } = useGetLastMembersQuery('')
  const [triggerGetMember, resultGetMember] = useLazyFindMemberQuery()
  const [triggerDeleteMember, resultDeleteMember] = useLazyDeleteMemberQuery()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [searchMembersList, setSearchMembersList] = useState([])
  const [memberSearch, setMemberSearch] = useState('')

  const formatMember = (comments: string[]) => (member: any, index: number) => ({
    id: member[0],
    socialclub: member[1],
    dateRegister: member[2],
    status: member[3],
    comment: comments[index],
  })

  const members: any = useMemo(() => !lastMembersLoading
    ? lastMembers.list.map(formatMember(lastMembers.comments))
    : [], [lastMembers?.comments, lastMembers?.list, lastMembersLoading])

  useEffect(() => {
    if (!memberSearch.length) {
      refetchCommunity()
      refecthLastMembers()
    }
  }, [refecthLastMembers, refetchCommunity, memberSearch])

  useEffect(() => {
    if (resultDeleteMember.isUninitialized) return

    if (!resultDeleteMember.isLoading) {
      if (resultDeleteMember.isSuccess && resultDeleteMember.data.success) {
        dispatch(showToast({ severity: 'success', summary: 'Succès', detail: 'L\'utilisateur a bien été supprimé.' }))
        refecthLastMembers()
        refetchCommunity()
      } else {
        dispatch(showToast({ severity: 'error', summary: 'Erreur', detail: 'Impossible de supprimer cet utilisateur.' }))
      }
    }
  }, [dispatch, refecthLastMembers, refetchCommunity, resultDeleteMember])

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMemberSearch(value)

    if (timeOutSearch) {
      clearTimeout(timeOutSearch)
    }

    timeOutSearch = setTimeout(() => {
      if (value.length) {
        triggerGetMember(value)
      }
    }, 1000)
  }

  useEffect(() => setSearchMembersList(resultGetMember.data?.list.map(formatMember(resultGetMember.data?.comments)) || []), [resultGetMember.data])

  const handleWantDelete = (memberData: Member) => (evt: React.MouseEvent<HTMLElement>) => {
    const { socialclub, id } = memberData

    const confirm = confirmPopup({
      target: evt.currentTarget,
      message: `Voulez vous vraiment supprimer l'utilisateur ${socialclub} ?`,
      icon: 'pi pi-exclamation-triangle',
      rejectIcon: 'pi pi-times',
      acceptIcon: 'pi pi-check',
      acceptLabel: 'Oui (IRRÉVERSIBLE FAIS PAS LE CON)',
      acceptClassName: 'p-button-danger',
      rejectClassName: 'p-button-secondary p-button-outlined',
      accept: () => {
        triggerDeleteMember(id)
      },
    })

    confirm.show()
  }

  const handleGoToMember = (memberData: Member) => () => {
    navigate(`/user/${memberData.id}`)
  }

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleGoToMember(rowData)} aloneContent style={{ width: 'fit-content', margin: '0 .2rem' }}>
          <i style={{ fontSize: '1rem' }} className='pi pi-user' />
        </Button>
        <Button gradient='linear-gradient(195deg,rgb(233, 86, 86),rgb(202, 44, 44))' onClick={handleWantDelete(rowData)} aloneContent style={{ width: 'fit-content', margin: '0 .2rem' }}>
          <i style={{ fontSize: '1rem' }} className='pi pi-trash' />
        </Button>
      </div>
    )
  }

  /*
    * Render{community?.numberSuscribe && <StatCard title='Membres inscrits' value={community?.numberSuscribe} iconBg='linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))' icon='pi pi-users' />}
              {community?.numberAdastra && <StatCard title='Membres Adastra' value={community?.numberAdastra} iconBg='linear-gradient(195deg,rgb(152 78 189),rgb(136 0 155))' icon='pi pi-apple' />}
              {community?.numberNotValid && <StatCard title='Nouveaux comptes' value={community?.numberNotValid} iconBg='linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))' icon='pi pi-user-plus' />}
              {community?.numberCandidat && <StatCard title='Candidats en attente' value={community?.numberCandidat} iconBg='linear-gradient(195deg,rgb(255 189 103),rgb(205 137 3))' icon='pi pi-user' />}
              {community?.numberWhitelist && <StatCard title='Candidats validés' value={community?.numberWhitelist} icon='pi pi-shield' />}
              {community?.numberRefus && <StatCard title='Candidats refusés' value={community?.numberRefus} iconBg='linear-gradient(195deg,rgb(215 122 122),rgb(211 15 15))' icon='pi pi-times-circle' />}
   */

  return (
    <Container>
      <h1>Gestion des membres</h1>

      {(communityLoading || lastMembersLoading)
        ? <Loading />
        : (
          <>
            <Community>
              {community?.numberSuscribe && <StatCard title='Membres inscrits' value={community?.numberSuscribe} iconBg='linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))' icon='pi pi-users' />}
              {community?.numberAdastra && <StatCard title='Membres Adastra' value={community?.numberAdastra} iconBg='linear-gradient(195deg,rgb(152 78 189),rgb(136 0 155))' icon='pi pi-apple' />}
              {community?.numberNotValid && <StatCard title='Nouveaux comptes' value={community?.numberNotValid} iconBg='linear-gradient(195deg, rgb(73, 163, 241), rgb(26, 115, 232))' icon='pi pi-user-plus' />}
              {community?.numberCandidat && <StatCard title='Candidats en attente' value={community?.numberCandidat} iconBg='linear-gradient(195deg,rgb(255 189 103),rgb(255 193 21))' icon='pi pi-user' />}
              {community?.numberWhitelist && <StatCard title='Candidats validés' value={community?.numberWhitelist} icon='pi pi-shield' />}
              {community?.numberRefus && <StatCard title='Candidats refusés' value={community?.numberRefus} iconBg='linear-gradient(195deg,rgb(233, 86, 86),rgb(202, 44, 44))' icon='pi pi-times-circle' />}
            </Community>

            <MembersList>
              <CustimInput placeholder='Rechercher un membre' onChange={handleChangeSearch} value={memberSearch} />

              <DataTable size='small' style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: 'rgb(0 0 0 / 10%) 0 0.25rem 0.375rem -0.0625rem, rgb(0 0 0 / 6%) 0 0.125rem 0.25rem -0.0625rem' }} value={memberSearch.length ? searchMembersList : members} paginator rows={10} rowsPerPageOptions={[10, 20, 50]}>
                <Column field='id' header='ID' />
                <Column field='socialclub' header='Socialclub' />
                <Column field='dateRegister' header="Date d'inscription" body={(rowData) => new Date(rowData.dateRegister).toLocaleString()} />
                <Column field='status' header='Status' />
                <Column field='comment' header='Dernier commentaire' />
                <Column body={actionBodyTemplate} />
              </DataTable>
            </MembersList>
          </>
          )}
      <ConfirmPopup />
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

  h1 {
    margin-bottom: 2rem;
  }
`

const Community = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
  max-width: 864px;
`

const CustimInput = styled(InputText)`
  margin-bottom: 1rem;
`

const MembersList = styled.div`
  width: 100%;
  margin-top: 1rem;
`

export default Members
