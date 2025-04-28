import { Slider } from '@/widgets/Slider/Slider'
import { Container } from '@/shared/ui/Container/Container'
import { Roadmap } from '@/entities/Roadmap'
import { Substrate } from '@/shared/ui/Substrate/Substrate'
import { PartnerSection } from '@/widgets/PartnerSection/PartnerSection'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Welcome to Future | Gyber Experiment',
  description: 'Millions are Billionaires',
}

const GyberExperiment = () => {
  return (
    <>
      <Slider
        path={'/images/slides/gyber-experiment-slide.jpg'}
        mobilePath={'/images/slides/gyber-experiment-mobile-slide.jpg'}
        title={'Millions are Billionaires'}
      />
      <Substrate {...data} />
      <Container>
        <Roadmap />
      </Container>
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
  )
}

const data = {
  title: 'The Macroeconomic Dao',
  subtitle: 'The realization of an idea is only a matter of its relevance',
  text: `Gyber Experiment is an initiative that combines cryptography, computer science, sociology and economics to create a cyber-social corporation. Its goal is to create a mechanism for direct socio-economic interaction between participants, allowing them to concentrate public and financial resources for the realization of ambitious global projects and to manage them effectively. The experiment is based on the Gyber social platform, which is a social network owned and managed by the users themselves through a decentralized autonomous organization (DAO).

    The social platform being developed for the organization of the experiment provides all the necessary functionality for organizing community activities related to the organization of the experiment and the basic functions of social networks, such as text and voice chats, file sharing and video hosting. The platform pays special attention to data security and offers several levels of data protection, including client-side or server-side encryption using the client's public key. The platform stores bulk data on the IPFS network, with additional content provided by nodes deployed as part of the experiment.

    Secure smart contracts based on the Solidity language and the OpenZeppelin library are implemented to manage the experiment. The contracts include management tokens and utility tokens for decision making and interaction with the platform. The source code of the contracts is available on GitHub, and important decisions within the experiment are made through the DAO contract's proposal and voting mechanisms. Transparency and security are ensured through blockchain technology.

    Tokenomics plays an important role in the Gyber experiment.  Community Token [Gbr] is a utility token required to interact with the platform, and to manage the experiment and make collective decisions. The tokens are distributed only among the developers and participants of the experiment, the experiment does not provide for the sale of community token on the public market, although it is possible to create informal pools of small size. A reserve fund is also being created to optimize the deployment of the experiment.

    The experiment goes through several phases, from proposing and discussing an idea, to fund accumulation, to project implementation and operation. Projects may have external customers who use fiat currency, special customers who enjoy discounts using Gyber tokens, and super customers who receive even greater discounts using a particular project's internal tokens. Betting on Gyber tokens or internal project tokens allows participants to earn reputation and passive income within the experiment.

    The internal organization of the community is based on the personal and social interests of the participants. Implementers are responsible for managing the project and making it work, and decisions are made by voting by the implementers. Performers are personally and socially responsible, and unethical behavior can lead to exclusion from the experiment. Interaction between participants occurs through discussion and closed groups, with each project having its own group. The experiment also incorporates different types of DAOs, including Social DAOs, Code DAOs, Commercial DAOs, and Economic DAOs, to facilitate decision making and project implementation.

    Overall, the Gyber Experiment aims to create a decentralized and community-driven platform that enables efficient socio-economic interaction, project implementation, and decision-making. It utilizes cryptography, data science and blockchain technology to ensure data security, transparency and scalability. We call it the Cybersocial Corporation
    `,
}
export default GyberExperiment
