import { TonConnectUI } from "@tonconnect/ui";
import {
  Cell,
  beginCell,
  Address,
  contractAddress,
  toNano,
  beginDict,
} from "ton";

// Replace with the base64 BOC of your compiled jetton-minter.code.boc
const JETTON_MINTER_CODE_BOC = "te6ccgECDQEAApwAART/APSkE/S88sgLAQIBYgIDAgLMBAUCA3pgCwwC8dkGOASS+B8ADoaYGAuNhJL4HwfSB9IBj9ABi465D9ABj9ABgBaY/pn/aiaH0AfSBqahhACqk4XUcZmpqbGyiaY4L5cCSBfSB9AGoYEGhAMGuQ/QAYEogaKCF4BQpQKBnkKAJ9ASxni2ZmZPaqcEEIPe7L7yk4XXGBQGBwCTtfBQiAbgqEAmqCgHkKAJ9ASxniwDni2ZkkWRlgIl6AHoAZYBkkHyAODpkZYFlA+X/5Og7wAxkZYKsZ4soAn0BCeW1iWZmZLj9gEBwDY3NwH6APpA+ChUEgZwVCATVBQDyFAE+gJYzxYBzxbMySLIywES9AD0AMsAyfkAcHTIywLKB8v/ydBQBscF8uBKoQNFRchQBPoCWM8WzMzJ7VQB+kAwINcLAcMAkVvjDQgBpoIQLHa5c1JwuuMCNTc3I8ADjhozUDXHBfLgSQP6QDBZyFAE+gJYzxbMzMntVOA1AsAEjhhRJMcF8uBJ1DBDAMhQBPoCWM8WzMzJ7VTgXwWED/LwCQA+ghDVMnbbcIAQyMsFUAPPFiL6AhLLassfyz/JgEL7AAH+Nl8DggiYloAVoBW88uBLAvpA0wAwlcghzxbJkW3ighDRc1QAcIAYyMsFUAXPFiT6AhTLahPLHxTLPyP6RDBwuo4z+ChEA3BUIBNUFAPIUAT6AljPFgHPFszJIsjLARL0APQAywDJ+QBwdMjLAsoHy//J0M8WlmwicAHLAeL0AAoACsmAQPsAAH2tvPaiaH0AfSBqahg2GPwUALgqEAmqCgHkKAJ9ASxniwDni2ZkkWRlgIl6AHoAZYBk/IA4OmRlgWUD5f/k6EAAH68W9qJofQB9IGpqGD+qkEA=";
const JETTON_MINTER_CODE_HEX = "b5ee9c72c1020d0100029c000000000d00120018002a006b007000bc0139018f02110218027b0114ff00f4a413f4bcf2c80b01020162050202037a600403001faf16f6a2687d007d206a6a183faa9040007dadbcf6a2687d007d206a6a183618fc1400b82a1009aa0a01e428027d012c678b00e78b666491646580897a007a00658064fc80383a6465816503e5ffe4e8400202cc07060093b5f0508806e0a84026a8280790a009f404b19e2c039e2d99924591960225e801e80196019241f200e0e9919605940f97ff93a0ef003191960ab19e2ca009f4042796d625999992e3f60102f1d906380492f81f000e8698180b8d8492f81f07d207d2018fd0018b8eb90fd0018fd001801698fe99ff6a2687d007d206a6a18400aa9385d47199a9a9b1b289a6382f97024817d207d006a18106840306b90fd001812881a282178050a502819e428027d012c678b666664f6aa7041083deecbef29385d718140b0801a682102c76b9735270bae30235373723c0038e1a335035c705f2e04903fa403059c85004fa0258cf16ccccc9ed54e03502c0048e185124c705f2e049d4304300c85004fa0258cf16ccccc9ed54e05f05840ff2f00901fe365f03820898968015a015bcf2e04b02fa40d3003095c821cf16c9916de28210d1735400708018c8cb055005cf1624fa0214cb6a13cb1f14cb3f23fa443070ba8e33f828440370542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c9f9007074c8cb02ca07cbffc9d0cf16966c227001cb01e2f4000a000ac98040fb0001c036373701fa00fa40f82854120670542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c9f9007074c8cb02ca07cbffc9d05006c705f2e04aa1034545c85004fa0258cf16ccccc9ed5401fa403020d70b01c300915be30d0c003e8210d53276db708010c8cb055003cf1622fa0212cb6acb1fcb3fc98042fb002eedfd83";
//const JETTON_MINTER_CODE = Cell.fromBoc(Buffer.from(JETTON_MINTER_CODE_BOC, "base64"))[0];
const JETTON_MINTER_CODE = Cell.fromBoc(Buffer.from(JETTON_MINTER_CODE_HEX, 'hex'))[0];

