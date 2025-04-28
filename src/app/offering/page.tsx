import type { Metadata } from 'next'
import {Slider} from "@/widgets/Slider/Slider";
import {PartnerSection} from "@/widgets/PartnerSection/PartnerSection";
import LaunchPad from "@/entities/LaunchPad/LaunchPad";

export const metadata: Metadata = {
    title: 'Welcome to Future | Coin Offering',
    description: 'Community Token Offering'
}

const TicketOffering = () => {
    return (
        <></>
        // <>
        //     <Slider
        //         path={"/images/slides/gyber-social-platform-slide.jpg"}
        //         mobilePath={"/images/slides/gyber-social-platform-mobile-slide.jpg"}
        //         title={"Community Projects"}
        //     />
        //     <LaunchPad />
        //     <PartnerSection>
        //         Our project has a huge potential for investors, and we invite you to join
        //         our team and contribute to the development of open technologies
        //         and artificial intelligence. Investing in
        //         Gyber Experiment provides a unique opportunity to get high profits
        //         in the long term.
        //     </PartnerSection>
        // </>
    )
}

export default TicketOffering;