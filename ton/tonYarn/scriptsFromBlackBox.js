import { TonConnectUI } from "@tonconnect/ui";
import { TonClient } from "@tonclient/core";
import { libNode } from "@tonclient/lib-node";
import { Address } from "ton";

TonClient.useBinaryLibrary(libNode);

const tonClient = new TonClient({ network: { server: "https://toncenter.com/api/v2/jsonRPC" } });
const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://0fajarpurnama0.github.io/assets/json/ton_connect_manifest.json',
    buttonRootId: 'ton-connect',
});

document.addEventListener("DOMContentLoaded", () => {
    const deployButton = document.getElementById("deploy-button");
    const statusDiv = document.getElementById("status");
    const networkInfoDiv = document.getElementById("networkInfo");
    const recipientAddressInput = document.getElementById("recipientAddress");
    const minterAddressInput = document.getElementById("minterAddress");

    // Listen for status changes
    tonConnectUI.onStatusChange(() => {
        if (tonConnectUI.connected) { // Check if status is defined
            const walletAddress = tonConnectUI.account.address; // Use tonConnectUI to get the account address
            recipientAddressInput.value = walletAddress;
            minterAddressInput.value = walletAddress;
            networkInfoDiv.innerText = "Network: Connected";
            deployButton.disabled = false;
        } else {
            recipientAddressInput.value = "";
            minterAddressInput.value = "";
            networkInfoDiv.innerText = "Network: Not connected";
            deployButton.disabled = true;
        }
    });

    // Deploy Jetton
    deployButton.addEventListener("click", async () => {
        const tokenName = document.getElementById("tokenName").value;
        const tokenSymbol = document.getElementById("tokenSymbol").value;
        const initialSupply = parseInt(document.getElementById("initialSupply").value);
        const recipientAddress = recipientAddressInput.value;
        const minterAddress = minterAddressInput.value;

        // Validate addresses
        try {
            Address.parse(recipientAddress);
            Address.parse(minterAddress);
        } catch (error) {
            statusDiv.innerText = "Invalid address format.";
            return;
        }

        if (!tokenName || !tokenSymbol || isNaN(initialSupply)) {
            statusDiv.innerText = "Please fill in all fields.";
            return;
        }

        try {
            const jettonMasterAddress = "YOUR_JETTON_MASTER_ADDRESS"; // Replace with your jetton master address
            const jettonWalletCode = "YOUR_JETTON_WALLET_CODE"; // Replace with your jetton wallet code in BOC format

            const mintAmount = initialSupply * 1e9; // Adjust for decimals if needed

            const mintMessage = {
                to: jettonMasterAddress,
                value: 0,
                body: {
                    op: "mint",
                    amount: mintAmount,
                    to_address: recipientAddress,
                    jetton_wallet_code: jettonWalletCode,
                },
            };

            const response = await tonClient.processing.process_message({
                message: mintMessage,
                send_events: true,
            });

            statusDiv.innerText = "Tokens minted successfully!";
            console.log("Mint response:", response);
        } catch (error) {
            console.error("Minting error:", error);
            statusDiv.innerText = "Failed to mint tokens.";
        }
    });
});
