
import Timeline from "../ui/timeLine";
import { mapOrderTrackingToTimeline } from "../../config/tracking/mapOrderTrackingToTimeline";

export default function OrderTrackingTimeline({
    data,
    isLoading,
    isError,
    refetch, }) {


    const steps = data
        ? mapOrderTrackingToTimeline(data?.history ).sort((a, b) => a.order - b.order)
        : [];
 
    return (
        <Timeline
            steps={steps}
            loading={isLoading}
            error={isError ? "Unable to load tracking details" : null}
            onRetry={refetch}
        />
    );
}
