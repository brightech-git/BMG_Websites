export const applyTemplate = (text, data) => {
    return text.replace(/#\{(\w+)\}/g, (_, key) => data[key] ?? "");
};