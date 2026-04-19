
import Hero from './Components/Landing/Hero'
import Navbar from './Components/Navbar'
import StoryTelling from './Components/Landing/StoryTelling'
import AudioAnimation from './Components/Landing/AudioAnimation'

const page = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <StoryTelling/>
      <AudioAnimation/>
    </div>
  )
}

export default page