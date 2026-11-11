import { useSearchParams } from "react-router-dom";
import Breadcrumbs from "../../../components/layouts/Breadcrumbs";
import { useDocumentMeta } from "../../../utils/meta/useMeta";
import Content from "./productsPage/Content";

export default function ProductsPage() {
    const [params] = useSearchParams();

    useDocumentMeta({
        title: "BMG | Shop jewellery",
        description: "Browse and filter jewellery from BMG Jewellers.",
    });

    return (
        <>
            <Breadcrumbs
                itemId={params.get("itemId")}
                pages="products-page"
                subItemId={params.get("subItemId")}
                filterId={params.get("filterIds")}
            />
            <Content ItemName={params.get("itemName")} />
        </>
    );
}
