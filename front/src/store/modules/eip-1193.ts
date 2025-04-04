export interface ConnectInfo {
  chainId: string;
}

export interface RequestArguments {
  method: string;
  params?: unknown[];
}

export interface ProviderMessage {
  type: string;
  data: unknown;
}

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}
