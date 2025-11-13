import { useGlobalState } from '@/src/app/global-state';
import { ExcelIcon } from '@/src/components/custom-icons';
import { exportJSONToExcel } from '@/src/helpers/export-to-excel';
import { getResponseIfSuccesful } from '@/src/helpers/get-response-if-successful';
import { Button, Text } from '@radix-ui/themes';
import { getColumnData } from './helpers';

const ExportTable = () => {
  const augmentedProject = getResponseIfSuccesful(
    useGlobalState((state) => state.augmentedProject),
  );
  if (!augmentedProject || !augmentedProject.items) {
    return null;
  }
  const data = Object.values(augmentedProject.items).map((item) =>
    getColumnData(item),
  );

  // console.log('data', data);

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

  // [
  //   { header: 'Full Name', key: 'name', width: 20 },
  //   { header: 'Email Address', key: 'email', width: 30 },
  //   { header: 'Age', key: 'age', width: 10 },
  // ];
  return (
    <>
      <dt>
        <Text size="2">Export table data:</Text>
      </dt>
      <dd>
        <Button
          variant="ghost"
          size={'1'}
          type="button"
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
      </dd>
    </>
  );
};
export { ExportTable };
