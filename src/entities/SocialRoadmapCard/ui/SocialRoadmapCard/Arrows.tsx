import { SVGProps } from "react";

interface ArrowsProps extends SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
}

const ArrowRight = (props : ArrowsProps) => (
    <svg {...props} width="66" height="41" viewBox="0 0 66 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M41.6478 40.1992H0V0.199219H41.6478L66 20.1992L41.6478 40.1992Z" fill="#05598E"/>
    </svg>
)
const ArrowLeft = (props : ArrowsProps) => (
    <svg {...props} width="64" height="41" viewBox="0 0 64 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M64 40.1992H0C11 31.1992 24 20.1992 24 20.1992C24 20.1992 9 6.69922 0 0.199219H64V40.1992Z" fill="url(#paint0_linear_102_5365)"/>
        <defs>
            <linearGradient id="paint0_linear_102_5365" x1="4.51765" y1="-20.1854" x2="72.3844" y2="-7.25969" gradientUnits="userSpaceOnUse">
                <stop stopColor="#105390"/>
                <stop offset="0.91228" stopColor="#4D7DA9"/>
            </linearGradient>
        </defs>
    </svg>
)
const ArrowFinal = (props : ArrowsProps) => (
    <svg {...props} width="288" height="41" viewBox="0 0 288 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M288 40.1992H0C11 31.1992 24 20.1992 24 20.1992C24 20.1992 9 6.69922 0 0.199219H288V40.1992Z" fill="url(#paint0_linear_102_5367)"/>
        <defs>
            <linearGradient id="paint0_linear_102_5367" x1="-12" y1="-20.1854" x2="301.214" y2="87.1551" gradientUnits="userSpaceOnUse">
                <stop stopColor="#105390"/>
                <stop offset="1" stopColor="#4D7DA9" stopOpacity="0"/>
            </linearGradient>
        </defs>
    </svg>
)


export { ArrowRight, ArrowLeft, ArrowFinal }
