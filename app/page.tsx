
import Hero from './Components/Landing/Hero'
import Navbar from './Components/Navbar'
import StoryTelling from './Components/Landing/StoryTelling'

const page = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <StoryTelling/>
    </div>
  )
}

export default page