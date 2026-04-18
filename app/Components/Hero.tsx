import { Button } from '@/components/ui/button';
import Spline from '@splinetool/react-spline/next';

const Hero = () => {
  return (
    <div className='h-screen'>
      <Spline
        scene="https://prod.spline.design/SPTzpTCWXqcDDGF0/scene.splinecode"
      />
      <div className='absolute h-screen w-full flex z-10 top-0'>
        <div className="flex flex-col w-full h-screen justify-center items-center ">
          <h1 className="text-6xl md:text-7xl font-semibold leading-tight tracking-tight text-white ">
            Watch {" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Together  </span>
          </h1> 
          
          <h1 className="text-6xl md:text-7xl font-semibold leading-tight tracking-tight text-white ">
            Feel {" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Together</span>
          </h1>
          <p className="text-md font-light text-slate-400 text-center p-4 tracking-wide">
            Sync your favorite films, series and songs with anyone, anywhere. <br />
High-fidelity streaming meet human connection.
          </p>
          <div className='flex gap-4'>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-all duration-500 cursor-pointer p-4 py-5">Start Watching</Button>
            <Button className='border-2 border-gray-500 hover:scale-105 transition-all duration-500 cursor-pointer p-4 py-5'>Join Room</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero