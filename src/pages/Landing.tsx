import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TrainSearch from './TrainSearch'
import LiveStatus from './LiveStatus'

function Landing() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <TrainSearch />
        <LiveStatus />
      </main>
    </>
  )
}

export default Landing