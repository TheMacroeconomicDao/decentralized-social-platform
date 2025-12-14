'use client';

import { getAllTechnologies } from '@/shared/lib/ecosystem-data';
import styles from './TechnologyStack.module.scss';

export function TechnologyStack() {
  const technologies = getAllTechnologies();

  // Группируем технологии по категориям
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
      <h2 className={styles.title}>Технологический стек</h2>
      <p className={styles.subtitle}>
        {technologies.length}+ современных технологий, используемых в проектах экосистемы
      </p>

      <div className={styles.categories}>
        {Object.entries(techCategories).map(([category, techs]) => {
          if (techs.length === 0) return null;
          
          return (
            <div key={category} className={styles.category}>
              <h3 className={styles.categoryTitle}>{category}</h3>
              <div className={styles.techGrid}>
                {techs.map((tech, index) => (
                  <div key={index} className={styles.techItem}>
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
