import { RefObject } from 'react';

const selectAllCheckboxHandler = ({
  tBodyRef,
  checkedRowIdsRef,
  projectItems,
}: {
  tBodyRef: RefObject<HTMLTableSectionElement | null>;
  checkedRowIdsRef: RefObject<Set<string>>;
  projectItems: Array<{ video_url: string }>;
}) => {
  const updateAllCheckboxes = (isChecked: boolean) => {
    checkedRowIdsRef.current = new Set(
      isChecked ? projectItems.map((item) => item.video_url) : [],
    );

    tBodyRef
      .current!.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"][data-component-id="row-select-checkbox"]',
      )
      .forEach((checkbox) => {
        checkbox.checked = isChecked;

        if (isChecked) {
          checkedRowIdsRef.current.add(checkbox.value);
        } else {
          checkedRowIdsRef.current.delete(checkbox.value);
        }
      });
  };

  return {
    updateAllCheckboxes,
  };
};

export { selectAllCheckboxHandler };
