// Constants
const jettonMinterWithFeeCodeBOC = "te6ccgECDwEAAwAAART/APSkE/S88sgLAQIBYgIDAgLMBAUCA3pgDQ4E7dkGOASS+B8ADoaYGAuNhJL4HwfSB9IBj9ABi465D9ABj9ABgBaY/pn/aiaH0AfSBqahhACqk4XXGBQQg97svvKThdcYFBCBY7XLmpOF1xgRqbm5HgAccNGaga44L5cCSB/SAYLOQoAn0BLGeLZmZk9qpwGoFgAkBgcICQCTtfBQiAbgqEAmqCgHkKAJ9ASxniwDni2ZkkWRlgIl6AHoAZYBkkHyAODpkZYFlA+X/5Og7wAxkZYKsZ4soAn0BCeW1iWZmZLj9gEB/jY3N1FGxwXy4En6QPoA1DAg0IBg1yH6ADHTBzAijQwVVFCRjBrOGJrZmJPYXo0aEJnUDJ2MENfbHAySTR6aWZVVEVjMEhpNS1yaGR1eWJYgAoBkqYRTMKEnEDZAFPAKghAXjUUZyMsfFMs/I/oC+CjPFm3PFnD6Am3PFslUREQKAcA2NzcB+gD6QPgoVBIGcFQgE1QUA8hQBPoCWM8WAc8WzMkiyMsBEvQA9ADLAMn5AHB0yMsCygfL/8nQUAbHBfLgSqEDRUXIUAT6AljPFszMye1UAfpAMCDXCwHDAJFb4w0LAf42XwOCCJiWgBWgFbzy4EsC+kDTADCVyCHPFsmRbeKCENFzVABwgBjIywVQBc8WJPoCFMtqE8sfFMs/I/pEMHC6jjP4KEQDcFQgE1QUA8hQBPoCWM8WAc8WzMkiyMsBEvQA9ADLAMn5AHB0yMsCygfL/8nQzxaWbCJwAcsB4vQADABCjhhRJMcF8uBJ1DBDAMhQBPoCWM8WzMzJ7VTgXwWED/LwACbwChKgVSDIUAT6AljPFszMye1UAD6CENUydttwgBDIywVQA88WIvoCEstqyx/LP8mAQvsAAArJgED7AAB9rbz2omh9AH0gamoYNhj8FAC4KhAJqgoB5CgCfQEsZ4sA54tmZJFkZYCJegB6AGWAZPyAODpkZYFlA+X/5OhAAB+vFvaiaH0AfSBqahg/qpBA";
const jettonMinterWithFeeCodeABI = {"name":"contracts/jetton-minter-with-fee","getters":[{"returnTypes":["int","int","slice","cell","cell"],"name":"get_jetton_data","parameters":[]},{"returnTypes":["slice"],"name":"get_wallet_address","parameters":[{"type":"slice","name":"owner_address"}]}],"setters":[]};
const jettonWalletCodeBOC = "te6ccgECEQEAAyMAART/APSkE/S88sgLAQIBYgIDAgLMBAUAG6D2BdqJofQB9IH0gahhAgHUBgcCASAICQDDCDHAJJfBOAB0NMDAXGwlRNfA/AM4PpA+kAx+gAxcdch+gAx+gAwc6m0AALTH4IQD4p+pVIgupUxNFnwCeCCEBeNRRlSILqWMUREA/AK4DWCEFlfB7y6k1nwC+BfBIQP8vCAAET6RDBwuvLhTYAIBIAoLAIPUAQa5D2omh9AH0gfSBqGAJpj8EIC8aijKkQXUEIPe7L7wndCVj5cWLpn5j9ABgJ0CgR5CgCfQEsZ4sA54tmZPaqQB8VA9M/+gD6QCHwAe1E0PoA+kD6QNQwUTahUirHBfLiwSjC//LiwlQ0QnBUIBNUFAPIUAT6AljPFgHPFszJIsjLARL0APQAywDJIPkAcHTIywLKB8v/ydAE+kD0BDH6ACDXScIA8uLEd4AYyMsFUAjPFnD6AhfLaxPMgMAgEgDQ4AnoIQF41FGcjLHxnLP1AH+gIizxZQBs8WJfoCUAPPFslQBcwjkXKRceJQCKgToIIJycOAoBS88uLFBMmAQPsAECPIUAT6AljPFgHPFszJ7VQC9ztRND6APpA+kDUMAjTP/oAUVGgBfpA+kBTW8cFVHNtcFQgE1QUA8hQBPoCWM8WAc8WzMkiyMsBEvQA9ADLAMn5AHB0yMsCygfL/8nQUA3HBRyx8uLDCvoAUaihggiYloBmtgihggiYloCgGKEnlxBJEDg3XwTjDSXXCwGAPEADXO1E0PoA+kD6QNQwB9M/+gD6QDBRUaFSSccF8uLBJ8L/8uLCBYIJMS0AoBa88uLDghB73ZfeyMsfFcs/UAP6AiLPFgHPFslxgBjIywUkzxZw+gLLaszJgED7AEATyFAE+gJYzxYBzxbMye1UgAHBSeaAYoYIQc2LQnMjLH1Iwyz9Y+gJQB88WUAfPFslxgBDIywUkzxZQBvoCFctqFMzJcfsAECQQIwB8wwAjwgCwjiGCENUydttwgBDIywVQCM8WUAT6AhbLahLLHxLLP8ly+wCTNWwh4gPIUAT6AljPFgHPFszJ7VQ=";
const jettonWalletCodeABI = {"name":"contracts/jetton-wallet","getters":[{"returnTypes":["int","slice","slice","cell"],"name":"get_wallet_data","parameters":[]}],"setters":[]};

