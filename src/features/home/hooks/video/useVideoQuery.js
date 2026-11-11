import { useQuery } from "@tanstack/react-query";
import { getVideos } from "../../api/VideoService";

export const useVideos = () => {
    return useQuery({
        queryKey: ["videos"],
        queryFn: getVideos,
    });
};
