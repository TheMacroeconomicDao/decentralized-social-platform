import { Slider } from "@/widgets/Slider/Slider";
import { Substrate } from "@/shared/ui/Substrate/Substrate";
import { PartnerSection } from "@/widgets/PartnerSection/PartnerSection";
import { EventsSection } from "@/widgets/EventsSection/EventsSection";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Welcome to Future | Events",
    description: "Gyber Parties",
};

const Events = () => {
    return (
        <></>
        // <>
        //     <Slider
        //         path={"/images/slides/event-slide.jpg"}
        //         mobilePath={"/images/slides/event-mobile-slide.jpg"}
        //         title={"Welcome to Gyber Reality"}
        //     />
        //     <Substrate {...data} scrollable={false} />
        //     <EventsSection />

        //     <PartnerSection>
        //         Our projects realize a potential opportunity for partners and
        //         investors. We invite you to take advantage of our initiative and
        //         participate in the development of technologies important to
        //         society in the fields of discovery, social networks, distributed
        //         computing and artificial intelligence. Your participation in our
        //         community contributes to the development of innovative
        //         technologies that are used in various areas of life - from
        //         economics and finance to medicine and education. Together we can
        //         make a significant impact on the future of humanity and create a
        //         world where technology is used to achieve optimal results in all
        //         areas.
        //     </PartnerSection>
        // </>
    );
};

const data = {
    title: `A new Era of Tech Business and 
    Fun atmosphere Begins Here!`,
    text: `Gybernaty presents: parties where technology meets finance, and music becomes the language of innovation. Immerse yourself in the epicenter of techno-business events, where inspiration and investment merge in the light atmosphere of the event!`,
};

export default Events;
