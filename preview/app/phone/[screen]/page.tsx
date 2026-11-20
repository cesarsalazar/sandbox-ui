import { PhoneScreen } from "../screens";

// One phone screen, shown full size in a frame on the preview's home page.
// ?platform=android shows Android's tab bar; iPhone's is the default.
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ screen: string }>;
  searchParams: Promise<{ platform?: string }>;
}) {
  const { screen } = await params;
  const { platform } = await searchParams;
  return <PhoneScreen screen={screen} platform={platform === "android" ? "android" : "ios"} />;
}
