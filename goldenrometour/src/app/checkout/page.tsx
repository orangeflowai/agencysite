import { redirect } from 'next/navigation'

/**
 * Checkout is handled via the CheckoutDrawer modal on the tour page.
 * Redirect any direct /checkout visits back to the tours listing.
 */
export default function CheckoutPage() {
  redirect('/#tours')
}
