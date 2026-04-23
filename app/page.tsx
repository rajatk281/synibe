
import Hero from './Components/Landing/Hero'
import Navbar from './Components/Navbar'
import StoryTelling from './Components/Landing/StoryTelling'
import AudioAnimation from './Components/Landing/AudioAnimation'
import HowItWorks from './Components/Landing/HowItWorks'

const page = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <StoryTelling/>
      <AudioAnimation/>
      <HowItWorks/>
    </div>
  )
}

export default page