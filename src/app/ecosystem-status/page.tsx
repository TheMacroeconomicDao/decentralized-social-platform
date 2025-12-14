'use client';

import dynamic from 'next/dynamic';
import { Container } from '@/shared/ui/Container/Container';
import { Section } from '@/shared/ui/Section/Section';
import styles from './page.module.scss';

// Lazy loading для тяжелых компонентов
const EcosystemStatusHero = dynamic(
  () => import('@/widgets/EcosystemStatusHero').then((mod) => ({ default: mod.EcosystemStatusHero })),
  { ssr: false }
);

const Ecosystem3DVisualization = dynamic(
  () => import('@/widgets/Ecosystem3DVisualization').then((mod) => ({ default: mod.Ecosystem3DVisualization })),
  { 
    ssr: false,
    loading: () => <div className={styles.loading}>Загрузка 3D визуализации...</div>
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
    <div className={styles.page}>
      <Container>
        <Section>
          <EcosystemStatusHero />
        </Section>

        <Section className={styles.visualizationSection}>
          <Ecosystem3DVisualization />
        </Section>

        <Section>
          <MetricsDashboard />
        </Section>

        <Section>
          <ProjectsGrid />
        </Section>

        <Section>
          <TechnologyStack />
        </Section>
      </Container>
    </div>
  );
}
