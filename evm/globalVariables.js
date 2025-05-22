let fpexpbalance;
let discount;

// Your pre-determined admin address and fee percentage
const ADMIN_ADDRESS = "0x5f3a3d70f12Cd121aB6C0EEBe71fC9f4E3465a74";
let ADMIN_FEE_PERCENTAGE = 10;
let FIXED_ADMIN_FEE_ETH = 0.01;
let FIXED_ADMIN_FEE_WEI = ethers.utils.parseEther(FIXED_ADMIN_FEE_ETH.toString());
const DECIMALS = 18; // Assuming 18 decimals for the token

let isConnected = false;
let signerAddress = null;
let provider = null;
let EVM = null;