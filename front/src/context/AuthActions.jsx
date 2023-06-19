export const LoginStart = (userCredentials)=>({
    type:"LOGIN_START", 
});

export const LoginSuccess = (user,organization)=>({
    type:"LOGIN_SUCCESS", 
    payload:{user:user,organization:organization}
});

export const LoginFailure = (err)=>({
    type:"LOGIN_FAILURE", 
    payload:err
});

export const UpdatedOrganization = (organization)=>({
    type:"UPDATED_ORGANIZATION", 
    payload:organization
});

export const updateUserScore = (score)=>({
    type:"UPDATED_USER_SCORE", 
    payload:score
});

export const UpdatedOrganizationUsers = (user)=>({
    type:"UPDATED_ORGANIZATION_USERS", 
    payload:user
});

export const UpdatedOrganizationCEO = (CEO)=>({
    type:"UPDATED_ORGANIZATION_CEO", 
    payload:CEO
});

export const UpdatePostNotifications = (post)=>({
    type:"UPDATE_POST_NOTIFICATIONS", 
    payload:post
});

export const RemovePostNotifications = (post)=>({
    type:"REMOVE_POST_NOTIFICATIONS", 
    payload:post
});

export const RemoveLikesorCommentPostNotifications = (post)=>({
    type:"REMOVE_LIKES_OR_COMMENTS_POST_NOTIFICATIONS", 
    payload:post
});


export const RemoveMessagesNotifications = (user,conversation)=>({
    type:"REMOVE_MESSAGES_NOTIFICATION",
    payload: {
        user: user,conversation}
});

export const UpdateMessagesNotifications = (arrivalMessage)=>({
    type:"UPDATE_MESSAGES_NOTIFICATION", 
    payload: arrivalMessage
});

export const UpdatedUser = (user)=>({
    type:"UPDATED_USER",
    payload:user,
});

export const ConnectionReq = (userId) =>({
    type: "CONNECTIONREQUEST",
    payload: userId,
});

export const Withdraw = (userId) =>({
    type: "WITHDRAW",
    payload: userId,
});

export const RecvReq = (userId) =>({
    type: "RECVREQ",
    payload: userId,
});

export const Decline = (userId) =>({
    type: "DECLINE",
    payload: userId,
});

export const Confirm = (userId) =>({
    type: "CONFIRM",
    payload: userId,
});

export const UnConnect = (userId) =>({
    type: "UNCONNECT",
    payload: userId,
});