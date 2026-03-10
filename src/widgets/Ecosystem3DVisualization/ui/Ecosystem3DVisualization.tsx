'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Ecosystem3D } from '@/shared/ui/Ecosystem3D/Ecosystem3D';
import { ecosystemProjects } from '@/shared/lib/ecosystem-data';
import { CATEGORIES, CLUSTERS, CORE_COMPONENTS, ClusterId } from '@/shared/types/ecosystem';
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
 * Cluster-based position calculation.
 * Projects are placed within their cluster's sphere, distributed evenly.
 */
function calculatePosition(
  project: typeof ecosystemProjects[0],
  indexInCluster: number,
  clusterCount: number,
): [number, number, number] {
  const clusterId = project.cluster as ClusterId | undefined;
  const cluster = clusterId ? CLUSTERS[clusterId] : null;

  if (!cluster) {
    // Fallback: place at origin
    return [0, 0, 0];
  }

  // Core projects get fixed positions near cluster center
  if (project.isCore) {
    if (project.id === 'dsp') return [cluster.position[0], cluster.position[1] + 0.2, cluster.position[2]];
    if (project.id === 'gprod') return [cluster.position[0], cluster.position[1] + 0.1, cluster.position[2] + 0.3];
    return cluster.position;
  }

  // Distribute non-core projects around the cluster center
  // Use golden angle distribution for even spacing within sphere
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.399
  const theta = goldenAngle * indexInCluster;
  const r = cluster.radius * 0.6 * (0.5 + (indexInCluster / Math.max(clusterCount, 1)) * 0.5);
  const phi = Math.acos(1 - 2 * ((indexInCluster + 0.5) / Math.max(clusterCount, 1)));

  return [
    cluster.position[0] + r * Math.sin(phi) * Math.cos(theta),
    cluster.position[1] + r * Math.cos(phi) * 0.6, // Flatten vertically
    cluster.position[2] + r * Math.sin(phi) * Math.sin(theta),
  ];
}

export function Ecosystem3DVisualization() {
  const { projectsFor3D, clustersFor3D } = useMemo(() => {
    // Count projects per cluster
    const clusterIndices = new Map<string, number>();
    const clusterCounts = new Map<string, number>();

    ecosystemProjects.forEach(p => {
      if (!p.isCore && p.cluster) {
        clusterCounts.set(p.cluster, (clusterCounts.get(p.cluster) ?? 0) + 1);
      }
    });

    const projects = ecosystemProjects.map((project) => {
      let indexInCluster = 0;
      if (!project.isCore && project.cluster) {
        indexInCluster = clusterIndices.get(project.cluster) ?? 0;
        clusterIndices.set(project.cluster, indexInCluster + 1);
      }

      const position = calculatePosition(
        project,
        indexInCluster,
        clusterCounts.get(project.cluster ?? '') ?? 1,
      );

      return {
        id: project.id,
        name: project.shortName,
        status: project.status as 'production' | 'development' | 'testnet',
        category: project.category,
        cluster: project.cluster,
        categoryColor: CATEGORIES[project.category].color,
        isCore: project.isCore,
        connections: project.connections ?? [],
        position,
      };
    });

    const clusters = Object.values(CLUSTERS).map(c => ({
      id: c.id,
      name: c.name,
      color: c.color,
      position: c.position,
      radius: c.radius,
    }));

    return { projectsFor3D: projects, clustersFor3D: clusters };
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
        {ecosystemProjects.length} проектов в 7 кластерах — наведите на узлы, чтобы раскрыть архитектуру
      </motion.p>

      <div className={styles.canvasContainer}>
        <Ecosystem3D
          projects={projectsFor3D}
          coreComponents={CORE_COMPONENTS}
          clusters={clustersFor3D}
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
          <span className={styles.legendLabel}>Кластеры</span>
          {Object.values(CLUSTERS).map((cluster) => (
            <motion.div
              key={cluster.id}
              className={styles.legendItem}
              variants={legendItemVariants}
            >
              <div
                className={styles.legendDot}
                style={{
                  background: cluster.color,
                  borderColor: cluster.color,
                  boxShadow: `0 0 6px ${cluster.color}60`,
                  borderRadius: '3px',
                }}
              />
              <span>{cluster.name}</span>
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
