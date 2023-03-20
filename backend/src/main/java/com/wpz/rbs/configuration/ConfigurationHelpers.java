package com.wpz.rbs.configuration;

import com.google.api.client.auth.oauth.OAuthHmacSigner;
import com.google.api.client.auth.oauth.OAuthParameters;
import com.wpz.rbs.controllers.auth.models.LoggedInAuthModel;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "properties")
public class ConfigurationHelpers {
    private String consumerKey;
    private String consumerSecret;

    public String getConsumerKey() {
        return consumerKey;
    }

    public void setConsumerKey(String consumerKey) {
        this.consumerKey = consumerKey;
    }

    public String getConsumerSecret() {
        return consumerSecret;
    }

    public void setConsumerSecret(String consumerSecret) {
        this.consumerSecret = consumerSecret;
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
