import { useEffect } from 'react';
import { api } from '~/trpc/react';

export function usePrefetch() {
  const utils = api.useUtils();

  const prefetchOrganisations = () => {
    utils.organisation.getAllOrganisations.prefetch();
  };

  const prefetchStudents = () => {
    utils.student.getAllStudents.prefetch();
  };

  return {
    prefetchOrganisations,
    prefetchStudents,
  };
}