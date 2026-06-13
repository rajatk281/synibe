"use client"
import { MessageCircle, Shield, TvMinimalPlay } from 'lucide-react';
import { Session } from '../session-provider';
import dynamic from 'next/dynamic';
const Spline = dynamic(
  () => import("@splinetool/react-spline"),
  { ssr: false }
);
const Hero = () => {
  
  return (
    <div className='h-screen select-none relative overflow-hidden'>
      <Spline 
        scene="https://prod.spline.design/SPTzpTCWXqcDDGF0/scene.splinecode"
      />

      <div className='absolute h-screen w-full flex z-10 top-0 left-0'>

        <div className="flex flex-col w-full h-screen justify-center items-center px-4 sm:px-6">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight text-white text-center">
            Watch{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Together  </span>
          </h1>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight text-white text-center">
            Feel{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Together</span>
          </h1>
          <p className="text-sm sm:text-md font-light text-slate-200 text-center p-3 sm:p-4 tracking-wide max-w-lg sm:max-w-xl">
            Sync your favorite films, series and songs with anyone, anywhere.{" "}
            <span className="hidden sm:inline"><br /></span>
            High-fidelity streaming meet human connection.
          </p>
          <Session/>
          <div className='flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 lg:gap-8 text-xs sm:text-sm font-light py-3 sm:py-4'>
            <span className='flex gap-2 items-center text-slate-400 card px-2 py-1 rounded-md'> <TvMinimalPlay className='size-4' /> 4K Crystal Clarity</span>
            <span className='flex gap-2 items-center text-slate-400 card px-2 py-1 rounded-md'> <Shield className='size-4' /> Private Syncing </span>
            <span className='flex gap-2 items-center text-slate-400 card px-2 py-1 rounded-md'> <MessageCircle className='size-4' /> Interactive Watching</span>
          </div>

          <div className='text-xs sm:text-sm text-slate-400 border border-slate-400 px-2 py-1 rounded-md card text-center'>
            <span className='bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>Don't wanna signup ?</span>  sync instantly as guest
          </div>

        </div>
      </div>
    </div>
  )
}

export default Hero