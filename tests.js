

const setIntervalLimit = require("./index")

var callJustIfCalled = false ;
var justIfChange = false ;
var intervalLimit1 = setIntervalLimit((param1, param2, param3)=>{
    console.log("1 - called 1 again", new Date(), param1, param2, param3)  ;
}, 1000, callJustIfCalled, justIfChange ) ;
intervalLimit1.start() ;

callJustIfCalled = true ;
justIfChange = true ;
var intervalLimit2 = setIntervalLimit((param1, param2, param3)=>{
    console.log(" \n\n---------------\n          !!! ..... 2 >> called 2 again", new Date(), param1, param2, param3, "\n -------^---------")  ;
}, 1000, callJustIfCalled, justIfChange ) ;
intervalLimit2.start() ;

//now another method stress called then
var sum = 1 ;
setInterval(()=>{
    sum += 0.01;
    var roundSum = Math.floor(sum) ;
    console.log("trying to sent", roundSum) ;
    intervalLimit1.call( roundSum, 2 ) ;
    intervalLimit2.call( roundSum,2,3) ;
}, 20);
