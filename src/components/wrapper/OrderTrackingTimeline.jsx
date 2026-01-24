
import Timeline from "../ui/timeLine";
import { useTrackOrderById } from "../../hook/order/useOrderTracking";
import { mapOrderTrackingToTimeline } from "../../config/tracking/mapOrderTrackingToTimeline";

export default function OrderTrackingTimeline({ orderId }) {

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useTrackOrderById(orderId);

    console.log(orderId ,'trackingData');
    

    const steps = data
        ? mapOrderTrackingToTimeline(data).sort((a, b) => a.order - b.order)
        : [];

        console.log(steps ,'trackingDetails')
    return (
        <Timeline
            steps={steps}
            loading={isLoading}
            error={isError ? "Unable to load tracking details" : null}
            onRetry={refetch}
        />
    );
}
