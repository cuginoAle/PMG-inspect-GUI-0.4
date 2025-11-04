import { GetProjectResponse, ProjectItem } from '@/src/types';

// Seeded random number generator for consistent random values
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate mock project data with a specified number of items
const generateMockProject = (
  projectPath: string,
  itemsCount: number,
): GetProjectResponse => {
  const items: Record<string, ProjectItem> = {};

  for (let i = 0; i < itemsCount; i++) {
    const videoUrl = `/mock/videos/video_${i.toString().padStart(4, '0')}.mp4`;
    items[videoUrl] = {
      video_name: `video_${i.toString().padStart(4, '0')}.mp4`,
      video_url: videoUrl,
      video_file: `/path/to/video_${i}.mp4`,
      video_status: 'ready',
      road_data: {
        road_name: `Road ${i}`,
        road_section: `Section ${Math.floor(i / 10)}`,
        road_from: `From ${i}`,
        road_to: `To ${i + 1}`,
        road_width: 3.5 + (i % 5) * 0.5,
        road_length: 100 + (i % 50) * 10,
        road_area: (3.5 + (i % 5) * 0.5) * (100 + (i % 50) * 10),
        road_lanes: 2 + (i % 3),
        road_functional_class: i % 2 === 0 ? 'arterial' : 'collector',
        road_surface: i % 3 === 0 ? 'asphalt' : 'concrete',
        road_shoulder: i % 2 === 0 ? 'curb' : 'cg',
        inspector_pci: 50 + (i % 50),
      },
      media_data: {
        fps: 30,
        frame_count: 1800 + (i % 600),
        video_duration_seconds: 60 + (i % 120),
        frame_duration_seconds: 1 / 30,
        frame_width: 1920,
        frame_height: 1080,
      },
      camera_data: {
        model: `GoPro Hero ${5 + (i % 5)}`,
        create_date: new Date(2024, 0, 1 + (i % 30)).toISOString(),
        modify_date: new Date(2024, 0, 1 + (i % 30)).toISOString(),
        digital_zoom_on: i % 2 === 0,
        digital_zoom: 1.0,
        protune: true,
        white_balance: 'auto',
        field_of_view: 'wide',
        electronic_stabilization_on: true,
      },
      gps_points: Object.fromEntries(
        Array.from({ length: 10 }, (_, idx) => [
          idx.toString(),
          {
            latitude:
              45.0 +
              ((i * 10 + idx) / (itemsCount * 10)) * 0.01 +
              (seededRandom((i * 10 + idx) * 1.5) - 0.5) * 0.002,
            longitude:
              9.0 +
              ((i * 10 + idx) / (itemsCount * 10)) * 0.01 +
              (seededRandom((i * 10 + idx) * 2.3) - 0.5) * 0.002,
            altitude: 100 + (i % 50) + idx,
            speed: 30 + (i % 20) + idx * 0.5,
          },
        ]),
      ),
    };
  }

  return {
    status: 'ok',
    detail: {
      project_file: projectPath,
      project_name: `Test Project - 1000 Videos`,
      items,
    },
  };
};

export { generateMockProject };
