import clsx from "clsx"
import { useConnection } from "wagmi"

export default function Claim() {
  const { address: userAddress } = useConnection()

  return (
    <main>
      <div
        className={clsx(
          "fixed top-35 bottom-35 inset-x-1/12 px-1 pt-3.5 pb-3 z-30",
          "flex flex-col items-center",
          "rounded-4xl",
          "bg-white/10 glass",
        )}
      >
        Claim page
      </div>
      {/* {process.env.NODE_ENV === "development" && (
        <pre className={clsx("fixed bottom-0 inset-x-0 p-5 pb-15 rounded-t-4xl", "text-xs text-wrap bg-amber-200/50 pointer-events-none z-50")}>
          <div>{JSON.stringify({ userAddress, isLoading, ua: navigator.userAgent }, null, 2)}</div>
        </pre>
      )} */}
    </main>
  )
}
