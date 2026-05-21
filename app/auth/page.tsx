import { AuthProvider } from "./_components/AuthProvider";
import { GrainOverlay } from "./_components/icons";
import { AuthAside } from "./_components/AuthAside";
import { AuthFormArea } from "./_components/AuthFormArea";

export default function Page() {
  return (
    <AuthProvider>
      <div
        className="font-ui text-(--color-foreground) bg-(--color-background) min-h-screen relative antialiased [text-rendering:optimizeLegibility]"
        data-palette="paper"
      >
        <GrainOverlay />

        <div className="relative grid grid-cols-[minmax(360px,38%)_1fr] min-h-screen z-1 max-[920px]:grid-cols-1">
          <div className="max-[920px]:hidden">
            <AuthAside />
          </div>

          <AuthFormArea />
        </div>
      </div>
    </AuthProvider>
  );
}
