'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { getProjectsByCategory } from '@/shared/lib/ecosystem-data';
import { CATEGORIES, type ProjectCategory } from '@/shared/types/ecosystem';
import { ProjectCard } from '@/entities/ProjectCard';
import styles from './ProjectsGrid.module.scss';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
      delay: i * 0.06,
    },
  }),
};

const categoryOrder: ProjectCategory[] = [
  'ai-content',
  'defi-finance',
  'crypto-wallets',
  'blockchain-infra',
  'web3-apps',
  'trading-analytics',
  'enterprise-infra',
];

export function ProjectsGrid() {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToCategory = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.grid}>
      <motion.div
        className={styles.categoryNav}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {categoryOrder.map((catId) => {
          const cat = CATEGORIES[catId];
          const count = getProjectsByCategory(catId).length;
          return (
            <button
              key={catId}
              className={styles.navButton}
              onClick={() => scrollToCategory(catId)}
              style={{ '--cat-color': cat.color } as React.CSSProperties}
            >
              <span className={styles.navName}>{cat.name}</span>
              <span className={styles.navCount}>{count}</span>
            </button>
          );
        })}
      </motion.div>

      <div className={styles.sections}>
        {categoryOrder.map((catId) => {
          const cat = CATEGORIES[catId];
          const projects = getProjectsByCategory(catId);
          if (projects.length === 0) return null;

          return (
            <motion.div
              key={catId}
              ref={(el) => { sectionRefs.current[catId] = el; }}
              className={styles.categorySection}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              style={{ '--cat-color': cat.color } as React.CSSProperties}
            >
              <div className={styles.categoryHeader}>
                <h3 className={styles.categoryTitle}>{cat.name}</h3>
                <span className={styles.categoryCount}>{projects.length} project{projects.length > 1 ? 's' : ''}</span>
              </div>
              <p className={styles.categoryDesc}>{cat.description}</p>

              <div className={styles.projectsGrid}>
                {projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
