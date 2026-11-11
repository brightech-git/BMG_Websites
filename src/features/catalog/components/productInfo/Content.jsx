import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductInfo from "./ProductInfo";

export default function Content() {
    const { tagKey } = useParams();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    return (
        <ProductInfo
            key={tagKey}
            tagKey={tagKey}
            Authenticated={isAuthenticated}
        />
    );
}
