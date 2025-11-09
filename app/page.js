import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center text-white h-[40vh]">
        <div className="font-bold text-4xl flex justify-center items-center gap-2">
          Buy Me a Chai.
          <span>
            <img src="tea.gif" className="invert-25" width={88} alt="" />
          </span>
        </div>
        <p className="text-xl mt-4 text-center max-w-md">
          Fund your favorite projects by buying the creator a virtual chai.
          Support and encourage innovation, one cup at a time!
        </p>
        <div className="py-2">
          <Link href="/login">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Start Here
              </span>
            </button>
          </Link>
          <Link href="/about">
            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Read More
              </span>
            </button>
          </Link>
        </div>
      </div>
      <div className="bg-white opacity-5 h-1"></div>
      <div className="text-white container mx-auto pb-24 pt-14">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Your fans can buy you a chai.
        </h2>
        <div className="flex justify-around">
          <div className="space-y-3 flex flex-col justify-center items-center text-center">
            <img
              className="rounded-full bg-slate-500 p-2"
              src="man.gif"
              width={88}
              alt=""
            />
            <p className="font-bold ">Fans want to help</p>
            <p className="">Your fans are available to support you</p>
          </div>
          <div className="space-y-3 flex flex-col justify-center items-center text-center">
            <img
              className="rounded-full bg-slate-500 p-2"
              src="coin.gif"
              width={88}
              alt=""
            />
            <p className="font-bold ">Fans want to contribute</p>
            <p className="">Your fans are willing to contribute financially</p>
          </div>
          <div className="space-y-3 flex flex-col justify-center items-center text-center">
            <img
              className="rounded-full bg-slate-500 p-2"
              src="group.gif"
              width={88}
              alt=""
            />
            <p className="font-bold ">Fans want to collaborate</p>
            <p className="">Your fans are ready to collaborate with you</p>
          </div>
        </div>
      </div>
      <div className="bg-white opacity-5 h-1"></div>
      <div className="text-white container mx-auto md:pb-24 md:pt-14 pt-7 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-center md:mb-4">Learn about us.</h2>
        <div className="w-[90%] h-[30vh] md:w-[50%] md:h-[40vh] md:mb-4">
          <video
            src="/Company.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="overflow-hidden mt-4  md:h-[50vh]"
          />
        </div>
      </div>
    </>
  );
}
