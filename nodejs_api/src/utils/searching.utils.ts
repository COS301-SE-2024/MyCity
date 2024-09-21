export const capitaliseString = (str: string): string => {
    const result = str.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    return result;
};