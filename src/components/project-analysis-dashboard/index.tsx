import { useGlobalState } from '@/src/app/global-state';

import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import { Project, ResponseType } from '@/src/types';
import { getFileIconType } from '@/src/helpers/get-file-icon-type';
import { useSearchParams } from 'next/navigation';
import { FileLogoTitle } from '@/src/components/file-logo-title';
import { removeFileExtension } from '@/src/helpers/remove-file-extension';
import { useMemo } from 'react';
import { Button, Flex } from '@radix-ui/themes';
import { NetworkSettings } from 'components/n-network-settings';
import { Cross2Icon, DiscIcon, RocketIcon } from '@radix-ui/react-icons';
import styles from './style.module.css';
import React from 'react';

const ProjectAnalysisDashboard = ({ className }: { className?: string }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const sp = useSearchParams();
  const { selectedProject } = useGlobalState();
  const project = getResponseIfSuccesful<Project>(
    selectedProject.get({ noproxy: true }) as unknown as ResponseType<Project>,
  );

  const fileType = useMemo(() => getFileIconType(sp.get('path') || ''), [sp]);
  const label = useMemo(() => removeFileExtension(sp.get('path') || ''), [sp]);

  return project?.project_name ? (
    <div className={className}>
      <Flex direction={'column'} gap={'4'}>
        <Flex justify={'between'} align="center">
          <FileLogoTitle fileType={fileType} label={label} size="medium" />
          <Button type="button" size={'3'} color="blue" variant="soft">
            <RocketIcon /> Run analysis
          </Button>
        </Flex>

        <form
          className={styles.form}
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            console.log(
              Object.fromEntries(new FormData(e.currentTarget).entries()),
            );
          }}
          onChange={(e: React.ChangeEvent<HTMLFormElement>) => {
            if (e.target.getAttribute('type') !== 'checkbox') {
              setHasUnsavedChanges(true);
            }
          }}
          onReset={(e: React.FormEvent<HTMLFormElement>) => {
            const form = e.target as HTMLFormElement;

            // the reset event happens before the values are reset, so we need to wait a tick
            setTimeout(() => {
              Array.from(form.elements).forEach((el) => {
                el.dispatchEvent(new Event('change', { bubbles: true }));
              });
              setHasUnsavedChanges(false);
            }, 10);
          }}
        >
          <div className={styles.networksContainer}>
            <NetworkSettings name="Road" />
            <NetworkSettings name="Distress" />
            <NetworkSettings name="Weathering" />
            <NetworkSettings name="Treatment" />
          </div>

          <Flex gap="2" justify={'end'}>
            <Button
              type="submit"
              size="3"
              color="green"
              variant="soft"
              disabled={!hasUnsavedChanges}
            >
              <DiscIcon />
              Save
            </Button>

            <Button
              type="reset"
              size="3"
              variant="soft"
              color="orange"
              disabled={!hasUnsavedChanges}
            >
              <Cross2Icon />
              Reset
            </Button>
          </Flex>
        </form>
      </Flex>
    </div>
  ) : null;
};

export { ProjectAnalysisDashboard };
