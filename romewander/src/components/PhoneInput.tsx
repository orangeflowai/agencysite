'use client';

import { useState, useEffect } from 'react';
import { Phone, ChevronDown } from 'lucide-react';

interface Country {
    code: string;
    dialCode: string;
    flag: string;
    name: string;
}

const countries: Country[] = [
    { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'United States' },
    { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: 'CA', dialCode: '+1', flag: '🇨🇦', name: 'Canada' },
    { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: 'FR', dialCode: '+33', flag: '🇫🇷', name: 'France' },
    { code: 'IT', dialCode: '+39', flag: '🇮🇹', name: 'Italy' },
    { code: 'ES', dialCode: '+34', flag: '🇪🇸', name: 'Spain' },
    { code: 'NL', dialCode: '+31', flag: '🇳🇱', name: 'Netherlands' },
    { code: 'BE', dialCode: '+32', flag: '🇧🇪', name: 'Belgium' },
    { code: 'CH', dialCode: '+41', flag: '🇨🇭', name: 'Switzerland' },
    { code: 'AT', dialCode: '+43', flag: '🇦🇹', name: 'Austria' },
    { code: 'SE', dialCode: '+46', flag: '🇸🇪', name: 'Sweden' },
    { code: 'NO', dialCode: '+47', flag: '🇳🇴', name: 'Norway' },
    { code: 'DK', dialCode: '+45', flag: '🇩🇰', name: 'Denmark' },
    { code: 'FI', dialCode: '+358', flag: '🇫🇮', name: 'Finland' },
    { code: 'IE', dialCode: '+353', flag: '🇮🇪', name: 'Ireland' },
    { code: 'PL', dialCode: '+48', flag: '🇵🇱', name: 'Poland' },
    { code: 'CZ', dialCode: '+420', flag: '🇨🇿', name: 'Czech Republic' },
    { code: 'HU', dialCode: '+36', flag: '🇭🇺', name: 'Hungary' },
    { code: 'PT', dialCode: '+351', flag: '🇵🇹', name: 'Portugal' },
    { code: 'GR', dialCode: '+30', flag: '🇬🇷', name: 'Greece' },
    { code: 'TR', dialCode: '+90', flag: '🇹🇷', name: 'Turkey' },
    { code: 'RU', dialCode: '+7', flag: '🇷🇺', name: 'Russia' },
    { code: 'UA', dialCode: '+380', flag: '🇺🇦', name: 'Ukraine' },
    { code: 'JP', dialCode: '+81', flag: '🇯🇵', name: 'Japan' },
    { code: 'CN', dialCode: '+86', flag: '🇨🇳', name: 'China' },
    { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: 'India' },
    { code: 'BR', dialCode: '+55', flag: '🇧🇷', name: 'Brazil' },
    { code: 'MX', dialCode: '+52', flag: '🇲🇽', name: 'Mexico' },
    { code: 'AR', dialCode: '+54', flag: '🇦🇷', name: 'Argentina' },
    { code: 'ZA', dialCode: '+27', flag: '🇿🇦', name: 'South Africa' },
    { code: 'EG', dialCode: '+20', flag: '🇪🇬', name: 'Egypt' },
    { code: 'IL', dialCode: '+972', flag: '🇮🇱', name: 'Israel' },
    { code: 'AE', dialCode: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
    { code: 'SA', dialCode: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
    { code: 'KR', dialCode: '+82', flag: '🇰🇷', name: 'South Korea' },
    { code: 'SG', dialCode: '+65', flag: '🇸🇬', name: 'Singapore' },
    { code: 'TH', dialCode: '+66', flag: '🇹🇭', name: 'Thailand' },
    { code: 'MY', dialCode: '+60', flag: '🇲🇾', name: 'Malaysia' },
    { code: 'ID', dialCode: '+62', flag: '🇮🇩', name: 'Indonesia' },
    { code: 'PH', dialCode: '+63', flag: '🇵🇭', name: 'Philippines' },
    { code: 'VN', dialCode: '+84', flag: '🇻🇳', name: 'Vietnam' },
    { code: 'NZ', dialCode: '+64', flag: '🇳🇿', name: 'New Zealand' },
    { code: 'HK', dialCode: '+852', flag: '🇭🇰', name: 'Hong Kong' },
    { code: 'TW', dialCode: '+886', flag: '🇹🇼', name: 'Taiwan' },
    { code: 'RO', dialCode: '+40', flag: '🇷🇴', name: 'Romania' },
    { code: 'BG', dialCode: '+359', flag: '🇧🇬', name: 'Bulgaria' },
    { code: 'HR', dialCode: '+385', flag: '🇭🇷', name: 'Croatia' },
    { code: 'SI', dialCode: '+386', flag: '🇸🇮', name: 'Slovenia' },
    { code: 'SK', dialCode: '+421', flag: '🇸🇰', name: 'Slovakia' },
    { code: 'LT', dialCode: '+370', flag: '🇱🇹', name: 'Lithuania' },
    { code: 'LV', dialCode: '+371', flag: '🇱🇻', name: 'Latvia' },
    { code: 'EE', dialCode: '+372', flag: '🇪🇪', name: 'Estonia' },
    { code: 'IS', dialCode: '+354', flag: '🇮🇸', name: 'Iceland' },
    { code: 'MT', dialCode: '+356', flag: '🇲🇹', name: 'Malta' },
    { code: 'CY', dialCode: '+357', flag: '🇨🇾', name: 'Cyprus' },
    { code: 'LU', dialCode: '+352', flag: '🇱🇺', name: 'Luxembourg' },
    { code: 'MC', dialCode: '+377', flag: '🇲🇨', name: 'Monaco' },
    { code: 'LI', dialCode: '+423', flag: '🇱🇮', name: 'Liechtenstein' },
    { code: 'SM', dialCode: '+378', flag: '🇸🇲', name: 'San Marino' },
    { code: 'AD', dialCode: '+376', flag: '🇦🇩', name: 'Andorra' },
    { code: 'VA', dialCode: '+379', flag: '🇻🇦', name: 'Vatican' },
    { code: 'AL', dialCode: '+355', flag: '🇦🇱', name: 'Albania' },
    { code: 'BA', dialCode: '+387', flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
    { code: 'ME', dialCode: '+382', flag: '🇲🇪', name: 'Montenegro' },
    { code: 'MK', dialCode: '+389', flag: '🇲🇰', name: 'North Macedonia' },
    { code: 'RS', dialCode: '+381', flag: '🇷🇸', name: 'Serbia' },
    { code: 'XK', dialCode: '+383', flag: '🇽🇰', name: 'Kosovo' },
    { code: 'MD', dialCode: '+373', flag: '🇲🇩', name: 'Moldova' },
    { code: 'BY', dialCode: '+375', flag: '🇧🇾', name: 'Belarus' },
    { code: 'AM', dialCode: '+374', flag: '🇦🇲', name: 'Armenia' },
    { code: 'GE', dialCode: '+995', flag: '🇬🇪', name: 'Georgia' },
    { code: 'AZ', dialCode: '+994', flag: '🇦🇿', name: 'Azerbaijan' },
    { code: 'KZ', dialCode: '+7', flag: '🇰🇿', name: 'Kazakhstan' },
    { code: 'UZ', dialCode: '+998', flag: '🇺🇿', name: 'Uzbekistan' },
    { code: 'KG', dialCode: '+996', flag: '🇰🇬', name: 'Kyrgyzstan' },
    { code: 'TJ', dialCode: '+992', flag: '🇹🇯', name: 'Tajikistan' },
    { code: 'TM', dialCode: '+993', flag: '🇹🇲', name: 'Turkmenistan' },
    { code: 'AF', dialCode: '+93', flag: '🇦🇫', name: 'Afghanistan' },
    { code: 'PK', dialCode: '+92', flag: '🇵🇰', name: 'Pakistan' },
    { code: 'BD', dialCode: '+880', flag: '🇧🇩', name: 'Bangladesh' },
    { code: 'LK', dialCode: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
    { code: 'NP', dialCode: '+977', flag: '🇳🇵', name: 'Nepal' },
    { code: 'BT', dialCode: '+975', flag: '🇧🇹', name: 'Bhutan' },
    { code: 'MV', dialCode: '+960', flag: '🇲🇻', name: 'Maldives' },
    { code: 'MM', dialCode: '+95', flag: '🇲🇲', name: 'Myanmar' },
    { code: 'KH', dialCode: '+855', flag: '🇰🇭', name: 'Cambodia' },
    { code: 'LA', dialCode: '+856', flag: '🇱🇦', name: 'Laos' },
    { code: 'BN', dialCode: '+673', flag: '🇧🇳', name: 'Brunei' },
    { code: 'MO', dialCode: '+853', flag: '🇲🇴', name: 'Macau' },
    { code: 'MN', dialCode: '+976', flag: '🇲🇳', name: 'Mongolia' },
    { code: 'KP', dialCode: '+850', flag: '🇰🇵', name: 'North Korea' },
    { code: 'QA', dialCode: '+974', flag: '🇶🇦', name: 'Qatar' },
    { code: 'BH', dialCode: '+973', flag: '🇧🇭', name: 'Bahrain' },
    { code: 'KW', dialCode: '+965', flag: '🇰🇼', name: 'Kuwait' },
    { code: 'OM', dialCode: '+968', flag: '🇴🇲', name: 'Oman' },
    { code: 'YE', dialCode: '+967', flag: '🇾🇪', name: 'Yemen' },
    { code: 'IQ', dialCode: '+964', flag: '🇮🇶', name: 'Iraq' },
    { code: 'SY', dialCode: '+963', flag: '🇸🇾', name: 'Syria' },
    { code: 'LB', dialCode: '+961', flag: '🇱🇧', name: 'Lebanon' },
    { code: 'JO', dialCode: '+962', flag: '🇯🇴', name: 'Jordan' },
    { code: 'PS', dialCode: '+970', flag: '🇵🇸', name: 'Palestine' },
    { code: 'DZ', dialCode: '+213', flag: '🇩🇿', name: 'Algeria' },
    { code: 'MA', dialCode: '+212', flag: '🇲🇦', name: 'Morocco' },
    { code: 'TN', dialCode: '+216', flag: '🇹🇳', name: 'Tunisia' },
    { code: 'LY', dialCode: '+218', flag: '🇱🇾', name: 'Libya' },
    { code: 'SD', dialCode: '+249', flag: '🇸🇩', name: 'Sudan' },
    { code: 'ET', dialCode: '+251', flag: '🇪🇹', name: 'Ethiopia' },
    { code: 'KE', dialCode: '+254', flag: '🇰🇪', name: 'Kenya' },
    { code: 'TZ', dialCode: '+255', flag: '🇹🇿', name: 'Tanzania' },
    { code: 'UG', dialCode: '+256', flag: '🇺🇬', name: 'Uganda' },
    { code: 'RW', dialCode: '+250', flag: '🇷🇼', name: 'Rwanda' },
    { code: 'BI', dialCode: '+257', flag: '🇧🇮', name: 'Burundi' },
    { code: 'MZ', dialCode: '+258', flag: '🇲🇿', name: 'Mozambique' },
    { code: 'ZW', dialCode: '+263', flag: '🇿🇼', name: 'Zimbabwe' },
    { code: 'ZM', dialCode: '+260', flag: '🇿🇲', name: 'Zambia' },
    { code: 'MW', dialCode: '+265', flag: '🇲🇼', name: 'Malawi' },
    { code: 'AO', dialCode: '+244', flag: '🇦🇴', name: 'Angola' },
    { code: 'CD', dialCode: '+243', flag: '🇨🇩', name: 'DR Congo' },
    { code: 'CG', dialCode: '+242', flag: '🇨🇬', name: 'Congo' },
    { code: 'GA', dialCode: '+241', flag: '🇬🇦', name: 'Gabon' },
    { code: 'GQ', dialCode: '+240', flag: '🇬🇶', name: 'Equatorial Guinea' },
    { code: 'CM', dialCode: '+237', flag: '🇨🇲', name: 'Cameroon' },
    { code: 'CF', dialCode: '+236', flag: '🇨🇫', name: 'Central African Republic' },
    { code: 'TD', dialCode: '+235', flag: '🇹🇩', name: 'Chad' },
    { code: 'NE', dialCode: '+227', flag: '🇳🇪', name: 'Niger' },
    { code: 'ML', dialCode: '+223', flag: '🇲🇱', name: 'Mali' },
    { code: 'BF', dialCode: '+226', flag: '🇧🇫', name: 'Burkina Faso' },
    { code: 'SN', dialCode: '+221', flag: '🇸🇳', name: 'Senegal' },
    { code: 'GM', dialCode: '+220', flag: '🇬🇲', name: 'Gambia' },
    { code: 'GW', dialCode: '+245', flag: '🇬🇼', name: 'Guinea-Bissau' },
    { code: 'GN', dialCode: '+224', flag: '🇬🇳', name: 'Guinea' },
    { code: 'SL', dialCode: '+232', flag: '🇸🇱', name: 'Sierra Leone' },
    { code: 'LR', dialCode: '+231', flag: '🇱🇷', name: 'Liberia' },
    { code: 'CI', dialCode: '+225', flag: '🇨🇮', name: 'Ivory Coast' },
    { code: 'GH', dialCode: '+233', flag: '🇬🇭', name: 'Ghana' },
    { code: 'TG', dialCode: '+228', flag: '🇹🇬', name: 'Togo' },
    { code: 'BJ', dialCode: '+229', flag: '🇧🇯', name: 'Benin' },
    { code: 'NG', dialCode: '+234', flag: '🇳🇬', name: 'Nigeria' },
    { code: 'CL', dialCode: '+56', flag: '🇨🇱', name: 'Chile' },
    { code: 'PE', dialCode: '+51', flag: '🇵🇪', name: 'Peru' },
    { code: 'CO', dialCode: '+57', flag: '🇨🇴', name: 'Colombia' },
    { code: 'VE', dialCode: '+58', flag: '🇻🇪', name: 'Venezuela' },
    { code: 'EC', dialCode: '+593', flag: '🇪🇨', name: 'Ecuador' },
    { code: 'BO', dialCode: '+591', flag: '🇧🇴', name: 'Bolivia' },
    { code: 'PY', dialCode: '+595', flag: '🇵🇾', name: 'Paraguay' },
    { code: 'UY', dialCode: '+598', flag: '🇺🇾', name: 'Uruguay' },
    { code: 'GY', dialCode: '+592', flag: '🇬🇾', name: 'Guyana' },
    { code: 'SR', dialCode: '+597', flag: '🇸🇷', name: 'Suriname' },
    { code: 'GF', dialCode: '+594', flag: '🇬🇫', name: 'French Guiana' },
    { code: 'FK', dialCode: '+500', flag: '🇫🇰', name: 'Falkland Islands' },
    { code: 'JM', dialCode: '+1-876', flag: '🇯🇲', name: 'Jamaica' },
    { code: 'CU', dialCode: '+53', flag: '🇨🇺', name: 'Cuba' },
    { code: 'HT', dialCode: '+509', flag: '🇭🇹', name: 'Haiti' },
    { code: 'DO', dialCode: '+1-809', flag: '🇩🇴', name: 'Dominican Republic' },
    { code: 'PR', dialCode: '+1-787', flag: '🇵🇷', name: 'Puerto Rico' },
    { code: 'TT', dialCode: '+1-868', flag: '🇹🇹', name: 'Trinidad and Tobago' },
    { code: 'BB', dialCode: '+1-246', flag: '🇧🇧', name: 'Barbados' },
    { code: 'GD', dialCode: '+1-473', flag: '🇬🇩', name: 'Grenada' },
    { code: 'VC', dialCode: '+1-784', flag: '🇻🇨', name: 'Saint Vincent' },
    { code: 'LC', dialCode: '+1-758', flag: '🇱🇨', name: 'Saint Lucia' },
    { code: 'DM', dialCode: '+1-767', flag: '🇩🇲', name: 'Dominica' },
    { code: 'AG', dialCode: '+1-268', flag: '🇦🇬', name: 'Antigua and Barbuda' },
    { code: 'KN', dialCode: '+1-869', flag: '🇰🇳', name: 'Saint Kitts and Nevis' },
    { code: 'BS', dialCode: '+1-242', flag: '🇧🇸', name: 'Bahamas' },
    { code: 'BZ', dialCode: '+501', flag: '🇧🇿', name: 'Belize' },
    { code: 'GT', dialCode: '+502', flag: '🇬🇹', name: 'Guatemala' },
    { code: 'SV', dialCode: '+503', flag: '🇸🇻', name: 'El Salvador' },
    { code: 'HN', dialCode: '+504', flag: '🇭🇳', name: 'Honduras' },
    { code: 'NI', dialCode: '+505', flag: '🇳🇮', name: 'Nicaragua' },
    { code: 'CR', dialCode: '+506', flag: '🇨🇷', name: 'Costa Rica' },
    { code: 'PA', dialCode: '+507', flag: '🇵🇦', name: 'Panama' },
    { code: 'GL', dialCode: '+299', flag: '🇬🇱', name: 'Greenland' },
    { code: 'PF', dialCode: '+689', flag: '🇵🇫', name: 'French Polynesia' },
    { code: 'NC', dialCode: '+687', flag: '🇳🇨', name: 'New Caledonia' },
    { code: 'FJ', dialCode: '+679', flag: '🇫🇯', name: 'Fiji' },
    { code: 'PG', dialCode: '+675', flag: '🇵🇬', name: 'Papua New Guinea' },
    { code: 'SB', dialCode: '+677', flag: '🇸🇧', name: 'Solomon Islands' },
    { code: 'VU', dialCode: '+678', flag: '🇻🇺', name: 'Vanuatu' },
    { code: 'WS', dialCode: '+685', flag: '🇼🇸', name: 'Samoa' },
    { code: 'TO', dialCode: '+676', flag: '🇹🇴', name: 'Tonga' },
    { code: 'KI', dialCode: '+686', flag: '🇰🇮', name: 'Kiribati' },
    { code: 'TV', dialCode: '+688', flag: '🇹🇻', name: 'Tuvalu' },
    { code: 'NR', dialCode: '+674', flag: '🇳🇷', name: 'Nauru' },
    { code: 'PW', dialCode: '+680', flag: '🇵🇼', name: 'Palau' },
    { code: 'MH', dialCode: '+692', flag: '🇲🇭', name: 'Marshall Islands' },
    { code: 'FM', dialCode: '+691', flag: '🇫🇲', name: 'Micronesia' },
    { code: 'CK', dialCode: '+682', flag: '🇨🇰', name: 'Cook Islands' },
    { code: 'NU', dialCode: '+683', flag: '🇳🇺', name: 'Niue' },
    { code: 'TK', dialCode: '+690', flag: '🇹🇰', name: 'Tokelau' },
    { code: 'WF', dialCode: '+681', flag: '🇼🇫', name: 'Wallis and Futuna' },
    { code: 'AS', dialCode: '+1-684', flag: '🇦🇸', name: 'American Samoa' },
    { code: 'GU', dialCode: '+1-671', flag: '🇬🇺', name: 'Guam' },
    { code: 'MP', dialCode: '+1-670', flag: '🇲🇵', name: 'Northern Mariana Islands' },
    { code: 'VI', dialCode: '+1-340', flag: '🇻🇮', name: 'U.S. Virgin Islands' },
    { code: 'VG', dialCode: '+1-284', flag: '🇻🇬', name: 'British Virgin Islands' },
    { code: 'AI', dialCode: '+1-264', flag: '🇦🇮', name: 'Anguilla' },
    { code: 'MS', dialCode: '+1-664', flag: '🇲🇸', name: 'Montserrat' },
    { code: 'BL', dialCode: '+590', flag: '🇧🇱', name: 'Saint Barthelemy' },
    { code: 'MF', dialCode: '+590', flag: '🇲🇫', name: 'Saint Martin' },
    { code: 'SX', dialCode: '+1-721', flag: '🇸🇽', name: 'Sint Maarten' },
    { code: 'CW', dialCode: '+599', flag: '🇨🇼', name: 'Curacao' },
    { code: 'BQ', dialCode: '+599', flag: '🇧🇶', name: 'Caribbean Netherlands' },
    { code: 'AW', dialCode: '+297', flag: '🇦🇼', name: 'Aruba' },
    { code: 'KY', dialCode: '+1-345', flag: '🇰🇾', name: 'Cayman Islands' },
    { code: 'BM', dialCode: '+1-441', flag: '🇧🇲', name: 'Bermuda' },
    { code: 'TC', dialCode: '+1-649', flag: '🇹🇨', name: 'Turks and Caicos' },
    { code: 'AN', dialCode: '+599', flag: '🇳🇱', name: 'Netherlands Antilles' },
];

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    className?: string;
    label?: string;
    error?: string;
    id?: string;
}

export default function PhoneInput({
    value,
    onChange,
    placeholder = "Phone number",
    required = false,
    className = "",
    label,
    error,
    id
}: PhoneInputProps) {
    const [selectedCountry, setSelectedCountry] = useState<Country>(countries[5]); // Default to France for Italy-based service
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Parse  value if provided
    useEffect(() => {
        if (value && !phoneNumber) {
            // Try to find matching country code
            for (const country of countries) {
                if (value.startsWith(country.dialCode)) {
                    setSelectedCountry(country);
                    setPhoneNumber(value.substring(country.dialCode.length).trim());
                    break;
                }
            }
            // If no country code found, use the value as-is
            if (!phoneNumber) {
                setPhoneNumber(value);
            }
        }
    }, [value]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;

        // If user typed the country code into the input, remove it
        // Example: user selects Italy (+39) and then types 39... or +39...
        const dialCodeWithoutPlus = selectedCountry.dialCode.replace('+', '');
        if (val.startsWith('+')) {
            // If they typed +39... and country is +39, strip +39
            if (val.startsWith(selectedCountry.dialCode)) {
                val = val.slice(selectedCountry.dialCode.length);
            }
        } else if (val.startsWith(dialCodeWithoutPlus)) {
            // If they typed 39... and country is 39, strip 39
            val = val.slice(dialCodeWithoutPlus.length);
        }

        const cleaned = val.replace(/\D/g, '');
        setPhoneNumber(cleaned);
        onChange(`${selectedCountry.dialCode}${cleaned}`);
    };

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        setIsOpen(false);
        onChange(`${country.dialCode} ${phoneNumber}`);
    };

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <div className="flex">
                    {/* Country Selector */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className={`h-full px-3 py-3 pl-10 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg flex items-center gap-2 hover:bg-gray-100 transition-colors ${error ? 'border-red-400 bg-red-50' : ''}`}
                        >
                            <span className="text-lg">{selectedCountry.flag}</span>
                            <span className="text-sm font-medium text-gray-700">{selectedCountry.dialCode}</span>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        {/* Country Dropdown */}
                        {isOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsOpen(false)}
                                />
                                <div className="absolute top-full left-0 mt-1 w-64 max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                                    {countries.map((country) => (
                                        <button
                                            key={country.code}
                                            type="button"
                                            onClick={() => handleCountrySelect(country)}
                                            className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${selectedCountry.code === country.code ? 'bg-sky-50 text-sky-700' : ''
                                                }`}
                                        >
                                            <span className="text-lg">{country.flag}</span>
                                            <span className="text-sm font-medium">{country.name}</span>
                                            <span className="text-sm text-gray-500 ml-auto">{country.dialCode}</span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Phone Number Input */}
                    <input
                        id={id}
                        type="tel"
                        required={required}
                        className={`flex-1 px-4 py-3 border border-gray-200 rounded-r-lg focus:ring-2 focus:ring-sky-500 outline-none ${error ? 'border-red-400 bg-red-50' : ''}`}
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder={placeholder}
                    />
                </div>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}
