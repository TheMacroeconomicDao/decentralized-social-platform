import {IconStatus} from "@/shared/ui/SvgIcons";


export enum Period {
    Q1 = "Q1",
    Q2 = "Q2",
    Q3 = "Q3",
    Q4 = "Q4",
}
export enum RoadmapColor {
    PAST = "#42B8F3",
    PRESENT = "#D49D32",
    FUTURE = "#466A88"
}

interface StageItem {
    title: string,
    status: IconStatus
}

interface PeriodData {
    id: number,
    period: Period,
    stage: StageItem[];
}

export interface RoadmapItem {
    year: number,
    annualColor: RoadmapColor,
    periods: PeriodData[]
}
