import { Button, Card, Flex, Heading, Link, Text } from '@radix-ui/themes';
import styles from './style.module.css';
import Image from 'next/image';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { version } from '@/package.json';

const Greetings = () => {
  return (
    <div className={`${styles.root} center`}>
      <div className={styles.content}>
        <Image
          src="/assets/pmg_logo.avif"
          alt="PMG"
          width={220}
          height={220}
          className={styles.logo}
        />

        <Card>
          <Flex direction="column" gap="6" p="6">
            <Heading as="h1" size="8" className={styles.title}>
              <strong>P</strong>avement <strong>C</strong>
              ondition <strong>I</strong>nspector
            </Heading>
            <ul>
              <li>
                <CheckCircledIcon />
                <span>
                  Run distress and severity analysis on road videos/images
                </span>
              </li>
              <li>
                <CheckCircledIcon />
                <span>View geolocated PCI scores on a live map</span>
              </li>
              <li>
                <CheckCircledIcon />
                <span>Explore annotated frames and export results</span>
              </li>
            </ul>
          </Flex>
        </Card>

        <div className={styles.actions}>
          <Button variant="classic" size="4" asChild>
            <Link href="/protected">Get Started</Link>
          </Button>
        </div>
        <Text as="p" className={styles.version}>
          ver {version}
        </Text>
      </div>
    </div>
  );
};

export { Greetings };
