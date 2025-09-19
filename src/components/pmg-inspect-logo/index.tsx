import { Heading } from '@radix-ui/themes';
import Image from 'next/image';
import styles from './style.module.css';
const PmgInspectLogo = () => {
  return (
    <Heading size="6" weight={'light'} as="h2" className={styles.root}>
      <Image src="/assets/pmg_logo.avif" alt="PMG" width={70} height={70} />
      <div className={styles.textContainer}>
        <span className={styles.inspectText}>Inspect</span>
        <span className={styles.versionText}>0.4.0</span>
      </div>
    </Heading>
  );
};

export { PmgInspectLogo };