// Replace with the base64 BOC of your compiled jetton-wallet.code.boc
const JETTON_WALLET_CODE_BOC = "te6ccgECEQEAAyMAART/APSkE/S88sgLAQIBYgIDAgLMBAUAG6D2BdqJofQB9IH0gahhAgHUBgcCASAICQDDCDHAJJfBOAB0NMDAXGwlRNfA/AM4PpA+kAx+gAxcdch+gAx+gAwc6m0AALTH4IQD4p+pVIgupUxNFnwCeCCEBeNRRlSILqWMUREA/AK4DWCEFlfB7y6k1nwC+BfBIQP8vCAAET6RDBwuvLhTYAIBIAoLAIPUAQa5D2omh9AH0gfSBqGAJpj8EIC8aijKkQXUEIPe7L7wndCVj5cWLpn5j9ABgJ0CgR5CgCfQEsZ4sA54tmZPaqQB8VA9M/+gD6QCHwAe1E0PoA+kD6QNQwUTahUirHBfLiwSjC//LiwlQ0QnBUIBNUFAPIUAT6AljPFgHPFszJIsjLARL0APQAywDJIPkAcHTIywLKB8v/ydAE+kD0BDH6ACDXScIA8uLEd4AYyMsFUAjPFnD6AhfLaxPMgMAgEgDQ4AnoIQF41FGcjLHxnLP1AH+gIizxZQBs8WJfoCUAPPFslQBcwjkXKRceJQCKgToIIJycOAoBS88uLFBMmAQPsAECPIUAT6AljPFgHPFszJ7VQC9ztRND6APpA+kDUMAjTP/oAUVGgBfpA+kBTW8cFVHNtcFQgE1QUA8hQBPoCWM8WAc8WzMkiyMsBEvQA9ADLAMn5AHB0yMsCygfL/8nQUA3HBRyx8uLDCvoAUaihggiYloBmtgihggiYloCgGKEnlxBJEDg3XwTjDSXXCwGAPEADXO1E0PoA+kD6QNQwB9M/+gD6QDBRUaFSSccF8uLBJ8L/8uLCBYIJMS0AoBa88uLDghB73ZfeyMsfFcs/UAP6AiLPFgHPFslxgBjIywUkzxZw+gLLaszJgED7AEATyFAE+gJYzxYBzxbMye1UgAHBSeaAYoYIQc2LQnMjLH1Iwyz9Y+gJQB88WUAfPFslxgBDIywUkzxZQBvoCFctqFMzJcfsAECQQIwB8wwAjwgCwjiGCENUydttwgBDIywVQCM8WUAT6AhbLahLLHxLLP8ly+wCTNWwh4gPIUAT6AljPFgHPFszJ7VQ=";
const JETTON_WALLET_CODE_HEX = "b5ee9c72c1021101000323000000000d001200220027002c00700075007a00e8016801a801e2025e02af02b402bf0114ff00f4a413f4bcf2c80b010201620302001ba0f605da89a1f401f481f481a8610202cc0e0402012006050083d40106b90f6a2687d007d207d206a1802698fc1080bc6a28ca9105d41083deecbef09dd0958f97162e99f98fd001809d02811e428027d012c678b00e78b6664f6aa40201200c07020120090800d73b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b08160824c4b402805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b552002f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a019ad822860822625a028062849e5c412440e0dd7c138c34975c2c0600b0a007cc30023c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed5400705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718010c8cb0524cf165006fa0215cb6a14ccc971fb001024102301f1503d33ffa00fa4021f001ed44d0fa00fa40fa40d4305136a1522ac705f2e2c128c2fff2e2c254344270542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c920f9007074c8cb02ca07cbffc9d004fa40f40431fa0020d749c200f2e2c4778018c8cb055008cf1670fa0217cb6b13cc80d009e8210178d4519c8cb1f19cb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08209c9c380a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed540201d4100f00113e910c1c2ebcb8536000c30831c02497c138007434c0c05c6c2544d7c0fc03383e903e900c7e800c5c75c87e800c7e800c1cea6d0000b4c7e08403e29fa954882ea54c4d167c0278208405e3514654882ea58c511100fc02b80d60841657c1ef2ea4d67c02f817c12103fcbc200475cc36";
//const JETTON_WALLET_CODE = Cell.fromBoc(Buffer.from(JETTON_WALLET_CODE_BOC, "base64"))[0];
const JETTON_WALLET_CODE = Cell.fromBoc(Buffer.from(JETTON_WALLET_CODE_HEX, 'hex'))[0];

