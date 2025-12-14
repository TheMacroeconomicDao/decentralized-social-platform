'use client';

import { useState } from 'react';
import { ecosystemProjects, getProjectsByCategory } from '@/shared/lib/ecosystem-data';
import { CATEGORIES, ProjectCategory } from '@/shared/types/ecosystem';
import { ProjectCard } from '@/entities/ProjectCard';
import styles from './ProjectsGrid.module.scss';

export function ProjectsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');

  const categories = Object.values(CATEGORIES);
  const displayedProjects = selectedCategory === 'all' 
    ? ecosystemProjects 
    : getProjectsByCategory(selectedCategory);

  return (
    <div className={styles.grid}>
      <h2 className={styles.title}>Проекты экосистемы</h2>

      <div className={styles.categoryFilters}>
        <button
          className={`${styles.filterButton} ${selectedCategory === 'all' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          Все проекты
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.filterButton} ${selectedCategory === category.id ? styles.active : ''}`}
            onClick={() => setSelectedCategory(category.id)}
            style={{ '--category-color': category.color } as React.CSSProperties}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className={styles.projectsContainer}>
        {displayedProjects.length > 0 ? (
          <div className={styles.projectsGrid}>
            {displayedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>Проекты не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
