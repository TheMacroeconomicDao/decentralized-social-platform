'use client';

import { motion } from 'framer-motion';
import { ecosystemMetrics, getProjectsByStatus, getProjectsByCategory } from '@/shared/lib/ecosystem-data';
import { CATEGORIES } from '@/shared/types/ecosystem';
import styles from './MetricsDashboard.module.scss';

const barVariants = {
  hidden: { width: '0%' },
  visible: (width: string) => ({
    width,
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as const, delay: 0.3 },
  }),
};

export function MetricsDashboard() {
  const productionProjects = getProjectsByStatus('production');
  const developmentProjects = getProjectsByStatus('development');
  const testnetProjects = getProjectsByStatus('testnet');

  const statusBars = [
    {
      label: 'Production',
      count: productionProjects.length,
      width: `${(productionProjects.length / ecosystemMetrics.totalProjects) * 100}%`,
      className: 'production' as const,
    },
    {
      label: 'Development',
      count: developmentProjects.length,
      width: `${(developmentProjects.length / ecosystemMetrics.totalProjects) * 100}%`,
      className: 'development' as const,
    },
    {
      label: 'Testnet',
      count: testnetProjects.length,
      width: `${(testnetProjects.length / ecosystemMetrics.totalProjects) * 100}%`,
      className: 'testnet' as const,
    },
  ];

  const categoryBreakdown = Object.values(CATEGORIES).map((cat) => ({
    name: cat.name,
    color: cat.color,
    count: getProjectsByCategory(cat.id).length,
  }));

  return (
    <div className={styles.dashboard}>
      <div className={styles.bentoGrid}>
        <motion.div
          className={styles.statusPanel}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        >
          <h3 className={styles.panelTitle}>Status Distribution</h3>
          <div className={styles.progressBars}>
            {statusBars.map((bar) => (
              <div key={bar.className} className={styles.progressItem}>
                <div className={styles.progressLabel}>
                  <span>{bar.label}</span>
                  <span className={styles.progressCount}>{bar.count}</span>
                </div>
                <div className={styles.progressBar}>
                  <motion.div
                    className={`${styles.progressFill} ${styles[bar.className]}`}
                    variants={barVariants}
                    custom={bar.width}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className={styles.categoryPanel}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.1 }}
        >
          <h3 className={styles.panelTitle}>By Category</h3>
          <div className={styles.categoryList}>
            {categoryBreakdown.map((cat) => (
              <div key={cat.name} className={styles.categoryItem}>
                <span
                  className={styles.categoryDot}
                  style={{ background: cat.color }}
                />
                <span className={styles.categoryName}>{cat.name}</span>
                <span className={styles.categoryCount}>{cat.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
