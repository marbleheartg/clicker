import { MINIAPP } from "@/lib/constants"
import { NextResponse } from "next/server"

const { NEXT_PUBLIC_HOST, NEXT_PUBLIC_NEYNAR_WEBHOOK_URL } = process.env
if (!NEXT_PUBLIC_HOST || !NEXT_PUBLIC_NEYNAR_WEBHOOK_URL) throw new Error("ManifestCredentialsNotConfigured")

export async function GET() {
  return NextResponse.json({
    accountAssociation: {
      header: "eyJmaWQiOjEwMjEyMTQsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwZjI2NWYxNUMzQUEyNmFDZkQ1QTZkNDBlQzBBMjBmNTE2NTZDYWQ1In0",
      payload: "eyJkb21haW4iOiJjbGlja2VyLm1hcmJsZWhlYXJ0Lnh5eiJ9",
      signature: "3HYsTkkY7HLqPtDdNf16mbcfNZ+lI7049fLevIFLASUvOjfQapbtplC9sLaQTX/hWbWNUe9z6rIDoVbv/n30Qxw=",
    },
    miniapp: {
      version: "1",
      name: MINIAPP.title,
      iconUrl: `https://${NEXT_PUBLIC_HOST}/images/og/icon.png`,
      homeUrl: `https://${NEXT_PUBLIC_HOST}`,
      splashImageUrl: `https://${NEXT_PUBLIC_HOST}/images/og/splash.png`,
      splashBackgroundColor: "#ffffff",
      subtitle: MINIAPP.description,
      description: MINIAPP.description,
      primaryCategory: MINIAPP.primaryCategory,
      tagline: MINIAPP.description,
      ogTitle: MINIAPP.title,
      ogDescription: MINIAPP.description,
      ogImageUrl: `https://${NEXT_PUBLIC_HOST}/images/og/cast.png`,
      castShareUrl: `https://${NEXT_PUBLIC_HOST}`,
      heroImageUrl: `https://${NEXT_PUBLIC_HOST}/images/og/hero.png`,
      canonicalDomain: NEXT_PUBLIC_HOST,
      screenshotUrls: [`https://${NEXT_PUBLIC_HOST}/images/og/screenshot.png`],
      requiredChains: ["eip155:8453"],
      requiredCapabilities: ["actions.ready"],
      tags: MINIAPP.tags,
      webhookUrl: NEXT_PUBLIC_NEYNAR_WEBHOOK_URL,
    },
  })
}
