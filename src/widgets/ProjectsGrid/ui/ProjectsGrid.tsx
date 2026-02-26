'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ecosystemProjects, getProjectsByCategory } from '@/shared/lib/ecosystem-data';
import { CATEGORIES, ProjectCategory } from '@/shared/types/ecosystem';
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
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } },
};

export function ProjectsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');

  const categories = Object.values(CATEGORIES);
  const displayedProjects = selectedCategory === 'all'
    ? ecosystemProjects
    : getProjectsByCategory(selectedCategory);

  return (
    <div className={styles.grid}>
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        Ecosystem Projects
      </motion.h2>

      <motion.div
        className={styles.categoryFilters}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
      >
        <button
          className={`${styles.filterButton} ${selectedCategory === 'all' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Projects
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
      </motion.div>

      <div className={styles.projectsContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className={styles.projectsGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {displayedProjects.map((project, i) => (
              <motion.div
                key={project.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {displayedProjects.length === 0 && (
          <div className={styles.empty}>
            <p>No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
}
