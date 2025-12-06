export function NoiseOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[100] h-full w-full opacity-10 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] animate-noise" />
  );
}
