package com.wpz.rbs.configuration;

import com.google.api.client.auth.oauth.OAuthHmacSigner;
import com.google.api.client.auth.oauth.OAuthParameters;
import com.wpz.rbs.controller.auth.models.LoggedInAuthModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource({"classpath:application.properties", "classpath:security.properties"})
public class ConfigurationHelpers {
    @Value("${security.consumerKey}")
    private String consumerKey;
    @Value("${security.consumerSecret}")
    private String consumerSecret;

    public String getConsumerKey() {
        return consumerKey;
    }

    public String getConsumerSecret() {
        return consumerSecret;
    }


    public OAuthParameters generateAuthForEndpoints(LoggedInAuthModel authModel) {
        OAuthHmacSigner signer = new OAuthHmacSigner();
        signer.clientSharedSecret = getConsumerSecret();

        // Build OAuthParameters in order to use them while accessing the resource
        OAuthParameters oauthParameters = new OAuthParameters();
        signer.tokenSharedSecret = authModel.tokenSecret();
        oauthParameters.signer = signer;
        oauthParameters.consumerKey = getConsumerKey();
        oauthParameters.token = authModel.token();
        oauthParameters.verifier = authModel.usosPin();
        return oauthParameters;
    }
}
