import Spline from '@splinetool/react-spline/next';

const Hero = () => {
  return (
    <div className='h-screen'>
      <Spline
        scene="https://prod.spline.design/SPTzpTCWXqcDDGF0/scene.splinecode"
      />
      <div className='absolute h-screen w-full flex z-10 top-0'>
        <div className="flex flex-col w-full h-screen justify-center items-center">

          <h1 className="text-6xl md:text-7xl font-semibold leading-tight tracking-tight text-white">
            Watch {" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Together  </span>
          </h1> 
          
          <h1 className="text-6xl md:text-7xl font-semibold leading-tight tracking-tight text-white ">
            Feel {" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Together</span>
          </h1>
        </div>
      </div>
    </div>
  )
}

export default Hero