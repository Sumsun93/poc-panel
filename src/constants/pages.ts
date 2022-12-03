import Dashboard from '@/pages/Dashboard'
import Members from '@/pages/Members'
import Whitelist from '@/pages/Whitelist'
import User from '@/pages/User'
import Map from '@/pages/Map'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import WantResetPassword from '@/pages/WantResetPassword'
import ResetPassword from '@/pages/ResetPassword'

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
      {
        route: '/login',
        label: 'Connexion',
        Component: Login,
      },
      {
        route: '/register',
        label: 'Inscription',
        Component: Register,
      },
      {
        route: '/reset-password',
        label: 'Réinitialisation du mot de passe',
        Component: WantResetPassword,
      },
      {
        route: '/reset',
        label: 'Réinitialisation du mot de passe',
        Component: ResetPassword,
      },
    ],
  },
]

export default pages
