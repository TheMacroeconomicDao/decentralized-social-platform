'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Container } from '@/shared/ui/Container/Container';
import { Section } from '@/shared/ui/Section/Section';
import { DynamicLighting } from '@/shared/ui/DynamicLighting/DynamicLighting';
import styles from './page.module.scss';

// Section entrance — opacity + y + blur (design doc §5.3)
const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring' as const, stiffness: 150, damping: 20, mass: 1.5 },
  }
};

const EcosystemStatusHero = dynamic(
  () => import('@/widgets/EcosystemStatusHero').then((mod) => ({ default: mod.EcosystemStatusHero })),
  { ssr: false }
);

const Ecosystem3DVisualization = dynamic(
  () => import('@/widgets/Ecosystem3DVisualization').then((mod) => ({ default: mod.Ecosystem3DVisualization })),
  {
    ssr: false,
    loading: () => <div className={styles.loading}>Loading 3D Visualization...</div>
  }
);

const MetricsDashboard = dynamic(
  () => import('@/widgets/MetricsDashboard').then((mod) => ({ default: mod.MetricsDashboard })),
  { ssr: false }
);

const ProjectsGrid = dynamic(
  () => import('@/widgets/ProjectsGrid').then((mod) => ({ default: mod.ProjectsGrid })),
  { ssr: false }
);

const TechnologyStack = dynamic(
  () => import('@/widgets/TechnologyStack').then((mod) => ({ default: mod.TechnologyStack })),
  { ssr: false }
);

export default function EcosystemStatusPage() {
  return (
    <DynamicLighting color="66, 184, 243" intensity={0.1} radius={1200}>
      <div className={styles.page}>
        <Container>
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <Section className={styles.sectionWrapper}>
              <EcosystemStatusHero />
            </Section>
          </motion.div>

          <motion.div
            className={styles.visualizationSection}
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Ecosystem3DVisualization />
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <Section className={styles.sectionWrapper}>
              <MetricsDashboard />
            </Section>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Section className={styles.sectionWrapper}>
              <ProjectsGrid />
            </Section>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Section className={styles.sectionWrapper}>
              <TechnologyStack />
            </Section>
          </motion.div>
        </Container>
      </div>
    </DynamicLighting>
  );
}
