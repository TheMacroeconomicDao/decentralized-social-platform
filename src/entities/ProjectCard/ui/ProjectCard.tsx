'use client';

import { motion } from 'framer-motion';
import { EcosystemProject } from '@/shared/types/ecosystem';
import { CATEGORIES } from '@/shared/types/ecosystem';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  project: EcosystemProject;
  onSelect?: (project: EcosystemProject) => void;
}

const statusLabels: Record<string, string> = {
  production: 'Production',
  development: 'Development',
  testnet: 'Testnet',
};

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const category = CATEGORIES[project.category];

  return (
    <div
      className={styles.card}
      onClick={() => onSelect?.(project)}
      style={{ '--category-color': category.color } as React.CSSProperties}
    >
      <div className={styles.header}>
        <h3 className={styles.name}>{project.name}</h3>
        <span className={`${styles.status} ${styles[project.status]}`}>
          {statusLabels[project.status]}
        </span>
      </div>

      <div className={styles.category}>
        <span className={styles.categoryBadge}>{category.name}</span>
      </div>

      <p className={styles.description}>{project.description}</p>

      {project.progress && project.status === 'development' && (
        <div className={styles.progress}>
          <div className={styles.progressLabel}>
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: '0%' }}
              whileInView={{ width: `${project.progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            />
          </div>
        </div>
      )}

      <div className={styles.technologies}>
        <div className={styles.techLabel}>Technologies:</div>
        <div className={styles.techList}>
          {project.technologies.slice(0, 4).map((tech, index) => (
            <span key={index} className={styles.techTag}>
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className={styles.techTag}>+{project.technologies.length - 4}</span>
          )}
        </div>
      </div>
    </div>
  );
}
