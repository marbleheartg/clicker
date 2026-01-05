const CA = "0x"

const MINIAPP = {
  title: "clicker",
  description: "clicker mini app",
  tags: ["clicker", "clicker", "clicker", "clicker", "clicker"],
  primaryCategory: "games",
}

const MINIAPP_METADATA = {
  version: "next",
  imageUrl: `https://${process.env.NEXT_PUBLIC_HOST}/images/og/cast.png`,
  aspectRatio: "3:2",
  button: {
    title: "open",
    action: {
      type: "launch_miniapp",
      url: `https://${process.env.NEXT_PUBLIC_HOST}`,
      name: MINIAPP.title,
      splashImageUrl: `https://${process.env.NEXT_PUBLIC_HOST}/images/og/splash.png`,
      splashBackgroundColor: "#ffffff",
    },
  },
}

export { CA, MINIAPP, MINIAPP_METADATA }
