"use client";
import { Section } from "@/shared/ui/Section/Section";
import { Container } from "@/shared/ui/Container/Container";
import cls from "./PartnerSection.module.scss";
import { ReactNode } from "react";
import ExternalLink, {
    ThemeExternalLink,
} from "@/shared/ui/ExternalLink/ExternalLink";

import { motion } from "framer-motion";

interface PartnerSectionProps {
    children: ReactNode;
    className?: string;
}

export const PartnerSection = ({
    className = "",
    children,
}: PartnerSectionProps) => {
    return (
        <Section>
            <Container>
                <div className={cls.wrapper}>
                    <motion.h2
                        initial={{
                            y: 10,
                            opacity: 0,
                        }}
                        whileInView={{
                            y: 0,
                            opacity: 1,
                            transition: {
                                type: "spring",
                                bounce: 0.2,
                                duration: 1,
                            },
                        }}
                        viewport={{once:true, amount: 0.2 }}
                    >
                        Partners
                    </motion.h2>
                    <motion.p
                        initial={{
                            y: 10,
                            opacity: 0,
                        }}
                        whileInView={{
                            y: 0,
                            opacity: 1,
                            transition: {
                                type: "spring",
                                bounce: 0.2,
                                duration: 1,
                            },
                        }}
                        viewport={{once:true, amount: 0.4 }}
                        className={cls.textContent}
                    >
                        {children}
                    </motion.p>
                    <div className={cls.buttonWrapper}>
                        <ExternalLink
                            href="mailto:back@gyber.org?subject=Become a Gyber Partner"
                            theme={ThemeExternalLink.GREEN}
                            target="_blank"
                        >
                            Become a partner
                        </ExternalLink>
                    </div>
                </div>
            </Container>
        </Section>
    );
};
