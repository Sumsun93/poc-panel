/**
 * Package import
 */
import { Route, Routes as ReactRoutes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

/**
 * Local import
 */
import Home from '@/pages/Home'
import { useEffect } from 'react'
import { disconnect, setConnected, setToken } from '@/features/authSlice'
import SideBar from '@/components/SideBar'
import styled from 'styled-components'
import { useGetProfilQuery, useGetRightsQuery } from '@/services/profil'
import { setRights, setUser } from '@/features/userSlice'
import pages from '@/constants/pages'
import Dashboard from '@/pages/Dashboard'
import Page from '@/components/Page'

/**
 * Component
 */
const Routes = () => {
  const dispatch = useDispatch()
  const { connected } = useSelector((state: any) => state.auth)
  const { rights } = useSelector((state: any) => state.user)
  const { data: profilResult, error, isLoading: profilLoading } = useGetProfilQuery('', { skip: !connected })
  const { data: rightsResult, isLoading: rightsLoading } = useGetRightsQuery('', { skip: !connected })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(setConnected(true))
      dispatch(setToken(token))
    }
  }, [dispatch])

  useEffect(() => {
    if (profilResult) {
      if (profilResult.error) {
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
    return <p>Loading...</p>
  }

  return (
    <Container>
      {connected && <SideBar />}
      <Content>
        <ReactRoutes>
          {connected
            ? (
              <>
                {/* concat all routes in categories */}
                {pages.reduce((acc: any, category) => [...acc, ...category.items], []).filter((item: any) => !item.right || rights[item.right]).map(({ Component, route, label }: any, index: number) => (
                  <Route key={index} path={route} element={<Page title={label} Component={Component} />} />
                ))}
                <Route path='*' element={<Dashboard />} />
              </>
              )
            : (
              <>
                <Route path='*' element={<Home />} />
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
