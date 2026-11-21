/** Frosted top & bottom viewport edges — content blurs as it scrolls under them. */
export function Fog() {
  return (
    <>
      <div className="fog fog-top" aria-hidden />
      <div className="fog fog-bottom" aria-hidden />
    </>
  );
}
