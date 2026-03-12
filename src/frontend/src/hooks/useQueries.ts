import { useQuery } from "@tanstack/react-query";
import type { Application } from "../backend";
import { useActor } from "./useActor";

export function useApplications() {
  const { actor, isFetching } = useActor();
  return useQuery<Application[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
