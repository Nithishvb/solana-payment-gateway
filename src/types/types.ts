export interface ISwapPreview {
  inputAmount: number;
  inputToken: string;
  outputAmount: number;
  outputToken: string;
  networkFee: number;
  slippage: number;
}
