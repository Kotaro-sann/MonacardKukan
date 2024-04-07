import { CONFIG } from "../config/config.js";

export function updateAssetsWindowDiv(selected_monacard_info) {
  const BASE_URL = CONFIG.URL.MONACARD_URL_EXPLORER;
  const BASE_URL_PREVIEW = CONFIG.URL.MONACARD_URL_IMAGE_SERVER;

  const element_1 = document.getElementById("card_name");
  const element_2 = document.getElementById("asset");
  const element_3 = document.getElementById("asset_name");
  const element_4 = document.getElementById("card_description");
  const element_5 = document.getElementById("card_owner_name");
  const element_6 = document.getElementById("cid");
  const element_7 = document.getElementById("regist_time");
  const element_8 = document.getElementById("update_time");
  const element_9 = document.getElementById("assetgroup");
  const element_10 = document.getElementById("nft");
  const element_11 = document.getElementById("monacardLink");
  const element_12 = document.getElementById("imgur_url");

  element_1.textContent = selected_monacard_info.card_name;
  element_2.textContent = selected_monacard_info.asset;
  element_3.textContent = selected_monacard_info.asset_name;
  element_4.textContent = selected_monacard_info.description;
  element_5.textContent = selected_monacard_info.owner_name;
  element_6.textContent = selected_monacard_info.cid;
  element_7.textContent = selected_monacard_info.regist_time;
  element_8.textContent = selected_monacard_info.update_time;
  element_9.textContent = selected_monacard_info.assetgroup;
  element_10.textContent = selected_monacard_info.nft;
  element_11.setAttribute("href", BASE_URL + selected_monacard_info.asset);
  element_12.textContent = selected_monacard_info.imgur_url;

  const imgElement = document.getElementById("img_preview");
  imgElement.src = BASE_URL_PREVIEW + selected_monacard_info.cid + "m";
  imgElement.alt = selected_monacard_info.card_name;

}