package com.wpz.rbs.controllers.auth;

import com.google.api.client.auth.oauth.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.wpz.rbs.controllers.auth.models.LoggedInAuthModel;
import com.wpz.rbs.controllers.auth.models.RequestTokenResultModel;
import com.wpz.rbs.controllers.auth.models.UsosAuthModel;
import com.wpz.rbs.configuration.ConfigurationHelpers;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

// made along with https://stackoverflow.com/questions/15194182/examples-for-oauth1-using-google-api-java-oauth
@RestController("auth")
public class AuthController {
    private final ConfigurationHelpers configurationHelpers;

    public AuthController(ConfigurationHelpers configurationHelpers) {
        this.configurationHelpers = configurationHelpers;
    }

    // user needs to authenticate in USOS - he has to open returned url and send pin code via method authorize()
    @GetMapping("request_token")
    public RequestTokenResultModel requestTokenUsosUrl() throws IOException {
        OAuthHmacSigner signer = new OAuthHmacSigner();
        signer.clientSharedSecret = configurationHelpers.getConsumerSecret();

        // Get Temporary Token
        OAuthGetTemporaryToken getTemporaryToken = new OAuthGetTemporaryToken("https://apps.usos.uj.edu.pl/services/oauth/request_token");
        getTemporaryToken.signer = signer;
        getTemporaryToken.consumerKey = configurationHelpers.getConsumerKey();
        getTemporaryToken.transport = new NetHttpTransport();
        /* TODO: test different login style - oob means that user will receive PIN code
        when on frontend will be redirection page done change oob to that link - user may be automatically redirected (CORS probably will block it) */
        getTemporaryToken.callback = "oob";
        OAuthCredentialsResponse temporaryTokenResponse = getTemporaryToken.execute();

        // Build Authenticate URL
        OAuthAuthorizeTemporaryTokenUrl accessTempToken = new OAuthAuthorizeTemporaryTokenUrl("https://apps.usos.uj.edu.pl/services/oauth/authorize");
        accessTempToken.temporaryToken = temporaryTokenResponse.token;
        // url used to get PIN code
        return new RequestTokenResultModel(accessTempToken.build(), temporaryTokenResponse.token, temporaryTokenResponse.tokenSecret);
    }

    @PostMapping("access_token")
    public LoggedInAuthModel accessTokenWithUsosPin(@RequestBody UsosAuthModel authModel) throws IOException {
        OAuthHmacSigner signer = new OAuthHmacSigner();
        signer.clientSharedSecret = configurationHelpers.getConsumerSecret();
        signer.tokenSharedSecret = authModel.temporaryTokenSecret();

        // Get Access Token using Temporary token and Verifier Code
        OAuthGetAccessToken getAccessToken = new OAuthGetAccessToken("https://apps.usos.uj.edu.pl/services/oauth/access_token");
        getAccessToken.signer = signer;
        getAccessToken.temporaryToken = authModel.temporaryToken();
        getAccessToken.transport = new NetHttpTransport();
        getAccessToken.verifier = authModel.usosPin();
        getAccessToken.consumerKey = configurationHelpers.getConsumerKey();
        OAuthCredentialsResponse accessTokenResponse = getAccessToken.execute();

        return new LoggedInAuthModel(authModel.usosPin(), accessTokenResponse.token, accessTokenResponse.tokenSecret);
    }
}
