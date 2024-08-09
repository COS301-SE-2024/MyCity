export async function invalidateCache(tag: string) {
    const response = await fetch(`/api/invalidate-cache/${tag}`);

    if (!response.ok) {
        throw new Error(`Error invalidating cache: ${response.statusText}`);
    }

    const result = await response.json();
    const isCacheInvalidated: boolean = result.isCacheInvalidated;
    return isCacheInvalidated;
}