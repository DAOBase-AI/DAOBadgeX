export function isValidEthAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function shortEthAddress(address: string): string {
    const prefix = address.slice(0, 6);
    const suffix = address.slice(-6);
    return `${prefix}...${suffix}`;
}