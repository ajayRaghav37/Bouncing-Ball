/*1352839191,178142491*/

if (self.CavalryLogger) { CavalryLogger.start_js(["7jKer"]); }

function CreditsBalanceUpdater(){}CreditsBalanceUpdater.UPDATE='creditsBalance/update';copyProperties(CreditsBalanceUpdater.prototype,{init:function(a,b){this.root=a;this.targetBalance=DOM.find(this.root,'span.creditsBalance');Arbiter.inform(CreditsBalanceUpdater.UPDATE,b,Arbiter.BEHAVIOR_STATE);Arbiter.subscribe(CreditsBalanceUpdater.UPDATE,this.oninform.bind(this),Arbiter.SUBSCRIBE_NEW);new LiveMessageReceiver('update_canvas_balance').setHandler(this.oninform_livemessage.bind(this)).register();},oninform_livemessage:function(a){this.oninform(CreditsBalanceUpdater.UPDATE,a);},oninform:function(a,b){if(a==CreditsBalanceUpdater.UPDATE)DOM.setContent(this.targetBalance,b);}});
__d("SettingsController",["event-extensions","Bootloader","CSS","DOM","PageTransitions","Parent","Style","URI"],function(a,b,c,d,e,f){b('event-extensions');var g=b('Bootloader'),h=b('CSS'),i=b('DOM'),j=b('PageTransitions'),k=b('Parent'),l=b('Style'),m=b('URI'),n=null,o=null;function p(){return m(window.location.href).getQueryData().tab||'account';}function q(){return m(window.location.href).getQueryData().id;}function r(x){return m(x).addQueryData({view:null});}function s(x){return k.byClass(x,'fbSettingsListItem');}function t(x){return k.byClass(x,'fbSettingsListLink');}function u(x){return k.byClass(x,'cancel');}function v(){return m(window.location.href).getPath();}var w={init:function(x){Event.listen(x,'click',function(y){var z=y.getTarget();if(u(z)){this.closeEditor();}else{var aa=t(z);if(aa){if(n&&n.checkUnsaved())return false;if(o!==aa)o&&h.removeClass(o,'async_saving');o=aa;}}}.bind(this));j.registerHandler(function(y){var z=y.getQueryData();if(y.getPath()==v()&&z.tab===p()&&typeof z.view!=='undefined'){j.transitionComplete();return true;}});},hideErrors:function(){n&&n.hideErrors();},getEditor:function(){return n;},setEditor:function(x){if(!x||!o||x.contains(o))if(this.closeEditor()!==false){o&&j.go(r(o.href));o=null;(n=x)&&x.show();}},closeEditor:function(){if(n&&n.hide()!==false){if(i.contains(document.body,n.container)){var x=null,y=v();if(y=="/pages/edit_page"){x=m(y).setQueryData({id:q(),tab:p()});}else x=m(y).setQueryData({tab:p()});j.go(r(x));}n=null;}return !n;},setPreview:function(x,y){var z=i.find(s(x),'span.fbSettingsListItemContent');i.setContent(z,y);},animateEdited:function(x){var y=s(x);g.loadModules(['Animation'],function(z){var aa=i.find(y,'span.fbSettingsListItemEdit'),ba=i.find(y,'span.fbSettingsListItemSaved');h.hide(aa);h.show(ba);l.set(aa,'opacity',0);new z(t(aa)).from('background','#fff8bb').to('background','#fff').duration(1000).ease(z.ease.begin).ondone(function(){h.removeClass(y,'fbSettingsListItemEdited');l.set(this.obj,'background','');new z(ba).to('color','#fff').duration(500).ease(z.ease.begin).ondone(function(){h.hide(ba);l.set(ba,'color','');h.show(aa);new z(aa).to('opacity',1).duration(500).ease(z.ease.begin).go();}).go();}).go();});}};e.exports=a.SettingsPanelManager||w;});
__d("SettingsMobileRemoveLink",["Arbiter","AsyncRequest"],function(a,b,c,d,e,f){var g=b('Arbiter'),h=b('AsyncRequest'),i={},j=null,k={init:function(l,m){i[l]=m;},_handleRemove:function(l){var m=i[l];if(m)new h().setURI('/ajax/settings/mobile/remove_dialog.php').setData({hasemail:true,cell:m,linkid:l}).send();}};e.exports=k;});
__d("legacy:settings-mobile-remove-link",["SettingsMobileRemoveLink"],function(a,b,c,d){a.SettingsMobileRemoveLink=b('SettingsMobileRemoveLink');},3);
__d("SettingsNotificationsManager",["Bootloader","DOM","HTML"],function(a,b,c,d,e,f){var g=b('Bootloader'),h=b('DOM'),i=b('HTML'),j;function k(n){return h.find(n,'.fbSettingsNotifEmailLink');}function l(n){return h.scry(j,'.notif_'+n);}var m={init:function(n){j=n;},refreshType:function(n,o){g.loadModules(['Animation'],function(p){l(n).forEach(function(q){h.replace(k(q),i(o));new p(q).from('background','#fff8bb').to('background','#fff').duration(1000).ease(p.ease.begin).go();});});}};e.exports=m;});
__d("legacy:SettingsNotificationsManager",["SettingsNotificationsManager"],function(a,b,c,d){a.SettingsNotificationsManager=b('SettingsNotificationsManager');},3);
__d("legacy:SettingsPanelManager",["SettingsController"],function(a,b,c,d){a.SettingsPanelManager=b('SettingsController');},3);
__d("SupportDashboard",["event-extensions","AsyncRequest","CSS","cx","csx","DOM","goURI","HTML","Parent","$","copyProperties"],function(a,b,c,d,e,f){b('event-extensions');var g=b('AsyncRequest'),h=b('CSS'),i=b('cx'),j=b('csx'),k=b('DOM'),l=b('goURI'),m=b('HTML'),n=b('Parent'),o=b('$'),p=b('copyProperties');function q(r){}p(q,{collapse:function(r){this.setItemExpanded(r,false);return true;},expandFromID:function(r,s){var t=o(r);return this.expand(t,s);},expand:function(r,s){var t=k.find(r,"._5o4");k.replace(t,s);this.setItemExpanded(r,true);h.removeClass(r,"_8-h");return true;},setItemExpanded:function(r,s){var t=k.find(r,"._5n-"),u=k.find(r,"._5o1"),v=k.find(r,"._5o0");h.conditionShow(t,!s);h.conditionShow(u,s);h.hide(v);},removeItem:function(r){var s=o(r),t=n.byClass(s,"_5o6");k.remove(s);var u=k.scry(t,"._5o5"),v=k.scry(t,"._6w3");if(u.length===0&&v.length===0){var w=k.find(t,"._5o8");h.show(w);}},removeActionItem:function(r){var s=o(r);k.remove(s);},handleCollapsedOnClick:function(r,s){Event.listen(r,'click',function(t){var u=t.getTarget();if(!n.byTag(u,'a')){h.show(k.find(r,"._5o0"));new g().setURI(s).send();}});},handleExpandedOnClick:function(r){Event.listen(r,'click',function(s){var t=s.getTarget();if(n.byClass(t,"_6w2")){var u=n.byClass(t,"_5o5");this.collapse(u);}}.bind(this));},setupFiltering:function(r){r.subscribe('itemclick',function(s,t){var u='/settings?tab=support&filter='+t.getValue();l(u);});},setupSection:function(r,s,t,u){if(s.length>0){var v=k.find(r,"._6w3");Event.listen(v,'click',function(w){var x=k.find(v,'a'),y=k.find(v,"._5o0");h.hide(x);h.show(y);var z=s.splice(0,t);new g().setURI('/ajax/settings/reports/see_more.php').setData({content_ids:z,section:u}).setHandler(this.showMoreItems.bind(this,y,x,v,s)).send();}.bind(this));}},showMoreItems:function(r,s,t,u,v){h.hide(r);h.show(s);k.insertBefore(t,v.getPayload());if(u.length===0)k.remove(t);}});e.exports=q;});