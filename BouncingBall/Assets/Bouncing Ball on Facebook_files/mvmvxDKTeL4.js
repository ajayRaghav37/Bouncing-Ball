/*1336802068,169776066*/

if (window.CavalryLogger) { CavalryLogger.start_js(["C6rJk"]); }

__d("NotifXList",[],function(a,b,c,d,e,f){var g={},h=null;function i(p){if(!p)throw new Error('You have to init NotifXList with a non-null owner');h=p;}function j(p){g[p]=null;}function k(p,q){if(!q)throw new Error('You have to add a non-null data to xList');g[p]=q;}function l(p){var q=(undefined!==g[p.notif_id]),r=(p.notif_alt_id&&undefined!==g[p.notif_alt_id]);if(q||r){k(q?p.notif_id:p.notif_alt_id,p);return true;}return false;}function m(p){return null!=g[p];}function n(p){if(m(p)){var q=g[p];o(p);h.alertList.insert(q.notif_id,q.notif_time,q.notif_markup,q.replace,q.ignoreUnread,q.notif_alt_id);}}function o(p){delete g[p];}e.exports={init:i,userXClick:j,filterStoreClicked:l,newNotifExist:m,resumeInsert:n,removeNotif:o};});