declare module 'react-payment-icons' {
    import { CSSProperties } from 'react';

    export interface PaymentIconProps {
        id: string;
        style?: CSSProperties;
        className?: string;
    }

    export const PaymentIcon: React.FC<PaymentIconProps>;
}
