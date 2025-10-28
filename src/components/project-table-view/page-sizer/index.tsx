import { Flex, Text } from '@radix-ui/themes';
import { Slider } from '@/src/components';
import { useGlobalState } from '@/src/app/global-state';
import { useDebounce } from '@/src/hooks/useDebounce';
import React from 'react';

const PageSizer = ({
  min = 10,
  max = 60,
  step = 5,
}: {
  min: number;
  max: number;
  step: number;
}) => {
  const [pageSize, setPageSize] = React.useState<number>(10);

  const setPaginationPageSize = useDebounce(
    useGlobalState((state) => state.setPaginationPageSize),
    300,
  );

  React.useEffect(() => {
    setPaginationPageSize(pageSize);
  }, [pageSize, setPaginationPageSize]);

  return (
    <Flex align="center" direction={'column'}>
      <Text size={'1'} style={{ whiteSpace: 'nowrap', marginBottom: '-8px' }}>
        Page size: <strong>{pageSize}</strong>
      </Text>
      <Slider
        name="pageSize"
        min={min}
        max={max}
        step={step}
        onChange={setPageSize}
        defaultValue={pageSize}
      />
    </Flex>
  );
};

export { PageSizer };
