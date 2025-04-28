import React from 'react'
import { Slider } from '@/widgets/Slider/Slider'
import { Substrate } from '@/shared/ui/Substrate/Substrate'
import { PartnerSection } from '@/widgets/PartnerSection/PartnerSection'
import { TechnicalRoadmapSection } from '@/widgets/TechnicalRoadmapSection/TechnicalRoadmapSection'
// import { Products } from '@/widgets/Products/Products';

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Welcome to Future | AIC',
  description: 'Large-scale AI research',
}

const AIC = () => {
  return (
    <>
      <Slider
        path={'/images/slides/aic-slide-2.jpg'}
        mobilePath={'/images/slides/aic-mobile-slide-2.jpg'}
        title={'Large-scale AI research'}
      />
      <Substrate {...data} />
      {/* <Products /> */}
      <TechnicalRoadmapSection />
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
  title: `The future of artificial intelligence: a research that opens up new horizons`,
  text: `AiC (Artificial Intelligence and Blockchain Community) is a project that aims to create an open community of progressive AI researchers and developers with integration into Blockchain. AiC plans to use DAO contracts to regulate the operation of models and to ensure transparency and openness in the development and use of the AI models and technologies we create.

    The problem that AiC solves is that the development and use of artificial intelligence models can be costly and complex, requiring significant resources and expertise. In addition, the use of models in different fields can raise concerns about privacy and security.

    AiC proposes a solution to this problem by creating an open community where participants can collaboratively develop and use artificial intelligence models in the blockchain environment. The use of DAO contracts allows for transparency and openness in the process, as well as regulation of the operation of the artificial intelligence models.

    The advantages of AiC lie in the fact that this open community allows participants to exchange knowledge and experience, as well as create and use artificial intelligence models in the blockchain environment with minimal costs. Additionally, the use of DAO contracts enables security and transparency in the process.

    AiC can be used for both commercial and non-commercial purposes, such as creating artificial intelligence models in the fields of medicine, finance, transportation, and others.

    We are building a platform where participants can jointly create and use artificial intelligence models in the blockchain environment, which will help improve the efficiency of using these technologies and make them accessible to a wider audience.

    AiC is an open community engaged in research and development of artificial intelligence models in the blockchain environment. We actively study and use all available libraries and frameworks for AI model development.


    We utilizes DAO contracts to regulate the operation of our artificial intelligence models. DAO contracts enable network participants to make decisions about the development and use of AI models and regulate the distribution of rewards among participants.

    Community is also actively exploring the possibilities of using machine learning technology to improve the functioning of blockchain networks and increase the efficiency of decentralized applications.

    Thanks to our open approach and use of GPL licenses, we allow the wider community to contribute to the development and improvement of our AI models. We are confident that the joint efforts of community members will help us achieve great heights in the development of AI and blockchain technologies.

    We are convinced that using these methods and technologies will allow us to create higher quality AI models and solve complex problems in various industries.

    In a world where AI is becoming an increasingly important element of our lives, developers must be at the forefront of developing this technology. We urge all developers, from juniors to the most experienced, to join our community, which is developing AI for the benefit of society.

    For juniors, this can be a great start to their career, where you can learn from us and gain experience working with our specialists. We are happy to share our knowledge and experience to help you become a sought-after developer in the future.

    For more experienced developers, our community can be the perfect place to continue your development. You will be able to work together with our experts, apply the most advanced technologies, and participate in creating AI models that will be used in various industries.

    Join our community and together we can make a huge contribution to the development of AI for society. By joining our platform, you will have access to the most advanced technologies, libraries, and frameworks for AI development. `,
  buttonText: `Join`,
  buttonLink: `https://t.me/+ahBl6aq1PGtmMTFi`,
}
export default AIC
