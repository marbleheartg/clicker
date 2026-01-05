import clsx from "clsx"
// import NextImage from "next/image"

const Background = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 w-screen h-screen opacity-10 -z-10 pointer-events-none">
        {/* <NextImage src={"/images/bg.svg"} fill alt="bg" priority /> */}
      </div>

      <div className={clsx("fixed top-0 left-0 w-screen h-screen -z-20 pointer-events-none", "bg-linear-to-br from-(--bg) to-(--bg)/70")}></div>
    </div>
  )
}

export default Background
