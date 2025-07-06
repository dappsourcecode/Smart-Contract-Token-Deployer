// --- UI Update Functions ---
percentageValueSpan.innerText = ADMIN_FEE_PERCENTAGE;
fixedValueSpan.innerText = FIXED_ADMIN_FEE_TRX; // Displaying in TRX

function updateCalculatedValues() {
    const initialSupplyStr = initialSupplyInput.value;
    if (!initialSupplyStr) {
        youReceiveDiv.innerText = "";
        iReceiveDiv.innerText = "";
        return;
    }

    const initialSupply = new BigNumber(initialSupplyStr);

    if (feePercentageRadio.checked) {
        const adminShare = initialSupply.times(ADMIN_FEE_PERCENTAGE).div(100);
        const youReceive = initialSupply.minus(adminShare);

        youReceiveDiv.innerText = `You Receive: ${youReceive.toFixed(0)} tokens`;
        iReceiveDiv.innerText = `Admin Receives: ${ADMIN_FEE_PERCENTAGE}% (${adminShare.toFixed(0)} tokens)`;
    } else if (feeFixedRadio.checked) {
        youReceiveDiv.innerText = `You Receive: ${initialSupply.toFixed(0)} tokens`;
        iReceiveDiv.innerText = `Admin Receives: ${FIXED_ADMIN_FEE_TRX} Native Asset`;
    }
}

// --- Network Info Update ---
async function updateNetworkInfo() {
    if (tronWeb && tronWeb.ready) {
        try {
            const fullNodeHost = tronWeb.fullNode.host;
            let networkName = "Unknown TRON Network";
            if (fullNodeHost.includes("api.tronstack.io") || fullNodeHost.includes("api.trongrid.io")) networkName = "TRON Mainnet";
            else if (fullNodeHost.includes("api.shasta.tronweb.com")) networkName = "Shasta Testnet";
            else if (fullNodeHost.includes("api.nileex.io")) networkName = "Nile Testnet";
            else if (fullNodeHost.includes("localhost") || fullNodeHost.includes("127.0.0.1")) networkName = "Local TRON Node";

            networkInfoDiv.innerText = `Connected to network: ${networkName}`;
        } catch (error) {
            console.error("Error getting network info:", error);
            networkInfoDiv.innerText = "Could not fetch TRON network info.";
        }
    } else {
        networkInfoDiv.innerText = "Not connected to a TRON network.";
    }
}

// --- Wallet Connection Logic ---
async function connectWallet() {
    try {
        statusDiv.innerText = "Connecting to TronLink wallet...";
        if (window.tronWeb) {
            tronWeb = window.tronWeb;

            // Convert ADMIN_ADDRESS to hex upon TronWeb initialization
            if (tronWeb.isAddress(ADMIN_ADDRESS_BASE58)) {
                ADMIN_ADDRESS_HEX = tronWeb.address.toHex(ADMIN_ADDRESS_BASE58);
            } else {
                throw new Error("Invalid ADMIN_ADDRESS_BASE58 configured. Please check globalVariables.js");
            }

            let maxAttempts = 10;
            while (!tronWeb.ready && maxAttempts > 0) {
                await new Promise(resolve => setTimeout(resolve, 300));
                maxAttempts--;
            }

            if (!tronWeb.ready) {
                throw new Error("TronLink is not ready or not connected. Please ensure it's unlocked and an account is selected.");
            }

            connectedAddress = tronWeb.defaultAddress.base58;
            if (!connectedAddress) {
                throw new Error("No TRON account detected. Please unlock TronLink and select an account.");
            }
            connectedAddressHex = tronWeb.address.toHex(connectedAddress);

            isConnected = true;
            recipientAddressInput.value = connectedAddress; // Display Base58 in UI
            connectButton.innerText = "Deploy Token";
            connectButton.onclick = deployToken;

            const accountInfo = await tronWeb.trx.getAccount(connectedAddress);
            const balanceSun = new BigNumber(accountInfo.balance || 0);
            const balanceTRX = tronWeb.fromSun(balanceSun.toFixed());

            statusDiv.innerText = `Connected with address: ${connectedAddress} (Balance: ${parseFloat(balanceTRX).toFixed(3)} TRX)`;

            fpexpbalance = 500000; // Hardcoded placeholder for now
            fpexpbalanceSpan.innerText = fpexpbalance;

            if (fpexpbalance >= 1000000) {
                discount = 1;
                discountDiv.innerText = `Discount: ${discount * 100}%`;
                ADMIN_FEE_PERCENTAGE = 0;
                FIXED_ADMIN_FEE_TRX = 0;
                FIXED_ADMIN_FEE_TRX_SUN = 0;
            } else {
                discount = fpexpbalance / 1000000;
                discountDiv.innerText = `Discount: ${discount * 100}%`;
                ADMIN_FEE_PERCENTAGE = ADMIN_FEE_PERCENTAGE * (1 - discount);
                FIXED_ADMIN_FEE_TRX = FIXED_ADMIN_FEE_TRX * (1 - discount);
                FIXED_ADMIN_FEE_TRX_SUN = FIXED_ADMIN_FEE_TRX * 1_000_000;
            }
            percentageValueSpan.innerText = ADMIN_FEE_PERCENTAGE.toFixed(2);
            fixedValueSpan.innerText = FIXED_ADMIN_FEE_TRX.toFixed(2);

            await updateNetworkInfo();
            updateCalculatedValues();
        } else {
            throw new Error("TronLink extension not found. Please install TronLink.");
        }
    } catch (error) {
        console.error("Error connecting wallet:", error);
        statusDiv.innerText = `Connection failed: ${error.message}`;
        isConnected = false;
        connectButton.innerText = "Connect Wallet";
        connectButton.onclick = connectWallet;
        recipientAddressInput.value = "Connect wallet first";
    }
}