// Initialize TON Connect UI
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://0fajarpurnama0.github.io/assets/json/ton_connect_manifest.json',
    buttonRootId: 'ton-connect',
});

// DOM Elements
const deployButton = document.getElementById('deploy-button');
const statusDiv = document.getElementById('status');
const networkInfoDiv = document.getElementById('networkInfo');
const tokenNameInput = document.getElementById('tokenName');
const tokenSymbolInput = document.getElementById('tokenSymbol');
const initialSupplyInput = document.getElementById('initialSupply');
const recipientAddressInput = document.getElementById('recipientAddress');
const feePercentageRadio = document.getElementById('feePercentage');
const feeFixedRadio = document.getElementById('feeFixed');
const youReceiveDiv = document.getElementById('youReceiveValue');
const iReceiveDiv = document.getElementById('iReceiveValue');
const discountDiv = document.getElementById('0FP0EXP_balance');

// Constants
const DECIMALS = 9;
const DEPLOYMENT_FEE = '50000000'; // 0.05 TON in nanoton
const MINT_FEE = '10000000'; // 0.01 TON in nanoton
const FIXED_FEE = '10000000'; // 0.01 TON in nanoton
const PERCENTAGE_FEE = 10; // 10%

// Update fee display dynamically
function updateFeeDisplay() {
    const supply = parseFloat(initialSupplyInput.value) || 0;
    const symbol = tokenSymbolInput.value || 'TOK';
    if (feePercentageRadio.checked) {
        const feeAmount = (supply * PERCENTAGE_FEE) / 100;
        youReceiveDiv.textContent = `You Receive: ${supply - feeAmount} ${symbol}`;
        iReceiveDiv.textContent = `Admin Receives: ${feeAmount} ${symbol}`;
    } else if (feeFixedRadio.checked) {
        youReceiveDiv.textContent = `You Receive: ${supply} ${symbol}`;
        iReceiveDiv.textContent = `Admin Receives: 0.01 TON`;
    } else {
        youReceiveDiv.textContent = 'Select a fee option';
        iReceiveDiv.textContent = '';
    }
}

// Placeholder for 0FP0EXP balance check
async function check0FP0EXPBalance(address) {
    // TODO: Implement balance check with TON API if needed
    discountDiv.textContent = 'N/A (Balance check not implemented)';
    return 0; // Placeholder return
}

// Validate user inputs
function validateInputs() {
    const tokenName = tokenNameInput.value.trim();
    const tokenSymbol = tokenSymbolInput.value.trim();
    const initialSupply = parseFloat(initialSupplyInput.value);
    const recipientAddress = recipientAddressInput.value.trim();

    if (!tokenName) {
        statusDiv.textContent = 'Error: Token name is required.';
        return false;
    }
    if (!tokenSymbol) {
        statusDiv.textContent = 'Error: Token symbol is required.';
        return false;
    }
    if (isNaN(initialSupply) || initialSupply <= 0) {
        statusDiv.textContent = 'Error: Initial supply must be a positive number.';
        return false;
    }
    if (!recipientAddress) {
        statusDiv.textContent = 'Error: Recipient address is required.';
        return false;
    }
    return true;
}

// Handle wallet connection status
tonConnectUI.onStatusChange(async (status) => {
    const isConnected = tonConnectUI.connected;
    if (isConnected) {
        const address = tonConnectUI.account.address;
        recipientAddressInput.value = address;
        deployButton.disabled = false;
        statusDiv.textContent = `Connected to wallet: ${address.slice(0, 6)}...${address.slice(-4)}`;
        networkInfoDiv.textContent = 'Network: Testnet'; // Adjust if mainnet is used
        await check0FP0EXPBalance(address);
        updateFeeDisplay();
    } else {
        deployButton.disabled = true;
        statusDiv.textContent = 'Please connect your wallet to start.';
        networkInfoDiv.textContent = 'Network: Not connected';
        recipientAddressInput.value = '';
    }
});

// Add input listeners for real-time updates
initialSupplyInput.addEventListener('input', updateFeeDisplay);
tokenSymbolInput.addEventListener('input', updateFeeDisplay);
feePercentageRadio.addEventListener('change', updateFeeDisplay);
feeFixedRadio.addEventListener('change', updateFeeDisplay);

// Deploy Jetton contract
deployButton.addEventListener('click', async () => {
    if (!validateInputs()) return;

    try {
        statusDiv.textContent = 'Preparing deployment...';
    } catch (error) {
        console.error(error);
        statusDiv.textContent = `Error: ${error.message || 'Deployment failed. Please try again.'}`;
    }
});