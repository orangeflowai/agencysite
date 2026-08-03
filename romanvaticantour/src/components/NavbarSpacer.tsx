/**
 * NavbarSpacer
 * Reserves space for the fixed announcement bar (≈34px) + navbar (≈64px).
 * Add this directly after <Navbar /> on any page that does NOT have a
 * full-bleed hero section that handles its own spacing.
 */
export default function NavbarSpacer() {
  return <div className="h-[98px] shrink-0" aria-hidden="true" />;
}
