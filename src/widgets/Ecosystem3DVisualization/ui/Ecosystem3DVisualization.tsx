'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Ecosystem3D } from '@/shared/ui/Ecosystem3D/Ecosystem3D';
import { ecosystemProjects } from '@/shared/lib/ecosystem-data';
import { CATEGORIES } from '@/shared/types/ecosystem';
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

export function Ecosystem3DVisualization() {
  const projectsFor3D = useMemo(() => {
    return ecosystemProjects.map((project, index) => {
      const angle = (index / ecosystemProjects.length) * Math.PI * 2;
      const radius = 3 + (index % 3) * 0.5;
      const height = Math.sin(angle * 2) * 1.5;

      const status: 'production' | 'development' =
        project.status === 'production' ? 'production' : 'development';

      return {
        id: project.id,
        name: project.shortName,
        status,
        category: project.category,
        categoryColor: CATEGORIES[project.category].color,
        connections: project.connections ?? [],
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius,
        ] as [number, number, number],
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
        3D Ecosystem Visualization
      </motion.h2>
      <motion.p
        className={styles.subtitle}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
      >
        Interactive 3D model of interconnected Gybernaty ecosystem projects
      </motion.p>

      <div className={styles.canvasContainer}>
        <Ecosystem3D
          projects={projectsFor3D}
          enableControls={true}
          autoRotate={true}
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
      </motion.div>
    </div>
  );
}
