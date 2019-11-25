!function(e,t){for(var n in t)e[n]=t[n]}(exports,function(e){var t={};function n(s){if(t[s])return t[s].exports;var r=t[s]={i:s,l:!1,exports:{}};return e[s].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(s,r,function(t){return e[t]}.bind(null,r));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=94)}({1:function(e,t){e.exports=require("path")},10:function(e,t){e.exports=require("crypto")},11:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=n(1),r=n(4),o=n(2),i=n(6),a=n(7),c=n(10),l=n(12);function u(){const e=process.env.hasOwnProperty("PROCESSOR_ARCHITEW6432"),t=process.env.SystemRoot;if(t)return s.join(t,e?"Sysnative":"System32","wslconfig.exe")}let d,f;function h(){if("number"!=typeof d){const e=/(\d+)\.(\d+)\.(\d+)/g.exec(r.release());d=e&&4===e.length?parseInt(e[3]):0}return d}t.WIN10_1903={label:"Windows 10, May 2019 Update, version 1903",build:18362},t.WIN10_1803={label:"Windows 10, April 2018 Update, version 1803",build:17134},t.isDistroEnvVarAvailable=function(){return h()>=t.WIN10_1903.build},t.isWSLPathAvailable=function(){return h()>=17046},t.isWSLEnvAvailable=function(){return h()>=17063},t.isDistributionArgumentSupported=function(){return h()>=17666},t.isExecArgumentSupported=function(){return h()>=17666},t.getWSLExecutablePath=function(){let e=h()>=16299;const t=process.env.hasOwnProperty("PROCESSOR_ARCHITEW6432"),n=process.env.SystemRoot;if(n)return s.join(n,t?"Sysnative":"System32",e?"wsl.exe":"bash.exe")},t.getWSLConfigExecutablePath=u,t.getWindowsBuildNumber=h,t.getProductConfiguration=function(e){if(!f){const t=o.readFileSync(s.join(e,"product.json")).toString();f=JSON.parse(t)}return f};const p=/^[\w\d+\.\-_~!$&'\(\)\*\+,;=]+$/,S="+".charCodeAt(0);function _(e,t){return e.length===t.length&&(e===t||e.toLowerCase()===t.toLowerCase())}function g(e){return/^wsl\+/.test(e)}t.DEFAULT_AUTHORITY="wsl+default",t.ALPINE_AUTHORITY="wsl+Alpine",t.ALPINE_DISTRO="Alpine",t.getAuthorityFromDistro=function(e){return e?p.test(e)&&"default"!==e&&e.charCodeAt(0)!==S?"wsl+"+e:"wsl++"+Buffer.from(e,"utf8").toString("hex"):t.DEFAULT_AUTHORITY},t.compareCaseInsensitive=_,t.isEqualAuthority=function(e,t){return _(e,t)},t.isAuthorityWsl=g,t.getDistroFromAuthority=function(e){if(g(e)){const t=e.substr(4);return"default"===t?void 0:t.charCodeAt(0)===S?Buffer.from(t.substr(1),"hex").toString("utf8"):t}throw new Error("authority must start with wsl+")},t.getDistros=function(){return new Promise((e,t)=>{const n=u();if(!n)return void t(new Error("Unable to find location of wslconfig.exe"));i.execFile(n,["/list"],{windowsVerbatimArguments:!0,encoding:"utf16le"},(n,s,r)=>{if(n)t(n);else{const t=/\r\n/.test(s)?"\r\n":"\n",n=s.split(t);let r=[];for(let e=1;e<n.length;e++){let t=n[e].match(/^[a-zA-Z0-9\.\-_]+/);t&&r.push(t[0])}e(r)}})})},t.toForwardSlashes=function(e){return e.replace(/[\\/]/g,s.posix.sep)},t.escapeQuotes=function(e){return e.replace(/'/g,"'\"'\"'")},t.getDownloadURL=function(e,t){return`${e.updateUrl}/commit:${e.commit}/server-linux-${t}/${e.quality||"insider"}`},t.donwloadBuild=async function(e,t,n,r){await async function e(t){await l.promisify(o.exists)(t)||(await e(s.dirname(t)),await l.promisify(o.mkdir)(t))}(s.dirname(t));const i=`${t}_${Date.now()}`;return function e(t,n,s,r,i=5,l){return new Promise((u,d)=>{const f=e=>{o.unlink(n,()=>{}),d(e)},h=o.createWriteStream(n);a.get(t,a=>{const p=a.headers["x-sha256"];if(l||"string"!=typeof p||(l=p),i>0&&(a.statusCode>=300&&a.statusCode<=303||307===a.statusCode)){const t=a.headers.location;if(t)return void e(t,n,s,r,i-1,l).then(u,d)}if(a.statusCode<200||a.statusCode>299)return void d(`Failed to download VS Code Server from ${t}: HTTP ${a.statusCode} - ${a.statusMessage}`);r(`Download checksum: ${l}`);const S=parseInt(a.headers["content-length"]||"0");let _=0;S&&a.on("data",e=>{_+=e.length,s(_,S)}),a.on("error",f),a.pipe(h),a.on("end",e=>{if(l){const e=c.createHash("sha256"),t=o.createReadStream(n);t.on("readable",()=>{const n=t.read();n?e.update(n):l!==e.digest("hex")?f("Download checksum does not match."):(r("Download checksum verified"),u())})}else u()})}).on("error",f)})}(e,i,n,r).then(e=>l.promisify(o.rename)(i,t).then(e=>t))},t.getServerTarCacheLocation=function(e,t){return s.join(r.tmpdir(),"vscode-remote-wsl",e.commit,`vscode-server-linux-${t}.tar.gz`)},t.getWSLBuild=function(e){const t=e.match(/^[0-9.]+-([0-9]+)-Microsoft|([0-9]+).([0-9]+).([0-9]+)-microsoft-standard/);if(t)try{return t[1]?parseInt(t[1]):parseInt(`${t[2]}${t[3]}${t[4]}`)}catch(e){}return-1}},12:function(e,t){e.exports=require("util")},2:function(e,t){e.exports=require("fs")},4:function(e,t){e.exports=require("os")},6:function(e,t){e.exports=require("child_process")},7:function(e,t){e.exports=require("https")},94:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=n(95),r=n(6),o=n(2),i=n(4),a=n(11),c=n(1),l=n(96),u=process.env.VSCODE_WSL_AGENT_DEBUG_PORT,d=process.env.VSCODE_WSL_PIPE_NAME,f=parseInt(process.env.VSCODE_WSL_EXT_HOST_PID||"0",10),h=process.env.VSCODE_WSL_EXT_LOCATION,p=process.env.VSCODE_WSL_APP_ROOT,S=!!process.env.VSCODE_WSL_ENABLE_TELEMETRY,_=process.env.VSCODE_FILE_WATCHER_POLLING||0,g=process.env.VSCODE_WSL_DISTRO,w=!!process.env.VSCODE_WSL_DEBUG_INFO;class m{constructor(e,t){this.increment=e,this.message=t,this.type="progressMessage"}}t.ProgressMessage=m;class v{constructor(e){this.data=e,this.type="stdoutMessage"}}t.StdoutMessage=v;class L{constructor(e){this.data=e,this.type="stderrMessage"}}t.StderrMessage=L;class E{constructor(e,t,n){this.host=e,this.port=t,this.wslVersion=n,this.type="portResolved"}}t.PortResolvedMessage=E;class y{constructor(e,t,n){this.message=e,this.wslVersion=t,this.checkLog=n,this.type="fatalErrorOccured"}}t.FatalErrorOccuredMessage=y;let C=null,O=[];function b(e){for(let t=0;t<O.length;t++)O[t]===e&&O.splice(t,1);0===O.length&&process.exit(0)}!function(){const e=new class{send(e){process.stdout.write(JSON.stringify(e)+"\n")}};O.push(e);let t=setInterval((function(){try{process.kill(f,0)}catch(n){clearInterval(t),b(e)}}),1e3)}();const $=s.createServer(e=>{const t=new l.SimpleProtocol(e),n=new class{send(e){t.send(e)}};O.push(n),t.onMessage=()=>{throw new Error("Received unexpected message")},C&&n.send(C),e.on("close",()=>{b(n)})});function W(e){e&&"EADDRINUSE"===e.code||(console.error(e),process.exit(0));let t=e=>{console.error(e),process.exit(0)},n=s.createConnection(d,()=>{n.removeListener("error",t),new l.SimpleProtocol(n).onMessage=e=>{A(e)},n.on("close",()=>{process.exit(0)})});n.once("error",t)}function A(e){O.forEach(t=>{t.send(e)})}function P(e,t){const n=a.getWSLBuild(t);if(n<41e3)return"127.0.0.1";if(n<41959){const t=i.networkInterfaces(),n={};for(let e in t)for(let s of t[e])n[s.address]=!0;if(e.length&&!e.some(e=>n[e]))return e[0]}return"::1"}$.on("error",W),$.listen(d,async()=>{let e;$.removeListener("error",W);let t="",n=0,s="",i=[],l="";const d=(t,n)=>{clearTimeout(e),A(C=new y(t,l,n))},f=e=>{const t=e.match(/(\d+)%$/);let r=0;if(t){const e=Math.min(parseInt(t[1],10),100);0===e&&(n=0),e>n&&(r=e-n,n=e)}(s!==e||r>0)&&(s=e,A(new m(r/2,e)))},O=()=>{let n=!1;if(D)D=!1,I=0,T&&(A(new m(0,"Installing WSL components")),T=!1);else if(++I>300)return void d(`VS Code Server for WSL failed to start. No messages received for ${Math.floor(90)}s`,!0);return b.length&&(A(new v(b)),n=(n=>{for(let s=0;s<n.length;s++){const r=n.charCodeAt(s);if(10===r){let n=t.match(/Extension host agent listening on (\d+)/);if(n)return clearTimeout(e),A(C=new E(P(i,l),parseInt(n[1],10),l)),!0;(n=t.match(/IP Address: ([\d\.]+)/))?i.push(n[1]):(n=t.match(/WSL version: (.+)/))&&(l=n[1]),f(t),t=""}else 8===r?10!==t.charCodeAt(t.length-1)&&(t=t.substr(0,t.length-1)):t+=n.charAt(s)}return f(t),!1})(b),b=""),x.length&&(A(new L(x)),x=""),n};let b="",x="",D=!1,I=0,T=!0;e=setInterval(O,300);const V=a.getWSLExecutablePath();if(!V||!o.existsSync(V))return void d(`VS Code Server for WSL failed. '${V}' not found.\n\nMake sure WSL is installed:\nhttps://aka.ms/vscode-remote/wsl/install-wsl`,!1);const M=a.getProductConfiguration(p),{commit:R,quality:k,serverDataFolderName:N}=M;if(R&&!k)return void d(`VSCode Client (${p}) does not define a quality.`,!0);const B=N||".vscode-remote",U=a.isWSLEnvAvailable();let j="";if(R&&U){let e="";try{if("arm64"===(e=function(e,t,n,s){let o;const i=`[ -d ~/${n}/bin/${s} ] && printf found || ([ -f /etc/alpine-release ] && printf alpine-; uname -m)`;if(a.isExecArgumentSupported()){o=`${e} ${t?`-d ${t}`:""} -e sh -c "${i}"`}else o="wsl.exe"===c.basename(e).toLowerCase()?`${e} sh -c "${i}"`:`${e} -c "${i}"`;A(new v(`Probing if server is already installed: ${o}`));const l=r.execSync(o,{stdio:[null,null,null]}).toString().trim();switch(A(new v(`Probing result: ${l}`)),l){case"found":return"";case"x86_64":return"x64";case"aarch64":return"arm64";case"alpine-x86_64":return"alpine";default:A(new L(`${l} is an unsupported platform. Please file a feature request.`))}return"unknown"}(V,g,B,R))&&"insider"!==k)return void d('"VS Code Server on ARM is in preview and currently limited to VSCode insiders: https://code.visualstudio.com/insiders',!1);A(new v(e?`No server install found in WSL, needs ${e}`:"Server install found in WSL"))}catch(e){A(new L(`Unable to detect if server is already installed: ${e}`)),a.getWindowsBuildNumber()<=a.WIN10_1803.build&&A(new L(`When using Alpine on ${a.WIN10_1803.label}, make sure that 'bash' is installed. ('apk update && apk add bash')${e}`))}if(e&&"unknown"!==e&&(j=a.getServerTarCacheLocation(M,e),!o.existsSync(j))){const t=a.getDownloadURL(M,e);A(new v(`Downloading server on client side to ${j}.`)),A(new v(`${t}`));let n=0;try{await a.donwloadBuild(t,j,(e,t)=>{const s=Math.ceil(50*e/t);s>n&&(A(new m(s-n,"Downloading server...")),n=s)},e=>A(new v(e)))}catch(e){A(new L(`Unable to download server on client side: ${e}. Will try to download on WSL side.`)),j=""}}}const H=u?`--inspect=0.0.0.0:${u}`:"";let q=R?`"${U?"$VSCODE_WSL_EXT_LOCATION":"."}/scripts/wslServer.sh" ${R} ${k} ${B} ${_} ${H} ${S?"":"--disable-telemetry"}`:`"$VSCODE_WSL_EXT_LOCATION/scripts/wslServer-dev.sh" "$VSCODE_WSL_APP_ROOT" ${_} ${H}`;const F=[];w&&(q="env && VSCODE_WSL_DEBUG_INFO=true "+q),q=`'${q}'`,a.isDistributionArgumentSupported()&&g?F.push("-d",g,"sh","-c",q):"wsl.exe"===c.basename(V).toLowerCase()?F.push("sh","-c",q):F.push("-c",q),A(new v(`Launching ${V} ${F.join(" ")} in ${h}`));const X={...process.env};if(U||!R){const e=[];X.VSCODE_WSL_EXT_LOCATION=h,e.push("VSCODE_WSL_EXT_LOCATION/up"),j&&(X.VSCODE_SERVER_TAR=j,e.push("VSCODE_SERVER_TAR/up")),R||(X.VSCODE_WSL_APP_ROOT=p,e.push("VSCODE_WSL_APP_ROOT/up")),X.WSLENV&&e.push(`${X.WSLENV}`),X.WSLENV=e.join(":")}const G=r.spawn(V,F,{cwd:h,env:X,windowsVerbatimArguments:!0});G.stdout.on("data",e=>{b+=e.toString(),D=!0}),G.stderr.on("data",e=>{x+=e.toString(),D=!0}),G.on("error",e=>{O()||d(`VS Code Server for WSL failed with error:\r\n${e.message}`,!0)}),G.on("close",e=>{O()||d("VS Code Server for WSL closed unexpectedly.",!0)})})},95:function(e,t){e.exports=require("net")},96:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.SimpleProtocol=class{constructor(e){this.onMessage=null,this.onClose=null,this._byteProtocol=new s(e),this._byteProtocol.onClose=()=>{this.onClose&&this.onClose()},this._byteProtocol.onMessage=e=>{if(!this.onMessage)throw new Error("Incorrect usage!");this.onMessage(JSON.parse(e.toString()))}}send(e){this._byteProtocol.send(Buffer.from(JSON.stringify(e)))}};class s{constructor(e){this._socket=e,this._writeBuffer=new class{constructor(){this._data=[],this._totalLength=0}add(e,t){const n=0===this._totalLength;return this._data.push(e,t),this._totalLength+=e.length+t.length,n}take(){const e=Buffer.concat(this._data,this._totalLength);return this._data.length=0,this._totalLength=0,e}},this._chunks=[],this.onMessage=null,this.onClose=null;let t=0;const n={readHead:!0,bodyLen:-1};this._socketDataListener=e=>{for(this._chunks.push(e),t+=e.length;t>0;){if(n.readHead){if(!(t>=s._headerLen))break;{const e=Buffer.concat(this._chunks);n.bodyLen=e.readUInt32BE(0),n.readHead=!1;const r=e.slice(s._headerLen);t=r.length,this._chunks=[r]}}if(!n.readHead){if(!(t>=n.bodyLen))break;{const e=Buffer.concat(this._chunks),s=e.slice(0,n.bodyLen),r=e.slice(n.bodyLen);if(t=r.length,this._chunks=[r],n.bodyLen=-1,n.readHead=!0,!this.onMessage)throw new Error("Incorrect usage!");this.onMessage(s)}}}},e.on("data",this._socketDataListener),this._socketCloseListener=()=>{this.onClose&&this.onClose()},e.once("close",this._socketCloseListener)}send(e){const t=Buffer.allocUnsafe(s._headerLen);t.writeUInt32BE(e.length,0,!0),this._writeSoon(t,e)}_writeSoon(e,t){this._writeBuffer.add(e,t)&&setImmediate(()=>{this._socket.destroyed||this._socket.write(this._writeBuffer.take())})}}t.ByteProtocol=s,s._headerLen=4}}));
//# sourceMappingURL=wslDaemon.js.map