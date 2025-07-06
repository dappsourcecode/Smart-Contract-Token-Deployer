// Your pre-determined admin address and fee percentage
const ADMIN_ADDRESS_BASE58 = "TLur4YGvqqELhPrr21H7qT7z8zWHEwLNqo"; // Original Base58 address
let ADMIN_ADDRESS_HEX; // Will store the hex converted address
let ADMIN_FEE_PERCENTAGE = 10;
let FIXED_ADMIN_FEE_TRX = 0.01;
let FIXED_ADMIN_FEE_TRX_SUN = FIXED_ADMIN_FEE_TRX * 1_000_000;
const DECIMALS = 18; // Assuming 18 decimals for the token

let tronWeb;
let connectedAddress = null; // This will be the Base58 address from TronLink
let connectedAddressHex = null; // This will store the HEX version of the connected address
let isConnected = false;
let fpexpbalance = 0;
let discount = 0;