'use client';

import { useMemo, useState } from 'react';
import { Ecosystem3D } from '@/shared/ui/Ecosystem3D/Ecosystem3D';
import { ecosystemProjects } from '@/shared/lib/ecosystem-data';
import { EcosystemProject } from '@/shared/types/ecosystem';
import styles from './Ecosystem3DVisualization.module.scss';

export function Ecosystem3DVisualization() {
  const [selectedProject, setSelectedProject] = useState<EcosystemProject | null>(null);

  // Преобразуем данные проектов в формат для Ecosystem3D
  const projectsFor3D = useMemo(() => {
    return ecosystemProjects.map((project, index) => {
      // Распределяем проекты по орбитам вокруг центра
      const angle = (index / ecosystemProjects.length) * Math.PI * 2;
      const radius = 3 + (index % 3) * 0.5; // Разные орбиты
      const height = Math.sin(angle * 2) * 1.5; // Волнообразное распределение

      // Преобразуем статус: testnet -> development для Ecosystem3D
      const status: 'production' | 'development' = project.status === 'production' ? 'production' : 'development';

      return {
        id: index + 1,
        name: project.shortName,
        status: status as 'production' | 'development',
        category: project.category,
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
      <h2 className={styles.title}>3D Визуализация экосистемы</h2>
      <p className={styles.subtitle}>
        Интерактивная 3D модель взаимосвязей проектов экосистемы Gybernaty
      </p>

      <div className={styles.canvasContainer}>
        <Ecosystem3D
          projects={projectsFor3D}
          enableControls={true}
          autoRotate={true}
          className={styles.canvas}
        />
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.production}`} />
          <span>Production Ready</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.development}`} />
          <span>В разработке</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.testnet}`} />
          <span>Testnet</span>
        </div>
      </div>

      {selectedProject && (
        <div className={styles.projectInfo}>
          <h3>{selectedProject.name}</h3>
          <p>{selectedProject.description}</p>
          <button 
            className={styles.closeButton}
            onClick={() => setSelectedProject(null)}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
