'use client';
import { useGlobalState } from '@/src/app/global-state';
import { NoProjectSelected } from '@/src/components/no-project-selected';
import { MySuspense } from '@/src/components/my-suspense';
import { useState } from 'react';
import { TransformProjectData } from './transform-project-data';
import { MyTable } from '@/src/components';
import { useDebounce } from '@/src/hooks/useDebounce';
import { useSearchParams } from 'next/navigation';

const ProjectTableViewContainer = () => {
  const searchParams = useSearchParams();

  const setVideoUrlToDrawOnTheMap = useGlobalState(
    (state) => state.setVideoUrlToDrawOnTheMap,
  );
  const setHoveredVideoUrl = useDebounce(
    useGlobalState((state) => state.setHoveredVideoUrl),
    100,
  );
  const selectedProject = useGlobalState((state) => state.selectedProject);
  const projectStatus = useGlobalState((state) => state.projectStatus);
  const [selectedVideoUrlList, setSelectedVideoUrlList] = useState<string[]>(
    [],
  );

  if (!selectedProject) {
    return <NoProjectSelected />;
  }

  return (
    <MySuspense
      data={projectStatus}
      loadingMessage="Loading project status..."
      loadingSize="large"
      errorTitle="Project status"
      undefinedDataComponent="No project status available"
    >
      {(status) => (
        <MySuspense
          data={selectedProject}
          loadingSize="large"
          loadingMessage="Loading project..."
          undefinedDataComponent="No project data available"
        >
          {(project) => (
            <TransformProjectData
              project={project}
              selectedVideoUrlList={selectedVideoUrlList}
            >
              {({
                augmentedProject,
                // onConfigurationChange,
                // handleSetHoveredVideoUrl,
              }) => {
                const items = Object.values(augmentedProject.items || {});
                const tableHeader = [
                  'Select all',
                  ...Object.keys(items[0]?.road_data || {}).map((key) =>
                    key.replaceAll('_', ' ').toLowerCase(),
                  ),
                ];

                const tableBody: [string, React.ReactNode[]][] = items.map(
                  (item) => {
                    return [
                      item.video_url,
                      [
                        <input
                          data-type="row-selector"
                          key={item.video_url}
                          type="checkbox"
                          name={item.video_url}
                          // onClick={(e: React.MouseEvent) => e.stopPropagation()}
                          style={{
                            position: 'relative',
                            zIndex: 2,
                          }}
                        />,
                        ...Object.keys(item.road_data || {}).map((key) => {
                          return item.road_data
                            ? item.road_data[key as keyof typeof item.road_data]
                            : '';
                        }),
                      ],
                    ];
                  },
                );

                return (
                  <>
                    <MyTable
                      defaultSelectedRowId={
                        searchParams.get('videoUrl') || undefined
                      }
                      header={tableHeader}
                      body={tableBody}
                      onMouseOver={(id) => setHoveredVideoUrl(id)}
                      onRowClick={(id) => {
                        // setVideoUrlToDrawOnTheMap(id);

                        const urlSearchParams = new URLSearchParams(
                          searchParams.toString(),
                        );
                        urlSearchParams.set('videoUrl', id);

                        // scrollChildIntoView({
                        //   container: tBodyRef.current!,
                        //   child: tBodyRef.current!.querySelector(
                        //     `[id="${getRowId(item)}"]`,
                        //   )!,
                        //   behavior: 'smooth',
                        //   direction: 'vertical',
                        // });

                        window.history.pushState(
                          null,
                          '',
                          `/protected?${urlSearchParams.toString()}`,
                        );
                      }}
                    />

                    {/* <ProjectTableView
                      processingConfiguration={Object.values(
                        status.processing_configurations || {},
                      )}
                      project={augmentedProject}
                      onMouseOver={handleSetHoveredVideoUrl}
                      onRowCheckbox={setSelectedVideoUrlList}
                      onConfigurationChange={onConfigurationChange}
                      onRowClick={(item) =>
                        setVideoUrlToDrawOnTheMap(item?.video_url)
                      }
                    /> */}
                  </>
                );
              }}
            </TransformProjectData>
          )}
        </MySuspense>
      )}
    </MySuspense>
  );
};

export { ProjectTableViewContainer };
