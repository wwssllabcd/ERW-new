
var widgets = require("sdk/widget").Widget;
var pageWorkers = require("sdk/page-worker");
var myWedget, myPW


// A basic click-able image widget.
myWedget = widgets({
  id: "erw-wedget",
  label: "erw",
  content: "即時匯率",
  tooltip: "wait ready",
  width: 50
});
  
// This content script sends header titles from the page to the add-on:
var script = "postMessage(document.body.innerHTML);";
var targetURL = "http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm";
  
// Create a page worker that loads Wikipedia:
myPW = pageWorkers.Page({
  contentURL: targetURL,
  contentScript: script,
  contentScriptWhen: "ready",
  onMessage: function(message) {
	myWedget.tooltip = getResult(message);
  }
});

var getResult = function(msg){
	var res = "";
	res += "幣別： 現金買入 , 即期買入";
	res += getOneString("美金    ：", "美金 (USD)", msg);
	res += getOneString("港幣    ：", "港幣 (HKD)", msg);
	res += getOneString("英鎊    ：", "英鎊 (GBP)", msg);
	res += getOneString("澳幣    ：", "澳幣 (AUD)", msg);
	res += getOneString("加拿大幣：", "加拿大幣 (CAD)", msg);
	res += getOneString("新加坡幣：", "新加坡幣 (SGD)", msg);
	res += getOneString("新加坡幣：", "瑞士法朗 (CHF)", msg);
	res += getOneString("日圓    ：", "日圓 (JPY)", msg);
	res += getOneString("南非幣  ：", "南非幣 (ZAR)", msg);
	res += getOneString("瑞典幣  ：", "瑞典幣 (SEK)", msg);
	res += getOneString("紐元    ：", "紐元 (NZD)", msg);
	res += getOneString("泰幣    ：", "泰幣 (THB)", msg);
	res += getOneString("菲國比索：", "菲國比索 (PHP)", msg);
	res += getOneString("印尼幣  ：", "印尼幣 (IDR)", msg);
	res += getOneString("歐元    ：", "歐元 (EUR)", msg);
	res += getOneString("韓元    ：", "韓元 (KRW)", msg);
	res += getOneString("越南盾  ：", "越南盾 (VND)", msg);
	res += getOneString("馬來幣  ：", "馬來幣 (MYR)", msg);
	res += getOneString("人民幣  ：", "人民幣 (CNY)", msg);		
	return res;
}

var getOneString = function(title, keyWord, html){
	var res_1, res_2;
	var res = "";	
	res_1 = findKeyWord(keyWord, html, 2);
	res_2 = findKeyWord(keyWord, html, 4);
	res = "\n" + title + res_1 + ",  " + res_2;
	return res;
}

var findKeyWord = function(keyWord, source, cellNo){
	var startWord = "/Images/Flags/America.gif";
	var endWord = "</td><td class=";
	
	//通常是Table的起始
	var startIdx = source.indexOf(startWord);
	
	//從table的起點往後找KeyWord
	var keyWordIdx = source.indexOf(keyWord,startIdx);

	//從keyword往後找結束符號
	var temp = keyWordIdx;
	for(i=0; i<cellNo; i++){
		temp = source.indexOf(endWord,temp)+1;
	}
	endIdx = temp-1;
	
	//從EndIndex往前找，找>關鍵字，但是要往前移一個
	var curIdx = source.lastIndexOf(">",endIdx)+1;
	return source.substring(curIdx,endIdx);
}
