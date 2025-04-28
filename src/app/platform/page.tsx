import { Slider } from "@/widgets/Slider/Slider";
import { SPRoadmapping } from "@/widgets/SocialPlatformRoadmap/SPRoadmapping";
import { Substrate } from '@/shared/ui/Substrate/Substrate';
import { PartnerSection } from '@/widgets/PartnerSection/PartnerSection';


import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'Welcome to Future | Social Platform',
  description: 'Be a part of innovation Gyber Social Platform',
}

const SocialPlatform = () => {
    return (
        <>
            <Slider
                path={"/images/slides/gyber-social-platform-slide.jpg"}
                mobilePath={"/images/slides/gyber-social-platform-mobile-slide.jpg"}
                title={"Be a part of innovation Gyber Social Platform"}
            />
            <Substrate {...data} scrollable={true} />
            <SPRoadmapping />

            <PartnerSection>
            Our project has a huge potential for investors, and we invite you to join 
            our team and contribute to the development of open technologies 
            and artificial intelligence. Investing in 
            GyberExperimant provides a unique opportunity to get high profits 
            in the long term.
          </PartnerSection>
        </>
    );
};

const data = {
    title: `Decentralized social network 
            Created by users`,
    subtitle: "Build the future together",
    text: `
        The Decentralized Social Platform [DSP] being developed as part of Gyber Experiment provides all the necessary functionality for organizing community activities related to the experiment and basic social networking features such as text and voice chat, file sharing and video hosting. The platform pays special attention to data security and offers several levels of data protection, including client-side or server-side encryption using the client's public key. The platform stores the bulk of the data on the IPFS network, with additional content provided by nodes deployed as part of the experiment.

        A distributed social media platform managed by the community through blockchain. users can fully control their data and communications without worrying about the intervention of centralized corporations. All users are equal and can vote for changes to the platform and participate in the creation of new modules and extensions. An innovative tool for social interaction that allows participants to create projects, communicate and solve problems together using community resources and advanced technologies.

        The platform architecture is designed to be open and scalable, with different data entry and exit points and multiple cores. Each user can contribute their own code module or feature that can be incorporated into a node and distributed to stakeholders. The platform encourages community scalability by allowing everyone to augment it and the community to maintain and distribute specific additional modules.

        The platform undergoes parallel development of modules and cores to determine the most efficient stack for different tasks and to provide flexibility for long-term architecture development.

        Secure smart contracts based on the Solidity language and the OpenZeppelin library are implemented to manage the experiment. The contracts include control tokens and utility tokens for decision making and interaction with the platform. The source code of the contracts is available on GitHub, and important decisions within the experiment are made through the DAO contract's proposal and voting mechanisms. Transparency and security are ensured through blockchain technology.

        Tokenomics plays an important role in the Gyber Experiment.  Community Token [Gbr] is a utility token required to interact with the DSP, and to manage the experiment and make collective decisions. The tokens are distributed only among the developers and participants of the experiment, the experiment does not provide for the sale of community token on the public market, although it is possible to create informal pools of small size. A reserve fund is also being created to optimize the deployment of the experiment.
        `
}


export default SocialPlatform;

