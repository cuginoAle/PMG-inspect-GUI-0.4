import { useGlobalState } from '@/src/app/global-state';
import { ExcelIcon } from '@/src/components/custom-icons';
import { exportJSONToExcel } from '@/src/helpers/export-to-excel';
import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import { Button, Flex, Heading, IconButton, Separator } from '@radix-ui/themes';
import { getColumnData } from './helpers';
import {
  CodeSandboxLogoIcon,
  Cross1Icon,
  GlobeIcon,
  Share2Icon,
} from '@radix-ui/react-icons';
import styles from './style.module.css';

const ExportTable = ({ onClose }: { onClose: () => void }) => {
  const augmentedProject = getResponseIfSuccesful(
    useGlobalState((state) => state.augmentedProject),
  );
  if (!augmentedProject || !augmentedProject.items) {
    return null;
  }
  const data = Object.values(augmentedProject.items).map((item) =>
    getColumnData(item),
  );

  if (data.length === 0) {
    return null;
  }

  const tableData = data.map((row) => {
    return row.map(([_header, key]) => key);
  });

  const columns = data[0]!.map(([header, _key, width]) => ({
    header: header as string, // TODO: this needs to be mapped against a friendly name dictionary!
    key: header as string,
    width: (width as number) || 20,
  }));

  return (
    <Flex direction="column" gap="4">
      <IconButton
        onClick={onClose}
        size={'2'}
        variant="soft"
        className={styles.closeButton}
        type="button"
      >
        <Cross1Icon width={16} height={16} color="var(--gray-a12)" />
      </IconButton>
      <Flex align="center" gap="2">
        <Share2Icon width={24} height={24} color="var(--gray-11)" />
        <Heading as="h2" size="4" weight="light">
          Export table data:
        </Heading>
      </Flex>

      <Separator orientation="horizontal" size={'4'} />

      <Flex gap="2" align="center" justify="end">
        <Button variant="soft" size={'2'} type="button" color="gray" disabled>
          <GlobeIcon width={18} height={18} />
          GeoJson
        </Button>

        <Button variant="soft" size={'2'} type="button" color="gray" disabled>
          <CodeSandboxLogoIcon width={18} height={18} />
          GeoPackage
        </Button>

        <Button
          variant="soft"
          size={'2'}
          type="button"
          color="gray"
          onClick={() =>
            exportJSONToExcel({
              data: tableData,
              fileName: `${augmentedProject.project_name}.xlsx`,
              columns: columns,
              hyperlinkColumns: [0],
              highlightColumns: [21, 22, 23, 24],
            })
          }
        >
          <ExcelIcon size={1.8} />
          Excel
        </Button>
      </Flex>
    </Flex>
  );
};
export { ExportTable };
