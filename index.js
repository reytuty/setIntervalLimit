
function IntervalLimit(_callback, _maxFrequence, _justIfCalled, _ifChange = false ){
    var me = this ;
    let maxFrequence = _maxFrequence ;
    let callback = _callback ;
    if( typeof callback == "string" ){
        //method string name of method, called method
        callback = eval( callback.split(" ").join("") ) ;
    }
    let lastArguments = new Map();
    let lastArgumentsString = new Map();
    let lastSentArguments = new Map(); 
    
    let justIfCalled = _justIfCalled ;
    let ifChange = ( _ifChange == true ) ;
    let hasFrequence = (maxFrequence > 0) ;
    let intervalId ;
    let started = false ;
    let needBeSend = new Map() ;
    this.defaultContext = "_____1";
    lastArguments.set( me.defaultContext, null );
    this.contextCall = (context, args)=>{
        if(args.length > 0){
            lastArgumentsString.set(context, JSON.stringify( args ) ) ;
        }
        lastArguments.set( context, args ) ;
        needBeSend.set(context, true ) ;
        if( ! hasFrequence ){
            doCall( context );
        }
    }
    this.call = (...arguments)=>{
        var args = Array.from( arguments ) ;
        return me.contextCall( me.defaultContext, args ) ;
    }
    function doCall( context = null ){
        if(!context){
            context = me.defaultContext
        }
        if( justIfCalled && !needBeSend.get(context) ) {
            return;
        }
        var lastArgString = lastArgumentsString.get(context) ;
        var lastArg = lastArguments.get( context ) ;
        var lastSentArgs = lastSentArguments.get(context);
        if( ifChange && lastSentArgs == lastArgString ){
            //checking for changes
            return ;
        }
        lastSentArguments.set( context, JSON.stringify( lastArg ) ) ;
        callback.apply( null, lastArg ) ;
    }
    function doCall4All(){
        lastArguments.forEach((value, key)=>{
            doCall(key) ;
        });
    }
    this.start = ()=>{
        if(started){
            return;
        }
        me.stop() ;
        started = true ;
        if( hasFrequence ){
            intervalId = setInterval(()=>{
                doCall4All() ;
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