/* Hex conversion example
const bocBufferFromBase64 = Buffer.from(JETTON_WALLET_CODE_BOC, 'base64');
const hexStringFromBase64 = bocBufferFromBase64.toString('hex');
console.log(hexStringFromBase64);
*/

// UI elements
const btnDeploy = document.getElementById("deploy-button");
const btnMint = document.getElementById("mint-button");
const inpName = document.getElementById("tokenName");
const inpSymbol = document.getElementById("tokenSymbol");
const inpSupply = document.getElementById("initialSupply");
const inpRecipient = document.getElementById("recipientAddress");
const statusDiv = document.getElementById("status");
const networkDiv = document.getElementById("networkInfo");
const minterAddressDiv = document.getElementById("minterAddress");

// Constants
const DEPLOY_FEE = toNano("0.25");
const MINT_FEE = toNano("0.25"); // Increased for potential ref

// TON Connect UI
const tonConnect = new TonConnectUI({
  manifestUrl: "https://0fajarpurnama0.github.io/assets/json/ton_connect_manifest.json",
  buttonRootId: "ton-connect",
});

let minterAddress = null;

tonConnect.onStatusChange(() => {
  if (tonConnect.connected) {
    inpRecipient.value = tonConnect.account.address;
    btnDeploy.disabled = false;
    btnMint.disabled = minterAddress === null;
    statusDiv.textContent = "Wallet connected";
    networkDiv.textContent = "Network: Testnet";
  } else {
    inpRecipient.value = "";
    btnDeploy.disabled = true;
    btnMint.disabled = true;
    minterAddress = null;
    minterAddressDiv.textContent = "Minter Address: -";
    statusDiv.textContent = "Please connect";
    networkDiv.textContent = "Network: -";
  }
});

// Simple JSON metadata cell
function buildJettonOnchainMetadata(name, symbol) {
  const data = { name: name, symbol: symbol };
  const KEYLEN = 256;
  const dict = beginDict(KEYLEN);
  Object.entries(data).forEach(([k, v]) => {
    const bufferToStore = Buffer.from(v, 'utf8');
    const rootCell = new Cell();
    rootCell.bits.writeUint8(0x00); // SNAKE_PREFIX
    rootCell.bits.writeBuffer(bufferToStore);
    dict.storeRef(Buffer.from(k, 'utf8').subarray(0, 32), rootCell); // Simplified key
  });
  return beginCell().storeInt(0x00, 8).storeDict(dict.endDict()).endCell(); // ONCHAIN_CONTENT_PREFIX
}

function initData(ownerAddress, name, symbol) {
  const onchainMetadata = buildJettonOnchainMetadata(name, symbol);
  return beginCell()
    .storeCoins(0)
    .storeAddress(ownerAddress)
    .storeRef(onchainMetadata)
    .storeRef(JETTON_WALLET_CODE)
    .endCell();
}

