/**
 * Package import
 */

/**
 * Local import
 */
import LeaftletMap from '@/components/LeaftletMap'

/**
 * Component
 */
const Map = () => {
  return (
    <div>
      <h1>Map</h1>
      <div style={{ width: '500px', height: '500px' }}>
        <LeaftletMap layer='satellite' />
      </div>
    </div>
  )
}

export default Map
