package com.wpz.rbs.services;

import com.google.api.client.auth.oauth.OAuthHmacSigner;
import com.google.api.client.auth.oauth.OAuthParameters;
import com.wpz.rbs.controllers.auth.models.LoggedInAuthModel;

public class StaticHelpers {
    // TODO: save these variables in database
    // TODO: probably will be better to make service of this class in order to get CONSUMER data from database
    public static String CONSUMER_KEY = "CONSUMER_KEY";
    public static String CONSUMER_SECRET = "CONSUMER_SECRET";

    public static OAuthParameters generateAuthForEndpoints(LoggedInAuthModel authModel) {
        OAuthHmacSigner signer = new OAuthHmacSigner();
        signer.clientSharedSecret = CONSUMER_SECRET;

        // Build OAuthParameters in order to use them while accessing the resource
        OAuthParameters oauthParameters = new OAuthParameters();
        signer.tokenSharedSecret = authModel.tokenSecret();
        oauthParameters.signer = signer;
        oauthParameters.consumerKey = CONSUMER_KEY;
        oauthParameters.token = authModel.token();
        oauthParameters.verifier = authModel.usosPin();
        return oauthParameters;
    }
}
