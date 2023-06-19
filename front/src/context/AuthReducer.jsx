const AuthReducer = (state,action)=>{

    switch(action.type) {
        case "LOGIN_START":
            return{
                user: null,
                organization:null,
                isFetching: true,
                error: false,
    
    };
    case "LOGIN_SUCCESS":
            return {
                user: action.payload.user,
                organization:action.payload.organization,
                isFetching: false,
                error: false,
    
    };
    case "LOGIN_FAILURE":
            return{
                user: null,
                organization:null,
                isFetching: false,
                error: action.payload,
    
    };
    case "LOGOUT":
        return {
            user: null,
            organization:null,
            isFetching: false,
            error: false,
    };

    case "UPDATE_POST_NOTIFICATIONS":
        return {
            ...state,
            user:{
                ...state.user,
                postNotifications: [...state.user.postNotifications, action.payload],
            }
        };

        case "REMOVE_POST_NOTIFICATIONS":
    return {
        ...state,
        user: {
            ...state.user,
            postNotifications: state.user.postNotifications.filter(
                obj =>  (obj._id !== action.payload._id  )
            )
        }
    };

case "REMOVE_LIKES_OR_COMMENTS_POST_NOTIFICATIONS":
    return {
        ...state,
        user: {
            ...state.user,
            postNotifications: state.user.postNotifications.filter(
                obj =>  (obj.post !== action.payload.post  && obj.operation !== action.payload.operation)
            )
        }
    };

        

    case "CONFIRM":
            return{
                ...state,
                user: {
                    ...state.user,
                    connections: [...state.user.connections, action.payload],
                    sendConnectionsReq: state.user.sendConnectionsReq.filter(connection =>connection !== action.payload),
                    recvConnectionsReq:  state.user.recvConnectionsReq.filter(connection =>connection !== action.payload
                        ),

                }
    
    };
    case "UNCONNECT":
        return{
            ...state,
            user: {
                ...state.user,
                connections: state.user.connections.filter(connection =>connection !== action.payload
                    ),
            }

};

case "WITHDRAW":
    return{
        ...state,
        user: {
            ...state.user,
            sendConnectionsReq: state.user.sendConnectionsReq.filter(connection =>connection !== action.payload)
                ,
        }
};

case "DECLINE":
    return{
        ...state,
        user: {
            ...state.user,
            recvConnectionsReq: state.user.recvConnectionsReq.filter(connection =>connection !== action.payload)
                ,
        }
};

case "RECVREQ":
    return{
        ...state,
        user: {
            ...state.user,
            recvConnectionsReq: [...state.user.recvConnectionsReq, action.payload]
                ,
        }
};

case "CONNECTIONREQUEST":
        return{
            ...state,
            user: {
                ...state.user,
                sendConnectionsReq: [...state.user.sendConnectionsReq, action.payload]
                    ,
            }

};

case "UPDATE_MESSAGES_NOTIFICATION":
    return {
        ...state,
        user: {
            ...state.user,
            arrivalMessageNotifications: [...state.user.arrivalMessageNotifications,action.payload]
        }
    };

case "REMOVE_MESSAGES_NOTIFICATION":

    const conversation = action.payload.conversation;
    const recieverId = conversation.members.find(member=> member!== state.user._id)
    if(state.user.arrivalMessageNotifications && state.user.arrivalMessageNotifications!== "")
    return {
        ...state,
        user: {
            ...state.user,
            arrivalMessageNotifications:  state.user.arrivalMessageNotifications.filter(messageNotify =>messageNotify.sender !== recieverId
            ),
        }
    }
    else
    {
        return {
            ...state,
            user: {
                ...state.user,
            }
        }
    }

    case "UPDATED_ORGANIZATION":
    return{
        ...state,
        organization: {
            ...state.organization,
        organizationName: action.payload.organizationName,
        organizationPicture: action.payload.organizationPicture,
        NumOfEmployees: action.payload.NumOfEmployees,
        desc: action.payload.desc,
        users:action.payload.users,
        },     
    }
    
    case "UPDATED_ORGANIZATION_USERS":
    return{
        ...state,
        organization: {
            ...state.organization,
        users: [...state.organization.users, action.payload],
        },     
    }    

    case "UPDATED_ORGANIZATION_CEO":
    return{
        ...state,
        organization: {
            ...state.organization,
        CEO: action.payload,
        },     
    }    


case "UPDATED_USER":
    return{
        ...state,
        user: {
            ...state.user,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        city: action.payload.city,
        from: action.payload.from,
        password:action.payload.password,
        role: action.payload.role,
        desc: action.payload.desc,
        relationship: action.payload.relationship,
        birthdayDate: action.payload.birthdayDate,
        coverPicture:action.payload.coverPicture,
        profilePicture:action.payload.profilePicture,
        isAdmin:action.payload.isAdmin,
        }, 
                   
   
    };

    case "UPDATED_USER_SCORE":
    return{
        ...state,
        user: {
            ...state.user,
        score: action.payload,
        },
    };

    default:
        return state;
}
};

export default AuthReducer;