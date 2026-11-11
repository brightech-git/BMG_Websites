import Content from "./productInfo/Content";
import { useDocumentMeta } from "../../../utils/meta/useMeta";

export default function ProductDetailPage() {
    useDocumentMeta({
        title: "BMG | Product details",
        description: "View jewellery specifications, pricing, and delivery options.",
    });

    return (
        <div className="[font-family:var(--primary-font)] [&_button]:[font-family:inherit] [&_input]:[font-family:inherit] [&_.font-sans]:[font-family:inherit]">
            <Content />
        </div>
    );
}
