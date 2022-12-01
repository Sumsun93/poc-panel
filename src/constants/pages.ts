import Dashboard from '@/pages/Dashboard'
import Members from '@/pages/Members'
import Whitelist from '@/pages/Whitelist'
import User from '@/pages/User'
import Map from '@/pages/Map'

const pages = [
  {
    items: [
      {
        route: '/',
        label: 'Tableau de bord',
        icon: 'pi pi-fw pi-home',
        Component: Dashboard,
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        route: '/members',
        label: 'Gestion des membres',
        icon: 'pi pi-fw pi-users',
        right: 'memberlist',
        Component: Members,
      },
      {
        route: '/whitelist',
        label: 'Gestion de la whitelist',
        icon: 'pi pi-fw pi-shield',
        right: 'dowhitelist',
        Component: Whitelist,
      },
      {
        route: '/maps',
        label: 'Carte',
        icon: 'pi pi-fw pi-map',
        right: 'globalmap',
        Component: Map,
      },
    ],
  },
  {
    hide: true,
    items: [
      {
        route: '/user/:userId',
        label: 'Fiche utilisateur',
        right: 'memberlist',
        Component: User,
      },
    ],
  },
]

export default pages
