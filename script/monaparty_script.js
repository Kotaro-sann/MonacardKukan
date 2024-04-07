import { CONFIG } from "../config/config.js";

// Balance Info Electrum
export async function getAssetsBalancesElectrum(userAddress) {
  const data = {
    "jsonrpc": "2.0",
    "id": 0,
    "method": "get_normalized_balances",
    "params": {
      "addresses": [userAddress]
    }
  }
  const result = await fetch(CONFIG.URL.MONAPARTY_SERVER_ME, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then((r) => { return r.result })
    .catch((e) => { return undefined });

  return result;
}

/**
   * @param joinedAssetList 
   * @returns "Array" or "undefined"
   */
export async function getMonacardInfoMany(joinedAssetList) {
  let monacardList = [];
  for (let i = 0; i < joinedAssetList.length; i++) {
    // Mpurse からのアセット情報で Monacard リクエスト
    await getMonacardInfo(joinedAssetList[i])
      .then((r) => {
        if (r != undefined) monacardList[i] = r;
      });
  }
  return monacardList;
}

// Monacard Info
async function getMonacardInfo(assetName) {
  const result = await fetch(CONFIG.URL.MONACARD_HUB_NOSU_CARD_DETAIL + assetName, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then(response => response.json())
    .then((r) => { return r.details })
    .catch((e) => { console.log(e.message) });
  return result;
}

export async function reqGifCardList() {
  const gifCardList = await fetch(CONFIG.URL.MONACARD_HUB_NOSU_GIFLIST)
    .then((response) => response.json())
    .then((data) => { return data })
    .catch((e) => { console.log(e.message) });
    return gifCardList;
}