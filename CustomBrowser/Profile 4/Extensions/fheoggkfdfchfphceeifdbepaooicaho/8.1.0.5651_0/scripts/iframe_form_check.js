/*!
 * 
 *     MCAFEE RESTRICTED CONFIDENTIAL
 *     Copyright (c) 2024 McAfee, LLC
 *
 *     The source code contained or described herein and all documents related
 *     to the source code ("Material") are owned by McAfee or its
 *     suppliers or licensors. Title to the Material remains with McAfee
 *     or its suppliers and licensors. The Material contains trade
 *     secrets and proprietary and confidential information of McAfee or its
 *     suppliers and licensors. The Material is protected by worldwide copyright
 *     and trade secret laws and treaty provisions. No part of the Material may
 *     be used, copied, reproduced, modified, published, uploaded, posted,
 *     transmitted, distributed, or disclosed in any way without McAfee's prior
 *     express written permission.
 *
 *     No license under any patent, copyright, trade secret or other intellectual
 *     property right is granted to or conferred upon you by disclosure or
 *     delivery of the Materials, either expressly, by implication, inducement,
 *     estoppel or otherwise. Any license under such intellectual property rights
 *     must be expressed and approved by McAfee in writing.
 *
 */(()=>{"use strict";const e=0,s="PRINT_IN_BACKGROUND",o={NONE:0,INFO:1,ERROR:2,WARN:3,DEBUG:4,ALL_IN_BACKGROUND:99},t=1,r=2,n=3,i=4,a={BACKGROUND:"BACKGROUND",CONTENT:"CONTENT",TELEMETRY:"TELEMETRY"},c={DEFAULT:"color: #000000; font-weight: normal; font-style:normal; background: #FFFFFF;",BACKGROUND:"color: #8D0DBA; font-weight: bold; background: #FFFFFF;",CONTENT:"color: #F54A26; font-weight: bold; background: #FFFFFF;",TELEMETRY:"color: #147831; font-weight: bold; background: #FFFFFF;"};const l=new class{constructor(){this.storageChecked=!1,this.logLevel=null,this.queue=[];const s="MCLOGLEVEL";chrome?.storage?.local.get([s]).then((t=>{const r=Object.values(o).includes(t[s]);this.logLevel=r?t[s]:e,this.logLevel!==o.NONE&&this.queue.forEach((({callback:e,message:s,processType:o})=>{e(s,o)})),this.queue=[],this.storageChecked=!0}))}log(e,s=null){this.storageChecked?this.processLog(e,t,s,this.logLevel):this.queue.push({callback:this.log.bind(this),message:e,processType:s})}error(e,s=null){this.storageChecked?this.processLog(e,r,s,this.logLevel):this.queue.push({callback:this.error.bind(this),message:e,processType:s})}warn(e,s=null){this.storageChecked?this.processLog(e,n,s,this.logLevel):this.queue.push({callback:this.warn.bind(this),message:e,processType:s})}debug(e,s=null){this.storageChecked?this.processLog(e,i,s,this.logLevel):this.queue.push({callback:this.debug.bind(this),message:e,processType:s})}processLog(e,t,n,i){if(i===o.NONE)return;let c="chrome-extension:"===location.protocol?a.BACKGROUND:a.CONTENT;n&&a[n]&&(c=n);const l=new Date,h=t===r?e:`%c[${c} ${l.toLocaleString([],{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0})}]: %c${e}`;c===a.CONTENT&&this.logLevel===o.ALL_IN_BACKGROUND&&chrome.runtime.sendMessage({command:s,logMessage:h,processType:c,logType:t,logLevel:i}),this.printLog(h,c,t,i)}printLog(e,s,a,l){const h=c.DEFAULT,d=c[s]||h;if(l>=o.ERROR&&a===r&&console.error(e),l>=o.INFO&&a===t&&console.log(e,d,h),l>=o.WARN&&a===n){const s="color: #FFA500; font-family: sans-serif; font-weight: bolder; text-shadow: #000 1px 1px;";console.log(`%cWARN - ${e}`,s,d,h)}if(l>=o.DEBUG&&a===i){const s="color: #FF33D7; font-family: sans-serif; font-weight: bolder; text-shadow: #000 1px 1px;";console.log(`%cDEBUG - ${e}`,s,d,h)}}},h=async(e,s,o,t)=>{try{chrome.tabs.sendMessage(t,{ipcId:e,command:s,...o},{},(()=>{chrome.runtime.lastError}))}catch(e){l.warn(`[broadcast] Unexpected error when calling command: "${s}", err: ${e.message}`)}},d=(e,s,o,t,r=null)=>{if(!chrome.tabs)throw new Error('"tabs" permission not set in manifest.');const n={};return"number"==typeof r&&(n.frameId=r),chrome.tabs.sendMessage(t,{ipcId:e,command:s,...o},n)},u=(e,s={},o)=>(async(e,s,o={},t={})=>{try{if(t?.tabId){const{tabId:r,frameId:n}=t;return await d(e,s,o,r,n)}if(t?.broadcast){const r=await chrome.tabs.query({}),{broadcastIgnoreId:n=[]}=t;return r.filter((({id:e})=>!n.includes(e))).forEach((({id:t})=>{h(e,s,o,t)})),!0}return await chrome.runtime.sendMessage({ipcId:e,command:s,...o})}catch(e){return l.warn(`Unexpected error when calling command: "${s}", err: ${e.message}`),null}})("WA",e,s,o),g="GET_TAB_AND_FRAME_ID",m="FORM_PRE_CHECK_PASSED";(new class{constructor(){this.pingCommand="PING_IFRAME_FORM_CHECK",this.basePingListener()}basePingListener(e=null){((e,s=null,o)=>{"function"==typeof o?chrome.runtime.onMessage.addListener(((t,r,n)=>{if(r.id===chrome.runtime.id&&"object"==typeof t&&!Array.isArray(t)&&t?.ipcId===e)return o({promises:s,request:t,sender:r,sendResponse:n})})):l.error("Provided with invalid callback function")})("WA",null,(({request:s,sendResponse:o})=>{const{command:t}=s;if(t===this.pingCommand)return o({content:!0}),"function"==typeof e&&e(),!0}))}isPossibleFormPage(){let e=[...document.getElementsByTagName("input")];return e=e.filter((e=>!(e.name.toLowerCase().includes("search")||(e.ariaLabel?e.ariaLabel.toLowerCase():"").includes("search")||e.id.toLowerCase().includes("search")||e.className.toLowerCase().includes("search")||e.defaultValue.toLowerCase().includes("search")||e.value.toLowerCase().includes("search")||"hidden"===e.type.toLowerCase()||"checkbox"===e.type.toLowerCase()||"submit"===e.type.toLowerCase()||"search"===e.type.toLowerCase()||"file"===e.type.toLowerCase()||"button"===e.type.toLowerCase()))),e.length>0}async main(){const{frameId:e}=await u(g);if(this.isPossibleFormPage())u(m,{url:window.location.href});else if(0===e){const e=new MutationObserver((()=>{this.isPossibleFormPage()&&(u(m,{url:window.location.href}),e.disconnect())})),s={childList:!0,subtree:!0};e.observe(document,s)}else setTimeout((()=>{this.isPossibleFormPage()&&u(m,{url:window.location.href})}),1e3)}}).main()})();
//# sourceMappingURL=../sourceMap/chrome/scripts/iframe_form_check.js.map