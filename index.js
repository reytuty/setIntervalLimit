
function IntervalLimit(_callback, _maxFrequence, _justIfCalled, _ifChange = false ){
    var me = this ;
    let maxFrequence = _maxFrequence ;
    let callback = _callback ;
    if( typeof callback == "string" ){
        //method string name of method, called method
        callback = eval( callback.split(" ").join("") ) ;
    }
    let lastArguments ;
    let lastArgumentsString = "";
    let lastSentArguments ; 
    let justIfCalled = _justIfCalled ;
    let ifChange = ( _ifChange == true ) ;
    let hasFrequence = (maxFrequence > 0) ;
    let intervalId ;
    let started = false ;
    let needBeSend ;
    this.call = (...arguments)=>{
        var args = Array.from( arguments ) ;
        if(args.length > 0){
            lastArgumentsString = JSON.stringify( args ) ;
        }
        lastArguments = args ;
        needBeSend = true ;
        if( ! hasFrequence ){
            doCall();
        }
    }
    function doCall(){
        if( justIfCalled && !needBeSend ) {
            return;
        }
        if(ifChange && lastSentArguments == lastArgumentsString){
            //checking for changes
            return ;
        }
        lastSentArguments = JSON.stringify( lastArguments ) ;
        callback.apply( null, lastArguments ) ;
    }
    this.start = ()=>{
        if(started){
            return;
        }
        me.stop() ;
        started = true ;
        if( hasFrequence ){
            intervalId = setInterval(()=>{
                doCall() ;
            }, maxFrequence) ;
        }
    }
    this.stop = ()=>{
        if(!started){
            return ;
        }
        clearInterval(intervalId) ;
    }
}


function setIntervalLimit(callback, maxFrequence, justIfCalled = false, ifChange = false){
    if(!callback){
        throw new Error("Pass Method callback") ;
    }
    return new IntervalLimit(callback, maxFrequence, justIfCalled, ifChange) ;
}

module.exports = setIntervalLimit ;