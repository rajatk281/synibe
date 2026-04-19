import { Button } from '@/components/ui/button';
import Spline from '@splinetool/react-spline/next';
import { MessageCircle, Shield, TvMinimalPlay } from 'lucide-react';

const Hero = () => {
  return (
    <div className='h-screen select-none'>
      {/* <Spline
        scene="https://prod.spline.design/SPTzpTCWXqcDDGF0/scene.splinecode"
      /> */}
      
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
          <p className="text-md font-light text-slate-200 text-center p-4 tracking-wide">
            Sync your favorite films, series and songs with anyone, anywhere. <br />
            High-fidelity streaming meet human connection.
          </p>

          <div className='flex gap-4 p-4'>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-all duration-500 cursor-pointer p-4 py-5">Start Watching</Button>
            <Button className='border-2 border-gray-500 hover:scale-105 transition-all duration-500 cursor-pointer p-4 py-5'>Join Room</Button>
          </div>

          <div className=' flex gap-8 text-sm font-light py-4'>
            <span className='flex gap-2 items-center text-slate-400 card px-2 py-1 rounded-md'> <TvMinimalPlay className='size-4' /> 4K Crystal Clarity</span>
            <span className='flex gap-2 items-center text-slate-400 card px-2 py-1 rounded-md'> <Shield className='size-4' /> Private Syncing </span>
            <span className='flex gap-2 items-center text-slate-400 card px-2 py-1 rounded-md'> <MessageCircle className='size-4' /> Interactive Watching and listening</span>
          </div>

          <div className='text-sm text-slate-400 border border-slate-400 px-2 py-1 rounded-md card'>
           <span className='bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>Don't wanna signup ?</span>  sync Watching and listening instantly as guest
          </div>
          
        </div>
      </div>  
    </div>
  )
}

export default Hero