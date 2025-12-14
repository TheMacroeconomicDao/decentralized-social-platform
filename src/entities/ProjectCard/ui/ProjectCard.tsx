'use client';

import { EcosystemProject } from '@/shared/types/ecosystem';
import { CATEGORIES } from '@/shared/types/ecosystem';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  project: EcosystemProject;
  onSelect?: (project: EcosystemProject) => void;
}

export function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const category = CATEGORIES[project.category];
  const statusColors = {
    production: '#00f2fe',
    development: '#f5576c',
    testnet: '#ff9800',
  };

  const statusLabels = {
    production: 'Production Ready',
    development: 'В разработке',
    testnet: 'Testnet Ready',
  };

  return (
    <div 
      className={styles.card}
      onClick={() => onSelect?.(project)}
      style={{ '--category-color': category.color } as React.CSSProperties}
    >
      <div className={styles.header}>
        <h3 className={styles.name}>{project.name}</h3>
        <span 
          className={`${styles.status} ${styles[project.status]}`}
          style={{ '--status-color': statusColors[project.status] } as React.CSSProperties}
        >
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
            <span>Прогресс</span>
            <span>{project.progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className={styles.technologies}>
        <div className={styles.techLabel}>Технологии:</div>
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
