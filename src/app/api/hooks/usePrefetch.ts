import { useEffect } from 'react';
import { api } from '~/trpc/react';

export function usePrefetch() {
  const utils = api.useUtils();

  const prefetchOrganisations = () => {
    console.log('Prefetching organisations...');
    utils.organisation.getAllOrganisations.prefetch()
      .then(() => console.log('Organisations prefetched successfully'))
      .catch((error) => console.error('Error prefetching organisations:', error));
  };

  const prefetchStudents = () => {
    console.log('Prefetching students...');
    utils.student.getAllStudents.prefetch()
      .then(() => console.log('Students prefetched successfully'))
      .catch((error) => console.error('Error prefetching students:', error));
  };

  return {
    prefetchOrganisations,
    prefetchStudents,
  };
}
