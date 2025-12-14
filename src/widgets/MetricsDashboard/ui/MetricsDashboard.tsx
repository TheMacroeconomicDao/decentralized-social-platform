'use client';

import { ecosystemProjects, ecosystemMetrics } from '@/shared/lib/ecosystem-data';
import { getProjectsByStatus } from '@/shared/lib/ecosystem-data';
import { AnimatedCounter } from '@/shared/ui/AnimatedCounter';
import styles from './MetricsDashboard.module.scss';

export function MetricsDashboard() {
  const productionProjects = getProjectsByStatus('production');
  const developmentProjects = getProjectsByStatus('development');
  const testnetProjects = getProjectsByStatus('testnet');

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>Ключевые метрики экосистемы</h2>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>🚀</div>
          <div className={styles.metricValue}>
            <AnimatedCounter end={productionProjects.length} />
          </div>
          <div className={styles.metricLabel}>Production Ready</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>⚙️</div>
          <div className={styles.metricValue}>
            <AnimatedCounter end={developmentProjects.length} />
          </div>
          <div className={styles.metricLabel}>В разработке</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>🧪</div>
          <div className={styles.metricValue}>
            <AnimatedCounter end={testnetProjects.length} />
          </div>
          <div className={styles.metricLabel}>Testnet</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>💻</div>
          <div className={styles.metricValue}>
            <AnimatedCounter end={ecosystemMetrics.technologies} suffix="+" />
          </div>
          <div className={styles.metricLabel}>Технологий</div>
        </div>
      </div>

      <div className={styles.statusBreakdown}>
        <h3 className={styles.subtitle}>Распределение по статусам</h3>
        <div className={styles.progressBars}>
          <div className={styles.progressItem}>
            <div className={styles.progressLabel}>
              <span>Production</span>
              <span>{productionProjects.length}</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${styles.production}`}
                style={{ width: `${(productionProjects.length / ecosystemMetrics.totalProjects) * 100}%` }}
              />
            </div>
          </div>

          <div className={styles.progressItem}>
            <div className={styles.progressLabel}>
              <span>Development</span>
              <span>{developmentProjects.length}</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${styles.development}`}
                style={{ width: `${(developmentProjects.length / ecosystemMetrics.totalProjects) * 100}%` }}
              />
            </div>
          </div>

          <div className={styles.progressItem}>
            <div className={styles.progressLabel}>
              <span>Testnet</span>
              <span>{testnetProjects.length}</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={`${styles.progressFill} ${styles.testnet}`}
                style={{ width: `${(testnetProjects.length / ecosystemMetrics.totalProjects) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
