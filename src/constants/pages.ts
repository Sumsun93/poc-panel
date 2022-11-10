import Dashboard from '@/pages/Dashboard'
import Members from '@/pages/Members'
import Whitelist from '@/pages/Whitelist'

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
        Component: Dashboard,
      },
    ],
  },
]

export default pages
