package com.wpz.rbs.service;

import com.google.api.client.auth.oauth.OAuthHmacSigner;
import com.google.api.client.auth.oauth.OAuthParameters;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@PropertySource({"classpath:application.properties", "classpath:security.properties"})
public class UsosAuthService {
    @Value("${security.consumerKey}")
    private String consumerKey;
    @Value("${security.consumerSecret}")
    private String consumerSecret;

    public HttpResponse executeUsosApiRequest(GenericUrl genericUrl) throws IOException {
        OAuthHmacSigner signer = new OAuthHmacSigner();
        signer.clientSharedSecret = consumerSecret;

        OAuthParameters oauthParameters = new OAuthParameters();
        oauthParameters.signer = signer;
        oauthParameters.consumerKey = consumerKey;

        HttpRequest getRequest = new NetHttpTransport().createRequestFactory(oauthParameters).buildGetRequest(genericUrl);
        HttpResponse response = getRequest.execute();

        if (response.isSuccessStatusCode()) {
            return response;
        } else {
            throw new IOException("Bad status code: " + response.getStatusCode() + " error: " + response.getStatusMessage());
        }
    }
}

