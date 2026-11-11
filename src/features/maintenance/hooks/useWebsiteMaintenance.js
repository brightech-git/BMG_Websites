import { useQuery } from "@tanstack/react-query";
import { getWebsiteMaintenance } from "../api/WebsiteMaintanence";

export function useWebsiteMaintenance() {
    return useQuery({
        queryKey: ["website-maintenance"],
        queryFn: getWebsiteMaintenance,
        retry: false,
        staleTime: 30_000,
        refetchInterval: 60_000,
    });
}
