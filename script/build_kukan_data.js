import { unescapeProcess } from './utils.js';
import { getAssetsBalancesElectrum, getMonacardInfoMany } from './monaparty_script.js';
import { CONFIG } from "../config/config.js";

/**
 * build current owned monacard info
 * @returns currentOwnedMonacardInfo
 */
export async function buildCurrentOwnedMonacardData(selectKukanData) {

  const haveAssets = await getAssetsBalancesElectrum(selectKukanData.user_address);
  
  if(haveAssets === undefined) {
    alert("assets is undefined");
  } else {
    checkAddressHaveAssets(haveAssets, selectKukanData);
    const joinedAssetListArray = [ selectKukanData.kukan[0].req_monacard_names ];
    const monacardList = await getMonacardInfoMany(joinedAssetListArray);
    const currentOwnedMonacardInfo = setMonacardInfo(monacardList);
    return currentOwnedMonacardInfo;
  }
}

function setMonacardInfo(monacardList) {
  const setData = [];
  const URL_IMG_DATA = CONFIG.URL.MONACARD_HUB_NOSU_IMGDATA;

  if(monacardList[0] === undefined) {
    alert("monacard is undefined");
  } else {
    for(let i = 0; i < monacardList.length; i++) {
      for(let ii = 0; ii < monacardList[i].length; ii++) {
        setData.push(
          {
            assetName: monacardList[i][ii].asset_longname === null ? monacardList[i][ii].asset_common_name: monacardList[i][ii].asset_longname,
            asset: monacardList[i][ii].asset,
            assetgroup: monacardList[i][ii].assetgroup,
            card_name: unescapeProcess(monacardList[i][ii].card_name),
            owner_name: unescapeProcess(monacardList[i][ii].owner_name),
            imgur_url_original: URL_IMG_DATA + monacardList[i][ii].cid,
            imgur_url_preview: URL_IMG_DATA + monacardList[i][ii].cid,
            add_description: unescapeProcess(monacardList[i][ii].add_description),
            tw_id: unescapeProcess(monacardList[i][ii].tw_id),
            tw_name: unescapeProcess(monacardList[i][ii].tw_name),
            tag: unescapeProcess(monacardList[i][ii].tag),
            cid: monacardList[i][ii].cid,
            ver: monacardList[i][ii].ver,
            is_good_status: monacardList[i][ii].asseis_good_statustgroup,
            regist_time: monacardList[i][ii].regist_time,
            update_time: monacardList[i][ii].update_time,
          }
        );
      }
    }
  }
  return setData;
}

/**
 * check if a registered address still has assets.
 * Replace assets if address dose not have assets
 * @param address 
 */
function checkAddressHaveAssets(haveAssets, selectKukanData) {
  const haveAssetsList = [];
  const resisteredAssets = [];

  // 登録アドレスが現在所持しているアセットを格納
  haveAssets.forEach((r) => {
    if(r.asset_longname === null) {
      haveAssetsList.push(r.asset);
    } else {
      haveAssetsList.push(r.asset_longname);
    }
  });

  // 登録済みのアセットデータを抜き出す
  selectKukanData.kukan[0].picture_data.forEach((data) => {
    if(data.asset_name === "none") return;
    resisteredAssets.push(data.asset_name);
  });

  // 所持アセットの中に登録済みアセットがあるか確認する
  resisteredAssets.forEach((resisteredAssetName) => {

    // 所持している場合はリターン
    if(haveAssetsList.includes(resisteredAssetName)) return;

    // 所持していない場合は"notOwn"に置き換える
    selectKukanData.kukan.picture_data.find((currentData) => {
      if(currentData.asset_name === resisteredAssetName) {
        currentData.asset_name = "notOwn";
      }
    });
  });
}