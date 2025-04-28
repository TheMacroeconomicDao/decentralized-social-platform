import { Slider } from "@/widgets/Slider/Slider";
import { Substrate } from "@/shared/ui/Substrate/Substrate";
import React from "react";
import { Team } from "@/widgets/Team";
// import { JoinSection } from "@/widgets/JoinSection/JoinSection";
import { PartnerSection } from "@/widgets/PartnerSection/PartnerSection";

import type { Metadata } from "next";
import { Banner } from "@/widgets/Banner/Banner";
import { JoinSection } from "@/widgets/TestJoinSection/JoinSection";

export const metadata: Metadata = {
  title: "Welcome to Future | Gybernaty Community",
  description: "Gybernaty Community of advanced enthusiasts and developers",
};

const Sahifa = () => {
  return (
    <>
      <Slider
        path={'/images/slides/main-slide.jpg'}
        mobilePath={'/images/slides/main-mobile-slide.jpg'}
        title={'Community of Progressive Enthusiasts '}
      />
      <Substrate {...data} />
      <Team />
      <Banner />
      <JoinSection />
      <PartnerSection>
        Our projects realize a potential opportunity for partners and investors.
        We invite you to take advantage of our initiative and participate in the
        development of technologies important to society in the fields of
        discovery, social networks, distributed computing and artificial
        intelligence. Your participation in our community contributes to the
        development of innovative technologies that are used in various areas of
        life - from economics and finance to medicine and education. Together we
        can make a significant impact on the future of humanity and create a
        world where technology is used to achieve optimal results in all areas.
      </PartnerSection>
    </>
  );
}
const data = {
  title: "Welcome to future",
  subtitle: "Revolution in corporate development",
  text: `An open community where ideas become reality. Here you will find like-minded people who can help you realize your projects and unlock your potential. This is an association of people who are passionate about technology and striving for new discoveries! We create large-scale open source projects, research current technologies and help each other realize their ideas. Here you can find a platform for research, development and exchange of experience in completely different areas of the IT industry. Join us to become a part of the movement. Here you will find not only a team that will help you in the implementation of projects, but also real friends with whom you can share your ideas and successes.

    An open community where ideas become reality. Here you will find like-minded people who can help you realize your projects and unlock your potential. This is an association of people who are passionate about technology and striving for new discoveries! We create large-scale open source projects, research current technologies and help each other realize their ideas. Here you can find a platform for research, development and exchange of experience in completely different areas of the IT industry. Join us to become a part of the movement. Here you will find not only a team that will help you in the implementation of projects, but also real friends with whom you can share your ideas and successes.
    `,
};

export default Sahifa;