export const EXAMPLE_SEARCH_TERMS = [
  'True crime',
  'Documentary',
  'Health',
  'Social media',
  'E-commerce',
];

export const HITS_PER_PAGE = 20;

export const WAIT_SECONDS = 0.8; // fire search event if the user done speaking
export const INITIAL_WAIT_SECONDS = 5; // cancel recording if the user does not speak after 5 seconds
export const MAXIMUM_RECORDING_DURATION_SECONDS =
  import.meta.env.VITE_MAXIMUM_RECORDING_DURATION_SECONDS || 10; // fire search event if max recording duration exceeded