btnDeploy.onclick = async () => {
  const name = inpName.value.trim();
  const sym = inpSymbol.value.trim();
  const supply = parseFloat(inpSupply.value);

  if (!name || !sym || isNaN(supply) || supply <= 0) {
    statusDiv.textContent = "Fill in name, symbol, and a positive supply for initial admin mint";
    return;
  }

  if (!tonConnect.connected) return;
  const ownerAddress = Address.parse(tonConnect.account.address);
  const initialDataCell = initData(ownerAddress, name, sym);

  const stateInit = beginCell()
    .storeRef(JETTON_MINTER_CODE)
    .storeRef(initialDataCell)
    .endCell();

  const futureAddress = contractAddress(0, {
    initialCode: JETTON_MINTER_CODE,
    initialData: initialDataCell,
  });
  minterAddress = futureAddress.toString();
  minterAddressDiv.textContent = `Minter Address: ${minterAddress}`;

  const stateInitB64 = stateInit.toBoc().toString("base64");
  const initialMintAmount = BigInt(Math.floor(supply * 10 ** 9));

  const OPS = {
    Mint: 21,
    InternalTransfer: 0x178d4519,
  };

  const initialMintPayload = beginCell()
    .storeUint(OPS.Mint, 32) // op::mint
    .storeUint(0, 64) // query_id
    .storeAddress(ownerAddress) // to_address
    .storeCoins(initialMintAmount) // amount
    .storeRef(beginCell().endCell()) // master_msg (empty)
    .endCell()
    .toBoc()
    .toString("base64");

  const tx = {
    validUntil: Date.now() + 5 * 60 * 1000,
    messages: [
      {
        address: minterAddress,
        amount: DEPLOY_FEE.toString(),
        stateInit: stateInitB64,
        payload: initialMintPayload, // Include mint in deploy message
      },
    ],
  };

  statusDiv.textContent = "Submitting deploy with initial mint...";
  try {
    const result = await tonConnect.sendTransaction(tx);
    statusDiv.textContent = `✅ Success! Deployed at ${minterAddress}, initial mint sent. TX id: ${result.id}`;
    btnMint.disabled = false;
  } catch (error) {
    console.error("Deployment error:", error);
    statusDiv.textContent = `❌ Deployment error: ${error.message || error}`;
    minterAddress = null;
    minterAddressDiv.textContent = "Minter Address: -";
    btnMint.disabled = true;
  }
};

btnMint.onclick = async () => {
  if (!tonConnect.connected || !minterAddress) {
    statusDiv.textContent = "Please connect wallet and deploy contract first.";
    return;
  }

  const recipientAddress = inpRecipient.value.trim();
  const mintAmount = parseFloat(inpSupply.value);

  const amountToSend = BigInt(Math.floor(mintAmount * 10 ** 9)); // Assuming 9 decimals
  const mintPayload = beginCell()
    .storeUint(1, 32) // op::mint
    .storeUint(Date.now(), 64) // query_id
    .storeAddress(Address.parse(recipientAddress)) // to_address
    .storeCoins(amountToSend) // amount
    .storeRef(beginCell().endCell()) // master_msg (empty)
    .endCell()
    .toBoc()
    .toString("base64");

  const tx = {
    validUntil: Date.now() + 5 * 60 * 1000,
    messages: [
      {
        address: minterAddress,
        amount: MINT_FEE.toString(),
        payload: mintPayload,
      },
    ],
  };

  statusDiv.textContent = `Submitting mint of ${mintAmount} tokens to ${recipientAddress}...`;
  try {
    const result = await tonConnect.sendTransaction(tx);
    statusDiv.textContent = `✅ Mint successful! TX id: ${result.id}`;
  } catch (error) {
    console.error("Mint error:", error);
    statusDiv.textContent = `❌ Mint error: ${error.message || error}`;
  }
};