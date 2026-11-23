import { WelcomeAction, WelcomeScreen } from "../../../src";

// The installed app's first screen, before signing in.
export default function Welcome() {
  return (
    <WelcomeScreen
      title="Welcome to Sandbox"
      description="Find other members, send postcards, and keep your profile up to date."
      action={<WelcomeAction href="/members">Sign in</WelcomeAction>}
      secondary={
        <a href="#" className="underline underline-offset-4">
          What is Sandbox?
        </a>
      }
    />
  );
}
