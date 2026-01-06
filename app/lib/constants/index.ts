const CA = "0x5449C69f8C6bc533c25fFb8756770C480B8ea811"

const MINIAPP = {
  title: "clicker",
  description: "clicker mini app",
  tags: ["clicker", "clicker", "clicker", "clicker", "clicker"],
  primaryCategory: "games",
  bgColor: "#2d3c59",
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
      splashBackgroundColor: MINIAPP.bgColor,
    },
  },
}

export { CA, MINIAPP, MINIAPP_METADATA }
