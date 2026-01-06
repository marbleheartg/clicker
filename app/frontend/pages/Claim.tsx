"use client"

import {
  useReadContractGetClicks,
  useReadContractGetPlayerCount,
  useReadContractGetTopPlayers,
  useReadContractIsPlayer,
  useReadContractTotalClicks,
  useWriteContractClick,
} from "@/lib/abi"
import { CA } from "@/lib/constants"
import { store } from "@/lib/store"
import sdk from "@farcaster/miniapp-sdk"
import clsx from "clsx"
import { useConnection } from "wagmi"

const formatNumber = (num: bigint | undefined) => {
  if (!num) return "—"
  const n = Number(num)
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M"
  if (n >= 1000) return (n / 1000).toFixed(1) + "K"
  return n.toString()
}

export default function Claim() {
  const { address: userAddress, isConnected } = useConnection()

  // Read contract data
  const { data: userClicks } = useReadContractGetClicks({
    address: CA as `0x${string}`,
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && isConnected,
      refetchInterval: 3000,
    },
  })

  const { data: totalClicks } = useReadContractTotalClicks({
    address: CA as `0x${string}`,
    query: {
      enabled: isConnected,
      refetchInterval: 3000,
    },
  })

  const { data: playerCount } = useReadContractGetPlayerCount({
    address: CA as `0x${string}`,
    query: {
      enabled: isConnected,
      refetchInterval: 3000,
    },
  })

  const { data: isPlayer } = useReadContractIsPlayer({
    address: CA as `0x${string}`,
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && isConnected,
      refetchInterval: 3000,
    },
  })

  const { data: topPlayersData } = useReadContractGetTopPlayers({
    address: CA as `0x${string}`,
    args: [BigInt(10)], // Get more players to calculate rank better
    query: {
      enabled: isConnected,
      refetchInterval: 3000,
    },
  })

  // Write contract
  const { writeContract: click, isPending: isClicking } = useWriteContractClick()

  const handleClick = () => {
    if (!userAddress || !isConnected || isClicking) return

    // Haptic feedback
    if (store.getState().capabilities?.includes("haptics.impactOccurred")) {
      sdk.haptics.impactOccurred("medium")
    }

    // Call contract
    click({
      address: CA as `0x${string}`,
    })
  }

  const [topPlayers, topClicks] = topPlayersData || [[], []]

  // Calculate user's rank
  const userRank =
    userAddress && topPlayers && topClicks ? topPlayers.findIndex(player => player.toLowerCase() === userAddress.toLowerCase()) + 1 : null

  return (
    <main className="relative">
      {/* Background */}
      <div className="fixed inset-0 bg-(--bg)/70 -z-10" />

      <div
        className={clsx(
          "fixed top-30 bottom-30 inset-x-1/12 px-6 pt-8 pb-6 z-30",
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
        <div className={clsx("w-full grid grid-cols-2 gap-6")}>
          {/* Primary Stats */}
          <div className={clsx("text-center relative")}>
            <div className={clsx("text-xs uppercase tracking-wider opacity-60 mb-2 font-medium")}>your clicks</div>
            <div className={clsx("text-2xl font-bold text-white/90")}>
              {isConnected && userAddress && userClicks ? formatNumber(userClicks) : "—"}
            </div>
          </div>

          <div className={clsx("text-center")}>
            <div className={clsx("text-xs uppercase tracking-wider opacity-60 mb-2 font-medium")}>total clicks</div>
            <div className={clsx("text-2xl font-bold text-white/90")}>{totalClicks ? formatNumber(totalClicks) : "—"}</div>
          </div>

          {/* Additional Stats */}
          <div className={clsx("text-center")}>
            <div className={clsx("text-xs uppercase tracking-wider opacity-60 mb-2 font-medium")}>your rank</div>
            <div className={clsx("text-2xl font-bold text-white/90")}>{userRank && userRank > 0 ? `#${userRank}` : isPlayer ? "Unranked" : "—"}</div>
          </div>

          <div className={clsx("text-center")}>
            <div className={clsx("text-xs uppercase tracking-wider opacity-60 mb-2 font-medium")}>total players</div>
            <div className={clsx("text-2xl font-bold text-white/90")}>{playerCount ? formatNumber(playerCount) : "—"}</div>
          </div>
        </div>

        {/* Click Button */}
        <button
          onClick={handleClick}
          disabled={!isConnected || !userAddress || isClicking}
          className={clsx(
            "relative rounded-full p-5",
            "bg-(--accent)/40",
            "border-2 border-(--accent)/40",
            "flex items-center justify-center",
            "text-2xl font-bold text-white",
            "disabled:opacity-40 disabled:cursor-not-allowed",
          )}
        >
          {isClicking ? (
            <span className={clsx("select-none text-2xl")}>...</span>
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
              <path d="M3 12L21 12M12 3L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          )}
        </button>

        {/* Leaderboard */}
        {topPlayers && topPlayers.length > 0 && (
          <div className={clsx("w-full mt-2")}>
            <div className={clsx("text-sm font-bold mb-3 text-center uppercase tracking-wider opacity-80")}>top players</div>
            <div className={clsx("flex flex-col gap-2")}>
              {topPlayers.map((address, index) => {
                const clicks = topClicks[index]
                const isCurrentUser = address.toLowerCase() === userAddress?.toLowerCase()
                const medalColors = [
                  "bg-(--accent)/30 border-(--accent)/50",
                  "bg-(--accent)/30 border-(--accent)/50",
                  "bg-(--accent)/30 border-(--accent)/50",
                ]
                return (
                  <div
                    key={address}
                    className={clsx(
                      "flex justify-between items-center px-4 py-3 rounded-xl",
                      "backdrop-blur-sm border",
                      index < 3
                        ? `${medalColors[index]} shadow-lg`
                        : isCurrentUser
                          ? "bg-white/15 border-white/20 shadow-md"
                          : "bg-white/5 border-white/10 hover:bg-white/8",
                    )}
                  >
                    <div className={clsx("flex items-center gap-3")}>
                      {index < 3 ? (
                        <span className={clsx("text-lg font-bold")}>{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</span>
                      ) : (
                        <span className={clsx("text-xs opacity-60 font-bold")}>#{index + 1}</span>
                      )}
                      <span className={clsx("text-sm font-medium truncate max-w-[120px]")}>
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
