import { Slider } from '@/widgets/Slider/Slider'
import { Substrate } from '@/shared/ui/Substrate/Substrate'
import React from 'react'
import { Team } from '@/widgets/Team'
// import { JoinSection } from "@/widgets/JoinSection/JoinSection";
import { PartnerSection } from '@/widgets/PartnerSection/PartnerSection'

import type { Metadata } from 'next'
import { Banner } from '@/widgets/Banner/Banner'
import { JoinSection } from '@/widgets/JoinSection/JoinSection'

export const metadata: Metadata = {
  title: 'Welcome to Future | Gybernaty Community',
  description: 'Gybernaty Community of advanced enthusiasts and developers',
}

export default function Home() {
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
  )
}
const data = {
  title: 'Welcome to future',
  subtitle: 'Revolution in corporate development',
  text: `An open community where ideas become reality. Here you will find like-minded people who can help you realize your projects and unlock your potential. This is an association of people who are passionate about technology and striving for new discoveries! 

    We research large-scale areas of technology and help each other realize their ideas, create innovative open source projects. Here you can find a platform for research, development and exchange of experience in completely different areas of the IT industry. Join us to become a part of the movement. Here you will find not only a team that will help you in the implementation of projects, but also real friends with whom you can share your ideas and successes.

    Gybernaty is a progressive Rocket-Science community of researchers and developers. We are engaged in research in relevant areas of technology and the development of innovative prototypes and products in the fields of web3, cross-chain integration, blockchain, distributed ledger technology(DLT), highload systems, distributed computing, distributed storage networks, distributed file system and AI. This is not a traditional IT company, but an attempt to implement a new form of cooperation between researchers and developers in order to create a decentralized cybersocial corporation.

    Our mission is to realize a large-scale open source ecosystem that is a powerful and user-friendly environment that promotes open education, effective experience sharing and organization of progressive research and development of innovative prototypes and products within GyberExperiment.

    Gybernaty is a unique community that unites researchers and enthusiastic developers who strive to master and develop the theory of cybersociality. The main goal of the community is to bring to life a new form of socio-economic interaction known as a cybersocial corporation. This form of organization is a decentralized, autonomous, and self-governing structure where participants interact based on transparent and fair rules, ensuring efficient allocation of resources and rewards. The cybersocial corporation is a fundamental unit of the new economic model described in the theory of the cybersocium, and represents a platform for innovation and collaboration.

    One of the key tasks of the Gybernaty community is to provide participants with everything necessary for their professional and personal development, including financial needs. This is achieved by creating a large-scale ecosystem based on the Gbr community token. Gbr is an internal utility token of the DSP platform developed by the community, which plays a central role in the economy of Gyber Experiment, ensuring transparency and fairness in the allocation of resources.

    Community creates a unique ecosystem where researchers and developers can not only implement their ideas, but also receive decent rewards for their activity and contribution. Reward mechanisms based on smart contracts and [Gbr] tokens ensure transparency and fairness in the allocation of resources, contributing to the sustainable development of the community. 

    Through the active exchange of experience and the expansion of the field of expertise, Gybernaty strives to become a leading center for innovation and collaboration in the field of cybersociety and related technologies. We believe that together we can create a future where innovation and justice go hand in hand, opening up new horizons for humanity.`,
}
