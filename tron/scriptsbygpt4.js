import { BigNumber } from "https://cdn.jsdelivr.net/npm/bignumber.js@9.0.2/+esm";

// Wait for DOM content
document.addEventListener("DOMContentLoaded", () => {
    connectButton.addEventListener("click", async () => {
        try {
            await connectWallet();
        } catch (e) {
            statusDiv.innerText = `Wallet connection failed: ${e.message}`;
        }
    });
});

async function connectWallet() {
    if (window.tronWeb && window.tronWeb.ready) {
        tronWeb = window.tronWeb;
        connectedAddress = tronWeb.defaultAddress.base58;
        connectedAddressHex = tronWeb.address.toHex(connectedAddress);
        isConnected = true;
        recipientAddressInput.value = connectedAddress;
        ADMIN_ADDRESS_HEX = tronWeb.address.toHex(ADMIN_ADDRESS_BASE58);
        statusDiv.innerText = `Connected: ${connectedAddress}`;
    } else {
        statusDiv.innerText = "Please install TronLink and unlock your wallet.";
        throw new Error("TronLink not available");
    }
}

async function deployToken() {
    try {
        if (!isConnected) await connectWallet();

        const tokenName = tokenNameInput.value;
        const tokenSymbol = tokenSymbolInput.value;
        const initialSupply = new BigNumber(initialSupplyInput.value);
        const recipient = recipientAddressInput.value;
        const feeType = feePercentageRadio.checked ? "percentage" : "fixed";

        const initialSupplyWithDecimals = initialSupply.multipliedBy(`1e${DECIMALS}`);

        let valueInSun = 0;
        let adminFeePercentage = 0;

        if (feeType === "fixed") {
            valueInSun = FIXED_ADMIN_FEE_TRX_SUN;
        } else {
            adminFeePercentage = ADMIN_FEE_PERCENTAGE;
        }

        console.log("Deployment Parameters:");
        console.log("Token Name:", tokenName);
        console.log("Token Symbol:", tokenSymbol);
        console.log("Initial Supply (raw):", initialSupply.toString());
        console.log("Initial Supply with Decimals:", initialSupplyWithDecimals.toFixed());
        console.log("Recipient Address (Base58):", recipient);
        console.log("Recipient Address (Hex):", tronWeb.address.toHex(recipient));
        console.log("Admin Address (Base58):", ADMIN_ADDRESS_BASE58);
        console.log("Admin Address (Hex):", ADMIN_ADDRESS_HEX);
        console.log("Admin Fee Percentage:", adminFeePercentage);
        console.log("Fixed TRX Fee (SUN):", valueInSun);
        console.log("Fee Type:", feeType);
        console.log("ABI loaded?", !!erc20Abi);
        console.log("Bytecode length:", erc20Bytecode.length);
        console.log("Deploying contract from:", connectedAddressHex);

        const contract = await tronWeb.contract().new({
            abi: erc20Abi,
            bytecode: erc20Bytecode,
            parameters: [
                tokenName,
                tokenSymbol,
                initialSupply.toFixed(),
                recipient,
                ADMIN_ADDRESS_BASE58,
                adminFeePercentage,
                valueInSun
            ],
            feeLimit: 100_000_000,
            callValue: valueInSun,
            userFeePercentage: 100,
            originEnergyLimit: 1_000_000
        });

        console.log("Contract deployed at:", contract.address);
        statusDiv.innerText = `✅ Contract deployed at: ${contract.address}`;
    } catch (err) {
        console.error("Deployment error:", err);
        statusDiv.innerText = `❌ Deployment failed: ${err.message}`;
    }
}

// Attach deploy function to global window for testing
window.deployToken = deployToken;
