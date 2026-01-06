"use client"

import { useReadContractGetClicks, useReadContractGetTopPlayers, useReadContractTotalClicks } from "@/lib/abi"
import { CA } from "@/lib/constants"
import clsx from "clsx"
import { useConnection } from "wagmi"

const formatNumber = (num: bigint | undefined) => {
  if (!num) return "—"
  const n = Number(num)
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M"
  if (n >= 1000) return (n / 1000).toFixed(1) + "K"
  return n.toString()
}

export default function Home() {
  const { address: userAddress, isConnected } = useConnection()

  // Read contract data
  const { data: userClicks } = useReadContractGetClicks({
    address: CA as `0x${string}`,
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && isConnected,
      refetchInterval: 2000,
    },
  })

  const { data: totalClicks } = useReadContractTotalClicks({
    address: CA as `0x${string}`,
    query: {
      enabled: isConnected,
      refetchInterval: 2000,
    },
  })

  const { data: topPlayersData } = useReadContractGetTopPlayers({
    address: CA as `0x${string}`,
    args: [BigInt(10)],
    query: {
      enabled: isConnected,
      refetchInterval: 2000,
    },
  })

  const [topPlayers, topClicks] = topPlayersData || [[], []]

  return (
    <main className="relative">
      {/* Background */}
      <div className="fixed inset-0 bg-(--bg)/70 -z-10" />

      <div
        className={clsx(
          "fixed top-35 bottom-35 inset-x-1/12 px-6 pt-8 pb-6 z-30",
          "flex flex-col items-center gap-6",
          "rounded-3xl",
          "bg-(--bg) glass",
          "backdrop-blur-xl",
          "border border-white/10",
          "shadow-2xl shadow-(--bg)/10",
          "overflow-y-auto",
        )}
      >
        {/* Stats Section */}
        <div className={clsx("w-full flex flex-col gap-6 items-center")}>
          <div className={clsx("text-center relative")}>
            <div className={clsx("text-xs uppercase tracking-wider opacity-60 mb-2 font-medium")}>your clicks</div>
            <div className={clsx("text-6xl font-bold text-white", "drop-shadow-lg")}>
              {isConnected && userAddress && userClicks ? formatNumber(userClicks) : "—"}
            </div>
          </div>

          <div className={clsx("text-center")}>
            <div className={clsx("text-xs uppercase tracking-wider opacity-60 mb-2 font-medium")}>total clicks</div>
            <div className={clsx("text-3xl font-bold text-white/90")}>{totalClicks ? formatNumber(totalClicks) : "—"}</div>
          </div>
        </div>

        {/* Leaderboard */}
        {topPlayers && topPlayers.length > 0 && (
          <div className={clsx("w-full mt-2")}>
            <div className={clsx("text-base font-bold mb-4 text-center uppercase tracking-wider opacity-80")}>leaderboard</div>
            <div className={clsx("flex flex-col gap-2.5")}>
              {topPlayers.map((address, index) => {
                const clicks = topClicks[index]
                const isCurrentUser = address.toLowerCase() === userAddress?.toLowerCase()
                const medalColors = [
                  "bg-(--accent)/30 border-(--accent)/50",
                  "bg-(--bg)/30 border-(--bg)/50",
                  "bg-(--accent)/30 border-(--accent)/50",
                ]
                return (
                  <div
                    key={address}
                    className={clsx(
                      "flex justify-between items-center px-4 py-3 rounded-xl",
                      "backdrop-blur-sm border",
                      "transition-all duration-200",
                      index < 3
                        ? `${medalColors[index]} shadow-lg`
                        : isCurrentUser
                          ? "bg-white/15 border-white/20 shadow-md"
                          : "bg-white/5 border-white/10 hover:bg-white/8",
                    )}
                  >
                    <div className={clsx("flex items-center gap-3")}>
                      {index < 3 ? (
                        <span className={clsx("text-xl")}>{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</span>
                      ) : (
                        <span className={clsx("text-sm opacity-60 font-bold")}>#{index + 1}</span>
                      )}
                      <span className={clsx("text-sm font-medium truncate max-w-[140px]")}>
                        {isCurrentUser ? "you" : `${address.slice(0, 6)}...${address.slice(-4)}`}
                      </span>
                    </div>
                    <span className={clsx("text-base font-bold")}>{clicks ? formatNumber(clicks) : "0"}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
