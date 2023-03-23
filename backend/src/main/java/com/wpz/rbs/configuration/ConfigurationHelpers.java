package com.wpz.rbs.configuration;

import com.google.api.client.auth.oauth.OAuthHmacSigner;
import com.google.api.client.auth.oauth.OAuthParameters;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.wpz.rbs.model.ApiUser;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import java.io.IOException;

@Configuration
@PropertySource({"classpath:application.properties", "classpath:security.properties"})
public class ConfigurationHelpers {
    @Value("${security.consumerKey}")
    private String consumerKey;
    @Value("${security.consumerSecret}")
    private String consumerSecret;
    @Value("${security.jwtKey}")
    private String jwtKey;

    public String getConsumerKey() {
        return consumerKey;
    }

    public String getConsumerSecret() {
        return consumerSecret;
    }

    public String getJwtKey() {
        return jwtKey;
    }


    private HttpRequestFactory createRequestFactory(HttpServletRequest request) {
        ApiUser user = (ApiUser) request.getAttribute("user");

        OAuthHmacSigner signer = new OAuthHmacSigner();
        signer.clientSharedSecret = getConsumerSecret();

        // Build OAuthParameters in order to use them while accessing the resource
        OAuthParameters oauthParameters = new OAuthParameters();
        signer.tokenSharedSecret = user.getTokenSecret();
        oauthParameters.signer = signer;
        oauthParameters.consumerKey = getConsumerKey();
        oauthParameters.token = user.getToken();
        oauthParameters.verifier =  user.getUsosPin();
        return new NetHttpTransport().createRequestFactory(oauthParameters);
    }

    public String usosApiGetRequestResult(HttpServletRequest request, GenericUrl genericUrl) throws IOException {
        return createRequestFactory(request).buildGetRequest(genericUrl).execute().parseAsString();
    }
}
