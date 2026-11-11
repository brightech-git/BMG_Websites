import publicUrl from "../../../api/publicUrl";

export async function getWebsiteMaintenance() {
    const { data } = await publicUrl.get("/website-maintenance" ,{
        timeout: 5000,
        skipErrorToast: true,
    });
    console.log(data.find((entry) => console.log(entry,"datadatadata")) ?? null,'datadatadata')
    if (!Array.isArray(data)) {
        throw new Error("Unexpected maintenance response.");
    }

    return data.find((entry) => entry?.isMaintenance === false) ?? null;
}
