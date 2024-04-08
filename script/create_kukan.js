 /* MIT License Copyright © 2010-2024 three.js authors https://github.com/mrdoob/three.js/blob/dev/LICENSE */
 import * as THREE from "https://cdn.kotaroo.work/Three.js/r126/build/three.module.js";
 import { OrbitControls } from "https://cdn.kotaroo.work/Three.js/r126/examples/jsm/controls/OrbitControls.js";
 import { GLTFLoader } from "https://cdn.kotaroo.work/Three.js/r126/examples/jsm/loaders/GLTFLoader.js";
 import { updateAssetsWindowDiv } from "./assets_info_window.js";
 import { CONFIG } from "../config/config.js";
 
 let camera;
 let controls;
 let renderer;
 let model;
 let currentOwnedMonacardInfo;
 let selectKukanData;
 
 export const manager = new THREE.LoadingManager();
 const scene = new THREE.Scene();
 const raycaster = new THREE.Raycaster();
 const mouse = new THREE.Vector2();
 const highlightedObjects = [];
 
 function handleMouseMoveCamera(e) {
 
   const el = e.currentTarget;
   const x = e.clientX - el.offsetLeft;
   const y = e.clientY - el.offsetTop;
   const w = el.offsetWidth;
   const h = el.offsetHeight;
 
   mouse.x = (x / w) * 2 - 1;
   mouse.y = -(y / h) * 2 + 1;
 
   raycaster.setFromCamera(mouse, camera);
   const intersects = raycaster.intersectObjects(highlightedObjects);
   if(intersects.length <= 0) return
 
   moveCameraInFrontOfObject(intersects[0].object);
 }
 
 function handleMouseOpenInfoWindow(e) {
 
   const el = e.currentTarget;
   const x = e.clientX - el.offsetLeft;
   const y = e.clientY - el.offsetTop;
   const w = el.offsetWidth;
   const h = el.offsetHeight;
 
   mouse.x = (x / w) * 2 - 1;
   mouse.y = -(y / h) * 2 + 1;
 
   raycaster.setFromCamera(mouse, camera);
   const intersects = raycaster.intersectObjects(highlightedObjects);
   if(intersects.length <= 0) {
     openMonacardInfoWindow(false);
   } else {
     updateMonacardInfo(intersects[0].object.name);
     openMonacardInfoWindow(true);
   }
 
 }
 
 function openMonacardInfoWindow(is_open) {
   const el = document.getElementById("monacardInfoWindow");
   if(!is_open) {
     el.style.visibility = "hidden";
   } else {
     el.style.visibility = "visible";
   }
 }
 
 /**
  * Monacard Info Menu の更新
  * @param name
  */
 function updateMonacardInfo(name) {
 
   document.getElementById("kukanInfoMenu").style.visibility = "hidden";
 
   let clickAssetName;
   for(let i = 0; i < selectKukanData.kukan[0].picture_data.length; i++) {
     if(name === selectKukanData.kukan[0].picture_data[i].picture_name) {
       clickAssetName = selectKukanData.kukan[0].picture_data[i].asset_name;
       break;
     }
   }
 
   for(let i = 0; currentOwnedMonacardInfo.length > i; i++) {
     if(currentOwnedMonacardInfo[i].assetName != clickAssetName) continue;
     try {
 
       const isNFT = (currentOwnedMonacardInfo[i].assetgroup != null) ? true : false;
       let dateTime1 = new Date(Number(currentOwnedMonacardInfo[i].regist_time) * 1000).toString();
       let dateTime2 = new Date(Number(currentOwnedMonacardInfo[i].update_time) * 1000).toString();
 
       selectedMonacardInfo.card_name = currentOwnedMonacardInfo[i].card_name;
       selectedMonacardInfo.asset_name = currentOwnedMonacardInfo[i].assetName;
       selectedMonacardInfo.asset = currentOwnedMonacardInfo[i].asset;
       selectedMonacardInfo.description = currentOwnedMonacardInfo[i].add_description;
       selectedMonacardInfo.owner_name = currentOwnedMonacardInfo[i].owner_name;
       selectedMonacardInfo.cid = currentOwnedMonacardInfo[i].cid;
       selectedMonacardInfo.regist_time = dateTime1;
       selectedMonacardInfo.update_time = dateTime2;
       isNFT ? selectedMonacardInfo.assetgroup = currentOwnedMonacardInfo[i].assetgroup : selectedMonacardInfo.assetgroup = "";
       isNFT ? selectedMonacardInfo.nft = "NFT" : selectedMonacardInfo.nft = "NOT NFT";
       selectedMonacardInfo.monacardLink = "https://card.mona.jp/explorer/card_detail?asset=" + currentOwnedMonacardInfo[i].assetName;
       selectedMonacardInfo.imgur_url = currentOwnedMonacardInfo[i].imgur_url_preview;
       updateAssetsWindowDiv(selectedMonacardInfo);
       break;
     }
     catch {}
   }
 }
 
 /** タッチしたMonacardの情報を格納 */
 const selectedMonacardInfo = {
   card_name: "",
   asset: "",
   asset_name: "",
   description: "",
   owner_name: "",
   cid: "",
   regist_time: "",
   update_time: "",
   assetgroup: "",
   nft: "",
   monacardLink: "",
   imgur_url: "",
 }
 
 function moveCameraInFrontOfObject(touch_object) {
   // オブジェクトの位置を取得
   const touchObjectPosition = new THREE.Vector3();
   touch_object.getWorldPosition(touchObjectPosition);
 
   // カメラの新しい位置を計算
   const cameraNewPosition = new THREE.Vector3();
   touch_object.children[0].getWorldPosition(cameraNewPosition);
 
   camera.position.copy(cameraNewPosition);
   camera.lookAt(touchObjectPosition);
   controls.target = touchObjectPosition;
 
 }
 
 function createLight() {
   //光源
   // new THREE.SpotLight(色, 光の強さ, 距離, 照射角, ボケ具合, 減衰率)
   const spotLight = new THREE.SpotLight(0xFFFFFF, 0.8, 100, Math.PI / 2, 1, 1.5);
   spotLight.position.set(0, 30, 30);
   spotLight.castShadow = true;
   spotLight.shadow.mapSize.width = 512;
   spotLight.shadow.mapSize.height = 512;
   scene.add(spotLight);
 
   //光源2
   const spotLight2 = new THREE.SpotLight(0xFFFFFF, 0.8, 100, Math.PI / 2, 1, 1.5);
   spotLight2.position.set(40, 30, -80);
   spotLight2.castShadow = true;
   spotLight2.shadow.mapSize.width = 512;
   spotLight2.shadow.mapSize.height = 512;
   scene.add(spotLight2);
 
   // AmbientLight
   const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
   scene.add(ambientLight);
 
   // HemisphereLight
   const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
   scene.add(hemisphereLight);
 }
 
 function createCamera() {
   camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.position.set(0, 30, 50);
 
   controls = new OrbitControls(camera, document.body);
   controls.enableDamping = true;
   controls.dampingFactor = 0.2;
   controls.maxDistance = 200;
 
   // 上下の振り幅
   controls.minPolarAngle = 0;
   controls.maxPolarAngle = Math.PI / 2;
 
   controls.target = new THREE.Vector3(0, 3, 0);

  }
 
 function loadObjects() {
   const loader = new GLTFLoader();
   loader.load(CONFIG.Model.FLOOR, function (gltf) {
     model = gltf.scene;
     model.traverse((object) => {
       object.receiveShadow = true;
       object.castShadow = true;
     })
     model.position.set(0, 0, 0);
     scene.add(model);
   }, undefined, function (e) {
     console.error(e);
   });
 }
 
 function loardPictureFromData(selectKukanData, currentOwnedMonacardInfo, gifCardList) {
   const itemList = [];
   const resisteredPictureData = selectKukanData.kukan[0].picture_data;
 
   for (let i = 0; i < resisteredPictureData.length; i++) {
     let cardURL;
     if(resisteredPictureData[i].asset_name === "none") {
       cardURL = "none";
       itemList.push([
         resisteredPictureData[i].picture_name,
         resisteredPictureData[i].asset_name,
         resisteredPictureData[i].picture_state,
         cardURL,
       ]);
     } else {
       const result = currentOwnedMonacardInfo.find((ownedData) => {
         if(ownedData.assetName === resisteredPictureData[i].asset_name) return ownedData.imgur_url_original;
       });
       if(result != undefined) {
         cardURL = gifToOptimizedFormat(gifCardList, result.imgur_url_original);
       }
       else cardURL = "notOwn";
 
       itemList.push([
         resisteredPictureData[i].picture_name,
         resisteredPictureData[i].asset_name,
         resisteredPictureData[i].picture_state,
         cardURL
       ]);
     }
   }
   return itemList;
 }
 
 /**
  * カードがgifの場合にアニメーションか一枚絵かチェックする。
  * アニメーションの場合はmp4に変換。
  * 一枚絵の場合はjpgに変換。
  * @param cardLink 
  * @returns 
  */
 function gifToOptimizedFormat(gifCardList, cardLink) {
   let checkURL = cardLink;
 
   // cidからgifかどうか判定
   const cid = checkURL.substring(checkURL.length - 59);
   gifCardList.find((el) => {
     if(el === cid) {
       checkURL = checkURL + ".gif";
     }
   })
   return checkURL;
 }
 
 function createKukanFromData(itemList) {
   const loader = new GLTFLoader(manager);
   const IMAGE_MOVED_ITEM = "../images/moved_item.png";
 
   loader.load(CONFIG.Model.KUKAN, (gltf) => {
     gltf.scene.traverse((child) => {
 
       if(child.name.includes("Frame")) {
         // 一度フレームを全部消す
         child.visible = false;
       }
 
       if(!child.isMesh) return;
       if(child.name.includes("Picture0")) {
         highlightedObjects.push(child);
       } else if(child.name.includes("Guide")) {
         child.visible = false;
       }
       child.receiveShadow = false;
       child.castShadow = true;
 
       itemList.find((item) => {
 
         if(item[0] != child.material.name) return;
 
         // asset_nameが"none"の場合はcanvasを非表示
         if(item[1] === "none") {
           child.parent.visible = false;
           child.parent.material.dispose();
           child.parent.geometry.dispose();
         }
         
         child.receiveShadow = false;
         child.castShadow = false;
 
         let cardLink = item[3];
         let texture;
 
         // cardLink"none"の場合はpictureを非表示
         if(cardLink.slice(-3) === "mp4") {
           const posterLink = cardLink.replace(".mp4", "l.png");
           const video = document.createElement("video");
           video.setAttribute("id", "video_0");
           video.src = cardLink;
           video.crossOrigin = "Anonymous";
           video.poster = posterLink;
           video.loop = true;
           video.muted = true;
           video.load();
           video.play();
           texture = new THREE.VideoTexture(video);
         } else if(cardLink === "none") {
           child.material.visible = false;
         } else if(cardLink === "notOwn") {
           const loaderNormal = new THREE.TextureLoader();
           texture = loaderNormal.load(IMAGE_MOVED_ITEM);
         } else {
           const loaderNormal = new THREE.TextureLoader();
           texture = loaderNormal.load(cardLink);
         }
         if(cardLink != "none") {
           texture.rotation = Math.PI / 2;
           texture.center = new THREE.Vector2(0.5, 0.5);
 
           child.material.map = texture;
           child.material.transparent = true
 
           child.parent.position.set(item[2].position.x, item[2].position.y, item[2].position.z);
           child.parent.rotation.set(item[2].rotation.x, item[2].rotation.y, item[2].rotation.z);
           child.parent.scale.set(item[2].scale.x, item[2].scale.y, item[2].scale.z);
         }
       });
     });
 
     gltf.scene.position.set(0, -1, 0);
     gltf.scene.scale.set(1, 1, 1);
     scene.add(gltf.scene);
     highlightedObjects.push(gltf.scene);
 
   });
 }
 
 function createObjects() {
   // SkyBox
   const skyBoxGeo = new THREE.SphereGeometry(5, 32, 32);
   const skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xFEFEFE, side: THREE.DoubleSide, });
   const skyBox = new THREE.Mesh(skyBoxGeo, skyBoxMaterial);
   skyBox.position.set(0, 0, 0);
   skyBox.scale.set(20, 20, 20);
   scene.add(skyBox);
 }
 
 function rendererSetting() {
   //renderer
   renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
   renderer.setPixelRatio(window.devicePixelRatio);
   renderer.setSize(window.innerWidth, window.innerHeight);
   renderer.autoClear = false;
   renderer.setClearColor(0x000000, 0.0);
   renderer.shadowMap.enabled = true;
 }
 
 /**
  * create kukan from selected data
  * @param {*} selectKukanData 
  */
 export function createKukan(select_kukan_data, current_owned_monacard_info, gifCardList) {
   
   currentOwnedMonacardInfo = current_owned_monacard_info;
   selectKukanData = select_kukan_data;
 
   scene.fog = new THREE.Fog(0x000000, 1, 500);
   scene.background = new THREE.Color(0xffffff);
 
   createCamera();
   createLight();
   createObjects();
   loadObjects();
 
   const itemList = loardPictureFromData(selectKukanData, currentOwnedMonacardInfo, gifCardList);
   createKukanFromData(itemList);
 
   rendererSetting();
 
   const canvas = document.getElementById("canvas");
   canvas.addEventListener("click", handleMouseMoveCamera);
   canvas.addEventListener("dblclick", handleMouseOpenInfoWindow);
   canvas.appendChild(renderer.domElement);
 
   const menu = document.getElementById("menu");
   menu.addEventListener("mouseover", (e) => {
     controls.enabled = false;
   });
   canvas.addEventListener("mouseover", (e) => {
     controls.enabled = true;
   });
 
   animate();
   
   // スマホでのピンチイン、ピンチアウト時に画面自体がズームされるので使用しない
   // window.addEventListener("resize", function () { onWindowResize(); }, false);
 }
 
 function animate() {
   requestAnimationFrame(animate);
   renderer.render(scene, camera);
 }
 
//  function onWindowResize() {
//    camera.aspect = window.innerWidth / window.innerHeight;
//    camera.updateProjectionMatrix();
//    renderer.setSize( window.innerWidth, window.innerHeight );
//  }