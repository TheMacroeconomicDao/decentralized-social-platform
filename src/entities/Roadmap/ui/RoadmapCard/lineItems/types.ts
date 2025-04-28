import {SVGProps} from "react";

export interface ItemProps extends SVGProps<SVGSVGElement>{
    color?: string;
    width?: string;
    height?: string;
    strokeWidth?: number;
}