// --- Token Deployment Logic ---
async function deployToken() {
    if (!isConnected || !tronWeb) {
        statusDiv.innerText = "Please connect your wallet first.";
        return;
    }
    if (!erc20Abi || !erc20Bytecode) {
        statusDiv.innerText = "Contract ABI or Bytecode not loaded. Please select a compiler version.";
        return;
    }
    if (!ADMIN_ADDRESS_HEX) { // Ensure admin address is converted
        statusDiv.innerText = "Admin address not properly initialized. Try reconnecting wallet.";
        return;
    }
    if (!connectedAddressHex) { // Ensure recipient address (sender's address) is converted
        statusDiv.innerText = "Connected wallet address not properly initialized in hexadecimal format. Try reconnecting wallet.";
        return;
    }

    const feeType = document.querySelector('input[name="adminFeeType"]:checked').value;
    const tokenName = tokenNameInput.value.trim();
    const tokenSymbol = tokenSymbolInput.value.trim();
    const initialSupply = initialSupplyInput.value.trim();
    const recipientBase58 = recipientAddressInput.value.trim(); // Keep original input for validation
    const adminAddressForContract = ADMIN_ADDRESS_HEX;
    const adminFeePercentage = feeType === 'percentage' ? ADMIN_FEE_PERCENTAGE : 0;
    const fixedTrxFeeSun = feeType === 'fixed' ? FIXED_ADMIN_FEE_TRX_SUN : 0;

    // Basic input validation
    if (!tokenName || !tokenSymbol || !initialSupply || !recipientBase58) {
        statusDiv.innerText = "Please fill in all token details.";
        return;
    }
    if (new BigNumber(initialSupply).isNaN() || new BigNumber(initialSupply).lte(0)) {
        statusDiv.innerText = "Initial Supply must be a positive number.";
        return;
    }
    // Validate recipient address using TronWeb's utility
    if (!tronWeb.isAddress(recipientBase58)) {
        statusDiv.innerText = "Invalid Recipient Address.";
        return;
    }
    // Convert recipient to hex for contract parameters if it's different from connectedAddress
    let recipientAddressForContract = recipientBase58;
    if (recipientBase58 !== connectedAddress) { // If user manually changed recipient
        recipientAddressForContract = tronWeb.address.toHex(recipientBase58);
    } else { // Otherwise, it's the connected address, use its hex version
        recipientAddressForContract = connectedAddressHex;
    }

    statusDiv.innerText = `Deploying ${tokenName} (${tokenSymbol})... This may take a moment.`;

    try {
        const initialSupplyWithDecimals = new BigNumber(initialSupply).times(new BigNumber("10").pow(DECIMALS)).toFixed(0);

        const contractInstance = await tronWeb.contract().new({
            abi: erc20Abi,
            bytecode: erc20Bytecode,
            feeLimit: 200 * 1_000_000,
            callValue: fixedTrxFeeSun,
            parameters: [
                tokenName,
                tokenSymbol,
                initialSupplyWithDecimals,
                recipientAddressForContract, // Use the HEX address here!
                adminAddressForContract,     // Use the HEX address here!
                adminFeePercentage,
                fixedTrxFeeSun
            ],
        });

        const deployedAddress = tronWeb.address.fromHex(contractInstance.address);

        statusDiv.innerHTML = `Deployment successful! Contract Address: <code>${deployedAddress}</code>`;
        statusDiv.innerHTML += `<br>Transaction Hash: <code>${contractInstance.transaction.txID}</code>`;
        statusDiv.innerHTML += `<br>Go to any TRON explorer (e.g., <a href="https://tronscan.org/#/contract/${deployedAddress}" target="_blank">TronScan</a>) to view the transaction or verify your contract.`;

        if (feeType === 'fixed') {
            statusDiv.innerHTML += `<br>Fixed fee of <strong>${FIXED_ADMIN_FEE_TRX.toFixed(2)} TRX</strong> was sent with the deployment.`;
        }

    } catch (error) {
        console.error("Deployment error:", error);
        let errorMessage = error.message || "An unknown error occurred during deployment.";
        if (errorMessage.includes("insufficient balance") || errorMessage.includes("insufficient energy") || errorMessage.includes("BANDWIDTH_INSUFFICIENT") || errorMessage.includes("ENERGY_INSUFFICIENT")) {
             errorMessage = "Insufficient TRX balance or Energy/Bandwidth for deployment. Please ensure you have enough TRX.";
        } else if (errorMessage.includes("User  canceled")) {
            errorMessage = "Transaction canceled by the user.";
        } else if (errorMessage.includes("Invalid issuer address provided")) {
            errorMessage = "A provided address is invalid. This might be due to incorrect format or a TronLink issue. Check recipient and admin addresses.";
        }
        statusDiv.innerText = `Deployment failed: ${errorMessage}`;
    }
}

// --- Event Listeners and Initial Setup ---
connectButton.addEventListener('click', connectWallet);
initialSupplyInput.addEventListener('input', updateCalculatedValues);
feePercentageRadio.addEventListener('change', updateCalculatedValues);
feeFixedRadio.addEventListener('change', updateCalculatedValues);
compilerVersionSelect.addEventListener('change', (event) => {
    setContractArtifacts(event.target.value);
    statusDiv.innerText = `Compiler version set to ${event.target.value}.`;
    updateCalculatedValues();
});

setContractArtifacts(compilerVersionSelect.value);
updateCalculatedValues();
updateNetworkInfo();
