import { requestKukanData } from "./request_kukan_data.js";
import { buildCurrentOwnedMonacardData } from "./build_kukan_data.js";
import { createKukan } from "./create_kukan.js";
import { reqGifCardList } from "./monaparty_script.js";

const selectKukanData = await requestKukanData();
const currentOwnedMonacardInfo = await buildCurrentOwnedMonacardData(selectKukanData);
const gifCardList = await reqGifCardList();

createKukan(selectKukanData, currentOwnedMonacardInfo, gifCardList);
setKukanInfo(selectKukanData);

document.getElementById("kukanInfoButton").addEventListener("click", () => {
  const el = document.getElementById("kukanInfoMenu");
  if (el.style.visibility === "hidden") {
    el.style.visibility = "visible";
  } else {
    el.style.visibility = "hidden";
  }
});

document.getElementById("kukanInfoMenu").addEventListener("click", (e) => {
  const el = document.getElementById("kukanInfoMenu");
  if (el.style.visibility === "hidden") {
    el.style.visibility = "visible";
  } else {
    el.style.visibility = "hidden";
  }
});

document.getElementById("monacardInfoWindow").addEventListener("click", (e) => {
  const el = document.getElementById("monacardInfoWindow");
  if (el.style.visibility === "hidden") {
    el.style.visibility = "visible";
  } else {
    el.style.visibility = "hidden";
  }
});


function setKukanInfo(select_kukan_data) {
  const element_1 = document.getElementById("kukan_name");
  const element_2 = document.getElementById("description");
  const element_3 = document.getElementById("owner_name");
  const element_4 = document.getElementById("owner_adderss");
  const element_5 = document.getElementById("ownerAddressDisplayText");
  
  element_1.textContent = select_kukan_data.kukan[0].kukan_name;
  element_2.textContent = select_kukan_data.kukan[0].description;
  element_3.textContent = select_kukan_data.kukan[0].owner_name;
  element_4.textContent = select_kukan_data.user_address;
  element_5.textContent = select_kukan_data.user_address;
  const addressLink = "https://card.mona.jp/explorer/address_detail_preview?address=" + select_kukan_data.user_address;
  element_5.setAttribute("href", addressLink);
}
