'use client';

import { motion } from 'framer-motion';
import { getAllTechnologies } from '@/shared/lib/ecosystem-data';
import styles from './TechnologyStack.module.scss';

const categoryVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 200, damping: 20 },
  },
};

const tagContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.1 },
  },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
  },
};

export function TechnologyStack() {
  const technologies = getAllTechnologies();

  const frontend = technologies.filter(tech =>
    tech.includes('React') || tech.includes('Next.js') || tech.includes('TypeScript') ||
    tech.includes('Tailwind') || tech.includes('SCSS') || tech.includes('Framer')
  );

  const backend = technologies.filter(tech =>
    tech.includes('NestJS') || tech.includes('Node.js') || tech.includes('Go') ||
    tech.includes('Python') || tech.includes('Bun') || tech.includes('Hono')
  );

  const blockchain = technologies.filter(tech =>
    tech.includes('Solidity') || tech.includes('BSC') || tech.includes('NEAR') ||
    tech.includes('Substrate') || tech.includes('Rust') || tech.includes('DAML')
  );

  const database = technologies.filter(tech =>
    tech.includes('PostgreSQL') || tech.includes('Redis') || tech.includes('Prisma') ||
    tech.includes('Drizzle') || tech.includes('ObjectBox') || tech.includes('CockroachDB')
  );

  const infrastructure = technologies.filter(tech =>
    tech.includes('Docker') || tech.includes('Kubernetes') || tech.includes('IPFS') ||
    tech.includes('gRPC') || tech.includes('Kafka') || tech.includes('Firebase')
  );

  const aiMl = technologies.filter(tech =>
    tech.includes('Puter.js') || tech.includes('GPT') || tech.includes('Claude') ||
    tech.includes('OpenAI') || tech.includes('DALL-E') || tech.includes('Grok')
  );

  const other = technologies.filter(tech =>
    !frontend.includes(tech) &&
    !backend.includes(tech) &&
    !blockchain.includes(tech) &&
    !database.includes(tech) &&
    !infrastructure.includes(tech) &&
    !aiMl.includes(tech)
  );

  const techCategories = {
    'Frontend': frontend,
    'Backend': backend,
    'Blockchain': blockchain,
    'Database': database,
    'Infrastructure': infrastructure,
    'AI/ML': aiMl,
    'Other': other,
  };

  return (
    <div className={styles.stack}>
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring' as const, stiffness: 200, damping: 20 }}
      >
        Technology Stack
      </motion.h2>
      <motion.p
        className={styles.subtitle}
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring' as const, stiffness: 200, damping: 20, delay: 0.1 }}
      >
        {technologies.length}+ modern technologies powering the ecosystem
      </motion.p>

      <div className={styles.categories}>
        {Object.entries(techCategories).map(([category, techs]) => {
          if (techs.length === 0) return null;

          return (
            <motion.div
              key={category}
              className={styles.category}
              variants={categoryVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className={styles.categoryTitle}>{category}</h3>
              <motion.div
                className={styles.techGrid}
                variants={tagContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {techs.map((tech, index) => (
                  <motion.div
                    key={index}
                    className={styles.techItem}
                    variants={tagVariants}
                    whileHover={{
                      scale: 1.08,
                      y: -3,
                      transition: { type: 'spring' as const, stiffness: 400, damping: 15 },
                    }}
                  >
                    {tech}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
