// Requires Zet, Serializable, EMACS5CompatibilityPatches
if (typeof window === "undefined") {
    var window = this;
}

(function(namespace, undefined) {

var ACCEPT_PROPOSAL_ACT, AGREE_ACT, CANCEL_ACT, CALL_FOR_PROPOSAL_ACT,
    CONFIRM_ACT, DISCONFIRM_ACT, FAILURE_ACT, INFORM_ACT, INFORM_IF_ACT,
    INFORM_REF_ACT,  NOT_UNDERSTOOD_ACT, PROPOGATE_ACT, PROPOSE_ACT,
    PROXY_ACT, QUERY_IF_ACT, QUERY_REF_ACT, REFUSE_ACT, REJECT_PROPOSAL_ACT,
    REQUEST_ACT, REQUEST_WHEN_ACT, REQUEST_WHENEVER_ACT, SUBSCRIBE_ACT,
    
    ACTOR_KEY, VERB_KEY, OBJECT_KEY, RESULT_KEY, 
    SPEECH_ACT_KEY, TIMESTAMP_KEY, CONTEXT_KEY,
    CONTEXT_CONVERSATION_ID_KEY, CONTEXT_REPLY_WITH_KEY,
    CONTEXT_IN_REPLY_TO_KEY, CONTEXT_REPLY_BY_KEY,
    AUTHORIZATION_KEY, SESSION_ID_KEY, 
    CONTEXT_LANGUAGE_KEY, CONTEXT_ONTOLOGY_KEY,
    SPEECH_ACT_SET, tokenizeObject, untokenizeObject;
    
// Core Speech Acts
INFORM_ACT = "Inform";                       // Asserting something
INFORM_REF_ACT = "Inform Ref";               // Assert the name of something
NOT_UNDERSTOOD_ACT = "Not Understood";       // Informing that you didn't understand an act
QUERY_REF_ACT = "Query Ref";                 // Asking the id of an object
REQUEST_ACT = "Request";                     // Requesting action (now)
REQUEST_WHEN_ACT = "Request When";           // Requesting action, conditional on X
REQUEST_WHENEVER_ACT = "Request Whenever";   // Requesting action, whenever X

// Information Speech Acts
CONFIRM_ACT = "Confirm";
DISCONFIRM_ACT = "Disconfirm";
INFORM_IF_ACT = "Inform If";
QUERY_IF_ACT = "Query If";

// Proposal Speech Acts
ACCEPT_PROPOSAL_ACT = "Accept Proposal";
CALL_FOR_PROPOSAL_ACT = "Call for Proposal";
PROPOSE_ACT = "Propose";
REJECT_PROPOSAL_ACT = "Reject Proposal";

// Action Negotiation Status
AGREE_ACT = "Agree";
CANCEL_ACT = "Cancel";
REFUSE_ACT = "Refuse";
FAILURE_ACT = "Failure";

// Relay Actions
PROPOGATE_ACT = "Propogate";
PROXY_ACT = "Proxy";
SUBSCRIBE_ACT = "Subscribe";

SPEECH_ACT_SET = {ACCEPT_PROPOSAL_ACT : true, AGREE_ACT : true, CANCEL_ACT : true, 
                  CALL_FOR_PROPOSAL_ACT : true, CONFIRM_ACT : true, DISCONFIRM_ACT : true,
                  FAILURE_ACT : true, INFORM_ACT : true, INFORM_IF_ACT : true,
                  INFORM_REF_ACT : true,  NOT_UNDERSTOOD_ACT : true, PROPOGATE_ACT : true, 
                  PROPOSE_ACT : true, PROXY_ACT : true, QUERY_IF_ACT : true, 
                  QUERY_REF_ACT : true, REFUSE_ACT : true, REJECT_PROPOSAL_ACT : true,
                  REQUEST_ACT : true, REQUEST_WHEN_ACT : true, REQUEST_WHENEVER_ACT : true, 
                  SUBSCRIBE_ACT : true};

ACTOR_KEY = "actor";
VERB_KEY = "verb";
OBJECT_KEY = "object";
RESULT_KEY = "result";
SPEECH_ACT_KEY = "speechAct";
TIMESTAMP_KEY = "timestamp";
CONTEXT_KEY = "context";

CONTEXT_CONVERSATION_ID_KEY = "conversation-id";
CONTEXT_IN_REPLY_TO_KEY = "in-reply-to";
CONTEXT_REPLY_WITH_KEY = "reply-with";
CONTEXT_REPLY_BY_KEY = "reply-by";

AUTHORIZATION_KEY = "authorization";
SESSION_ID_KEY = "session-id";
CONTEXT_LANGUAGE_KEY = 'language';
CONTEXT_ONTOLOGY_KEY = 'ontology';

tokenizeObject = Serialization.tokenizeObject;
untokenizeObject = Serialization.untokenizeObject;

Zet.declare('Message', {
    // Base class for a SKO Group
    superclass : Serialization.Serializable,
    defineBody : function(that){
        // Private Properties

        // Public Properties
        
        that.construct = function construct(actor, verb, obj, result, speechAct, 
                                            context, timestamp, anId){
            that.inherited(construct, [anId]);
            if (typeof actor === "undefined") {actor = null;}
            if (typeof verb === "undefined") {verb = null;}
            if (typeof obj === "undefined") {obj = null;}
            if (typeof result === "undefined") {result = null;}
            if (typeof speechAct === "undefined") {speechAct = INFORM_ACT;}
            if (typeof context === "undefined") {context = {};}
            if (typeof timestamp === "undefined") {timestamp = null;}
            that._actor = actor;
            that._verb = verb;
            that._obj = obj;
            that._result = result;
            that._speechAct = speechAct;
            that._context = context;
            that._timestamp = timestamp;
		};
        
        that.getActor = function getActor(){
            return that._actor;
        };
        that.setActor = function setActor(value){
            that._actor = value;
        };
        
        that.getVerb = function getVerb(){
            return that._verb;
        };
        that.setVerb = function setVerb(value){
            that._verb = value;
        };
        
        that.getObject = function getObject(){
            return that._obj;
        };
        that.setVerb = function setVerb(value){
            that._obj = value;
        };
        
        that.getResult = function getResult(){
            return that._result;
        };
        that.setResult = function setResult(value){
            that._result = value;
        };
        
        that.getSpeechAct = function getSpeechAct(){
            return that._speechAct;
        };
        that.setSpeechAct = function setSpeechAct(value){
            that._speechAct = value;
        };
        
        that.getTimestamp = function getTimestamp(){
            return that._timestamp;
        };
        that.setTimestamp = function setTimestamp(value){
            that._timestamp = value;
        };

        that.updateTimestamp = function updateTimestamp(){
            that._timestamp = new Date().toISOString();
        };
        
        that.hasContextValue = function hasContextValue(key){
            return (key in that._context) === true;
        };

        that.getContextKeys = function getContextKeys(){
            var key, keys;
            keys = [];
            for (key in that._context){
                keys.push(key);
            }
            return keys;
        };
        
        that.getContextValue = function getContextValue(key, aDefault){
            if (!(key in that._context)){
                return aDefault;
            }
            return that._context[key];
        };
        
        that.setContextValue = function setContextValue(key, value){
            that._context[key] = value;
        };
        
        that.delContextValue = function delContextValue(key){
            delete that._context[key];
        };
        
        that.saveToToken = function saveToToken(){
            var key, token, newContext, hadKey;
            token = that.inherited(saveToToken);
            if (that._actor != null){
                token.setitem(ACTOR_KEY, tokenizeObject(that._actor));
            }
            if (that._verb != null){
                token.setitem(VERB_KEY, tokenizeObject(that._verb));
            }
            if (that._obj != null){
                token.setitem(OBJECT_KEY, tokenizeObject(that._obj));
            }
            if (that._result != null){
                token.setitem(RESULT_KEY, tokenizeObject(that._result));
            }
            if (that._speechAct != null){
                token.setitem(SPEECH_ACT_KEY, tokenizeObject(that._speechAct));
            }
            if (that._timestamp != null){
                token.setitem(TIMESTAMP_KEY, tokenizeObject(that._timestamp));
            }
            hadKey = false;
            newContext = {};
            for (key in that._context){
                hadKey = true;
                newContext[tokenizeObject(key)] = tokenizeObject(that._context[key]);
            }
            if (hadKey){
                token.setitem(CONTEXT_KEY, tokenizeObject(newContext));
            }
            return token;
        };

        that.initializeFromToken = function initializeFromToken(token, context){
            that.inherited(initializeFromToken, [token, context]);
            that._actor = untokenizeObject(token.getitem(ACTOR_KEY, true, null), context);
            that._verb = untokenizeObject(token.getitem(VERB_KEY, true, null), context);
            that._obj = untokenizeObject(token.getitem(OBJECT_KEY, true, null), context);
            that._result = untokenizeObject(token.getitem(RESULT_KEY, true, null), context);
            that._speechAct = untokenizeObject(token.getitem(SPEECH_ACT_KEY, true, null), context);
            that._timestamp = untokenizeObject(token.getitem(TIMESTAMP_KEY, true, null), context);
            that._context = untokenizeObject(token.getitem(CONTEXT_KEY, true, {}), context);
        };
    }
});

namespace.Message = Message;

namespace.SPEECH_ACT_SET = SPEECH_ACT_SET;
namespace.ACCEPT_PROPOSAL_ACT = ACCEPT_PROPOSAL_ACT;
namespace.AGREE_ACT = AGREE_ACT;
namespace.CANCEL_ACT = CANCEL_ACT;
namespace.CALL_FOR_PROPOSAL_ACT = CALL_FOR_PROPOSAL_ACT;
namespace.CONFIRM_ACT = CONFIRM_ACT;
namespace.DISCONFIRM_ACT = DISCONFIRM_ACT;
namespace.FAILURE_ACT = FAILURE_ACT;
namespace.INFORM_ACT = INFORM_ACT;
namespace.INFORM_IF_ACT = INFORM_IF_ACT;
namespace.INFORM_REF_ACT = INFORM_REF_ACT;
namespace.NOT_UNDERSTOOD_ACT = NOT_UNDERSTOOD_ACT;
namespace.PROPOGATE_ACT = PROPOGATE_ACT;
namespace.PROPOSE_ACT = PROPOSE_ACT;
namespace.PROXY_ACT = PROXY_ACT;
namespace.QUERY_IF_ACT = QUERY_IF_ACT;
namespace.QUERY_REF_ACT = QUERY_REF_ACT;
namespace.REFUSE_ACT = REFUSE_ACT;
namespace.REJECT_PROPOSAL_ACT = REJECT_PROPOSAL_ACT;
namespace.REQUEST_ACT = REQUEST_ACT;
namespace.REQUEST_WHEN_ACT = REQUEST_WHEN_ACT;
namespace.REQUEST_WHENEVER_ACT = REQUEST_WHENEVER_ACT;
namespace.SUBSCRIBE_ACT = SUBSCRIBE_ACT;

namespace.ACTOR_KEY = ACTOR_KEY;
namespace.VERB_KEY = VERB_KEY;
namespace.OBJECT_KEY = OBJECT_KEY;
namespace.RESULT_KEY = RESULT_KEY;
namespace.SPEECH_ACT_KEY = SPEECH_ACT_KEY;
namespace.TIMESTAMP_KEY = TIMESTAMP_KEY;
namespace.CONTEXT_KEY = CONTEXT_KEY;

namespace.CONTEXT_CONVERSATION_ID_KEY = CONTEXT_CONVERSATION_ID_KEY;
namespace.CONTEXT_IN_REPLY_TO_KEY = CONTEXT_IN_REPLY_TO_KEY;
namespace.CONTEXT_REPLY_WITH_KEY = CONTEXT_REPLY_WITH_KEY;
namespace.CONTEXT_REPLY_BY_KEY = CONTEXT_REPLY_BY_KEY;

namespace.AUTHORIZATION_KEY = AUTHORIZATION_KEY;
namespace.SESSION_ID_KEY = SESSION_ID_KEY;
namespace.CONTEXT_LANGUAGE_KEY = CONTEXT_LANGUAGE_KEY;
namespace.CONTEXT_ONTOLOGY_KEY = CONTEXT_ONTOLOGY_KEY;

})(window.Messaging = window.Messaging || {});