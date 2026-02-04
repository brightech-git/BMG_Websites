import dayjs from "dayjs";
import { TRACKING_STATUS_CONFIG } from "./trackingStatusConfig";

export const mapOrderTrackingToTimeline = (history = []) => {
    if (!history.length) return [];

    const sortedHistory = [...history].sort(
        (a, b) => a.sequence - b.sequence
    );

    console.log(sortedHistory, 'sortedHistory')

    return sortedHistory.map((item) => {
        const config = TRACKING_STATUS_CONFIG[item.status] || {};

        return {
            key: item.status,
            title: item.label || config.title || item.status,
            date: item.updated_at
                ? dayjs(item.updated_at).format("DD MMM YYYY, hh:mm A")
                : null,
            description: item.remarks || "",
            icon: config.icon,
            completed: true,           // history = completed steps
            order: item.sequence,      // IMPORTANT
        };
    });
};
