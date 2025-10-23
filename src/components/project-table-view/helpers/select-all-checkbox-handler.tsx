import { RefObject } from 'react';

const selectAllCheckboxHandler = ({
  tBodyRef,
  checkedRowIdsRef,
  projectItems,
  selectAllCheckboxRef,
}: {
  tBodyRef: RefObject<HTMLTableSectionElement | null>;
  checkedRowIdsRef: RefObject<Set<string>>;
  projectItems: Array<{ video_url: string }>;
  selectAllCheckboxRef: RefObject<HTMLInputElement | null>;
}) => {
  const updateAllConfigDropdowns = (updatedCheckedValues: string[]) => {
    tBodyRef
      .current!.querySelectorAll<HTMLSelectElement>(
        'select[data-component-id="configuration-select"]',
      )
      .forEach((selectElement) => {
        // Disable select elements that are not checked
        selectElement.disabled =
          updatedCheckedValues.length > 0 &&
          !updatedCheckedValues.includes(selectElement.dataset['videoId']!);
      });

    selectAllCheckboxRef.current!.checked =
      updatedCheckedValues.length === projectItems.length;
  };

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
    updateAllConfigDropdowns,
  };
};

export { selectAllCheckboxHandler };
