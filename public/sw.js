if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,t)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let i={};const r=e=>n(e,c),o={module:{uri:c},exports:i,require:r};s[c]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(t(...e),i)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/Hneg1eha-y0LfZbGB5sAb/_buildManifest.js",revision:"6b9e7cb6567f42dc62a298b914d203a5"},{url:"/_next/static/Hneg1eha-y0LfZbGB5sAb/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/785-877bf6906af46209.js",revision:"877bf6906af46209"},{url:"/_next/static/chunks/912-38c73ac1f9ed66b8.js",revision:"38c73ac1f9ed66b8"},{url:"/_next/static/chunks/framework-a6b3d2fb26bce5d1.js",revision:"a6b3d2fb26bce5d1"},{url:"/_next/static/chunks/main-3ae2315102d581f5.js",revision:"3ae2315102d581f5"},{url:"/_next/static/chunks/pages/_app-a3e0300c6ae7a0e6.js",revision:"a3e0300c6ae7a0e6"},{url:"/_next/static/chunks/pages/_error-fde50cb7f1ab27e0.js",revision:"fde50cb7f1ab27e0"},{url:"/_next/static/chunks/pages/cancel_leave-058e78280634c5c4.js",revision:"058e78280634c5c4"},{url:"/_next/static/chunks/pages/edit/%5Bid%5D-e5724e38a7cb1949.js",revision:"e5724e38a7cb1949"},{url:"/_next/static/chunks/pages/index-af4af4fa408bf7e2.js",revision:"af4af4fa408bf7e2"},{url:"/_next/static/chunks/pages/leave_request-cb9490fc8f2331c3.js",revision:"cb9490fc8f2331c3"},{url:"/_next/static/chunks/pages/major/%5Bmajor%5D-a68682c34767762a.js",revision:"a68682c34767762a"},{url:"/_next/static/chunks/pages/major_overview-89bc6b6225039060.js",revision:"89bc6b6225039060"},{url:"/_next/static/chunks/pages/overview-f6bda5274d557ae7.js",revision:"f6bda5274d557ae7"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-6ffd07a3317375c1.js",revision:"6ffd07a3317375c1"},{url:"/_next/static/css/58a18bd105699e7d.css",revision:"58a18bd105699e7d"},{url:"/favicon.ico",revision:"6c08cec8a41dcd5e52dc70b458a0b369"},{url:"/icons/apple-touch-icon.png",revision:"9879e25634317f8a0fc3a46ba3d6aeaf"},{url:"/icons/icon-192x192.png",revision:"16ba63c93492eb8e7bb8f822d23b6afa"},{url:"/icons/icon-512x512.png",revision:"5c4685b58be8beb2cf871d88f71186d0"},{url:"/manifest.json",revision:"6e95eed7e1cd495be50b8fca6bef2130"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));