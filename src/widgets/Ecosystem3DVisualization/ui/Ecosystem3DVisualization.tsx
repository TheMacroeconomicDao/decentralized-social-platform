'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Ecosystem3D } from '@/shared/ui/Ecosystem3D/Ecosystem3D';
import { ecosystemProjects } from '@/shared/lib/ecosystem-data';
import { CATEGORIES, CORE_COMPONENTS } from '@/shared/types/ecosystem';
import styles from './Ecosystem3DVisualization.module.scss';

const legendItems = [
  { label: 'Production', className: 'production' },
  { label: 'Development', className: 'development' },
  { label: 'Testnet', className: 'testnet' },
];

const legendVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.4 },
  },
};

const legendItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } },
};

/**
 * Deterministic position calculation based on category grouping
 * Core projects at center, others arranged by category in sectors
 */
const CATEGORY_ANGLES: Record<string, number> = {
  'ai-content': 0,
  'defi-finance': Math.PI * 0.35,
  'crypto-wallets': Math.PI * 0.7,
  'blockchain-infra': Math.PI * 1.05,
  'web3-apps': Math.PI * 1.4,
  'trading-analytics': Math.PI * 1.6,
  'enterprise-infra': Math.PI * 1.85,
};

function calculatePosition(
  project: typeof ecosystemProjects[0],
  indexInCategory: number,
  categoryCount: number,
): [number, number, number] {
  // Core projects near center
  if (project.isCore) {
    if (project.id === 'dsp') return [0, 0.2, 0];
    if (project.id === 'gprod') return [0.9, -0.1, 0.6];
    return [0, 0, 0];
  }

  const baseAngle = CATEGORY_ANGLES[project.category] ?? 0;
  const hasConnections = (project.connections?.length ?? 0) > 0;

  // Connected projects closer to center, isolated further
  const radius = hasConnections ? 2.5 + indexInCategory * 0.6 : 3.8 + indexInCategory * 0.5;

  // Spread projects within their category sector
  const angleSpread = 0.35;
  const angle = baseAngle + (indexInCategory - (categoryCount - 1) / 2) * angleSpread;

  // Slight height variation based on index
  const height = (indexInCategory % 3 - 1) * 0.5;

  return [
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius,
  ];
}

export function Ecosystem3DVisualization() {
  const projectsFor3D = useMemo(() => {
    // Group by category to know index within category
    const categoryIndices = new Map<string, number>();
    const categoryCounts = new Map<string, number>();

    // Count projects per category (excluding core)
    ecosystemProjects.forEach(p => {
      if (!p.isCore) {
        categoryCounts.set(p.category, (categoryCounts.get(p.category) ?? 0) + 1);
      }
    });

    return ecosystemProjects.map((project) => {
      let indexInCat = 0;
      if (!project.isCore) {
        indexInCat = categoryIndices.get(project.category) ?? 0;
        categoryIndices.set(project.category, indexInCat + 1);
      }

      const position = calculatePosition(
        project,
        indexInCat,
        categoryCounts.get(project.category) ?? 1,
      );

      return {
        id: project.id,
        name: project.shortName,
        status: project.status as 'production' | 'development' | 'testnet',
        category: project.category,
        categoryColor: CATEGORIES[project.category].color,
        isCore: project.isCore,
        connections: project.connections ?? [],
        position,
      };
    });
  }, []);

  return (
    <div className={styles.visualization}>
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        Gybernatomy — Neural Core
      </motion.h2>
      <motion.p
        className={styles.subtitle}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
      >
        5 ядровых компонентов и 14 продуктов — наведите на узлы, чтобы раскрыть архитектуру
      </motion.p>

      <div className={styles.canvasContainer}>
        <Ecosystem3D
          projects={projectsFor3D}
          coreComponents={CORE_COMPONENTS}
          enableControls
          autoRotate
          className={styles.canvas}
        />
      </div>

      <motion.div
        className={styles.legend}
        variants={legendVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className={styles.legendGroup}>
          <span className={styles.legendLabel}>Статус</span>
          {legendItems.map((item) => (
            <motion.div
              key={item.className}
              className={styles.legendItem}
              variants={legendItemVariants}
            >
              <div className={`${styles.legendDot} ${styles[item.className]}`} />
              <span>{item.label}</span>
            </motion.div>
          ))}
        </div>
        <div className={styles.legendGroup}>
          <span className={styles.legendLabel}>Neural Core</span>
          {CORE_COMPONENTS.map((comp) => (
            <motion.div
              key={comp.id}
              className={styles.legendItem}
              variants={legendItemVariants}
            >
              <div
                className={`${styles.legendDot} ${styles.coreItem}`}
                style={{ background: comp.color, borderColor: comp.color, boxShadow: `0 0 8px ${comp.color}80` }}
              />
              <span>{comp.name}</span>
              <span className={styles.legendConcept}>{comp.concept}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
