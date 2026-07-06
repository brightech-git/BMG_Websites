import getFooterContent from "../../service/footerCategoryService";
import { useQuery } from "@tanstack/react-query";

export const useFooterContent =() =>
 useQuery({
    queryKey:["footerContent"],
    queryFn:getFooterContent,
    select :(res) => res?.data
 })
 