import { redirect } from 'next/navigation';

export default function CheckoutPage() {
    // Rule 11: All checkout flow must go through the modal, not a full page.
    redirect('/?checkout=true');
}
