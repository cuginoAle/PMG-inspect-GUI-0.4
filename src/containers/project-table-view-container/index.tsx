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
                const tableHeader = Object.keys(items[0]?.road_data || {}).map(
                  (key) => key.replaceAll('_', ' ').toUpperCase(),
                );

                const tableBody = items.map((item) => {
                  return Object.keys(item.road_data || {}).map((key) => {
                    return item.road_data
                      ? item.road_data[key as keyof typeof item.road_data]
                      : '';
                  });
                });

                return (
                  <>
                    <MyTable
                      header={tableHeader}
                      body={tableBody}
                      onMouseOver={(index) =>
                        setHoveredVideoUrl(
                          index !== undefined
                            ? items[index]?.video_url
                            : undefined,
                        )
                      }
                      onRowClick={(index) => {
                        const item = items[index]!;
                        setVideoUrlToDrawOnTheMap(item.video_url);

                        const urlSearchParams = new URLSearchParams(
                          searchParams.toString(),
                        );
                        urlSearchParams.set('videoUrl', item.video_url);

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
