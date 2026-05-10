
import Hero from './Components/Landing/Hero'
import Navbar from './Components/Navbar'
import PhoneShowcase from './Components/Landing/PhoneShowcase'
import StoryTelling from './Components/Landing/StoryTelling'
import AudioAnimation from './Components/Landing/AudioAnimation'
import HowItWorks from './Components/Landing/HowItWorks'
import FAQ from './Components/Landing/FAQ'

const page = () => {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <PhoneShowcase/>
      <StoryTelling/>
      <AudioAnimation/>
      <HowItWorks/>
      <FAQ/>
    </div>
  )
}

export default page