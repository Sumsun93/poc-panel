/**
 * Package import
 */
import { Route, Routes as ReactRoutes, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

/**
 * Local import
 */
import { ReactElement, useEffect, useRef } from 'react'
import { disconnect, setConnected, setToken } from '@/features/authSlice'
import SideBar from '@/components/SideBar'
import styled from 'styled-components'
import { useGetProfilQuery, useGetRightsQuery } from '@/services/profil'
import { setRights, setUser } from '@/features/userSlice'
import pages from '@/constants/pages'
import Dashboard from '@/pages/Dashboard'
import Page from '@/components/Page'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import WantResetPassword from '@/pages/WantResetPassword'
import ResetPassword from '@/pages/ResetPassword'
import { Toast } from 'primereact/toast'
import { showToast } from '@/features/utilsSlice'
import Loading from '@/components/Loading'

/**
 * Component
 */
const ProtectedRoute = ({ routeRight, children }: { routeRight: string, children: ReactElement }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { rights } = useSelector((state: any) => state.user)

  useEffect(() => {
    if (routeRight && !rights?.[routeRight]) {
      dispatch(showToast({ severity: 'error', summary: 'Erreur', detail: 'Vous n\'avez pas les droits pour accéder à cette page.', life: 50000 }))
      navigate('/')
    }
  }, [dispatch, navigate, rights, routeRight])

  if (routeRight && !rights?.[routeRight]) {
    return null
  }

  return children
}

const Routes = () => {
  const dispatch = useDispatch()
  const { connected } = useSelector((state: any) => state.auth)
  const { rights, socialclubName } = useSelector((state: any) => state.user)
  const { toastValue } = useSelector((state: any) => state.utils)
  const { data: profilResult, error, isLoading: profilLoading } = useGetProfilQuery('', { skip: !connected })
  const { data: rightsResult, isLoading: rightsLoading } = useGetRightsQuery('', { skip: !connected })

  const toastRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      dispatch(setConnected(true))
      dispatch(setToken(token))
    }
  }, [dispatch])

  useEffect(() => {
    if (toastValue) {
      // @ts-ignore
      toastRef.current?.show(toastValue)
      dispatch(showToast(null))
    }
  }, [dispatch, toastValue])

  useEffect(() => {
    if (profilResult) {
      if (profilResult.error || (profilResult.success === false)) {
        dispatch(disconnect())
      } else {
        dispatch(setUser(profilResult))
      }
    }
  }, [profilResult, dispatch])

  useEffect(() => {
    if (rightsResult) {
      const rights = Object.keys(rightsResult).reduce((acc: any, key) => {
        acc[key] = !!rightsResult[key]
        return acc
      }
      , {})
      dispatch(setRights(rights))
    }
  }, [rightsResult, dispatch])

  useEffect(() => {
    if (error) {
      dispatch(disconnect())
    }
  }, [dispatch, error])

  if (profilLoading || rightsLoading) {
    return (
      <Container>
        <Content>
          <Loading />
        </Content>
      </Container>
    )
  }

  return (
    <Container>
      {(connected && rights && socialclubName) && <SideBar />}
      <Content>
        <Toast ref={toastRef} position='top-center' style={{ zIndex: 1000 }} />
        <ReactRoutes>
          {(connected && rights && socialclubName)
            ? (
              <>
                {/* concat all routes in categories */}
                {pages.reduce((acc: any, category) => [...acc, ...category.items], []).map(({ Component, route, label, right }: any, index: number) => (
                  <Route
                    key={index} path={route} element={
                      <ProtectedRoute routeRight={right}>
                        <Page title={label} Component={Component} />
                      </ProtectedRoute>
                    }
                  />
                ))}
                <Route path='*' element={<Dashboard />} />
              </>
              )
            : (
              <>
                <Route path='/register' element={<Register />} />
                <Route path='*' element={<Login />} />
                <Route path='/reset-password' element={<WantResetPassword />} />
                <Route path='/reset' element={<ResetPassword />} />
              </>
              )}
        </ReactRoutes>
      </Content>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
`

const Content = styled.div`
  width: 100%;
  height: calc(100vh - 1rem);
  overflow: auto;
  margin-bottom: 1rem;
  box-sizing: border-box;
`

export default Routes
