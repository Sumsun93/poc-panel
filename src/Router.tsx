/**
 * Package import
 */
import { Provider } from 'react-redux'
import { CookieConsent } from 'react-cookie-consent'

/**
 * Local import
 */
import store from '@/store/store'
import Routes from '@/Routes'

/**
 * Component
 */
const Router = () => (
  <Provider store={store}>
    <CookieConsent
      location='bottom'
      buttonText='Accepter et Fermer'
      buttonClasses='p-component p-button p-button-success'
      style={{ alignItems: 'center', background: 'linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))' }}
      buttonStyle={{ lineHeight: '1rem', margin: '10px' }}
      disableButtonStyles
      cookieName='legalCookie'
      overlay
      expires={365}
    >
      Ce site utilise des cookies. En poursuivant votre navigation sur ce site, vous acceptez l'utilisation de cookies.
    </CookieConsent>
    <Routes />
  </Provider>
)

export default Router
