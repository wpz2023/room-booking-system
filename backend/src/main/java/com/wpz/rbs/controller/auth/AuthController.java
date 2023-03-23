package com.wpz.rbs.controller.auth;

import com.google.api.client.auth.oauth.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.wpz.rbs.controller.auth.models.RequestTokenResultModel;
import com.wpz.rbs.controller.auth.models.UsosAuthModel;
import com.wpz.rbs.configuration.ConfigurationHelpers;
import com.wpz.rbs.model.ApiUser;
import com.wpz.rbs.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Key;
import java.util.Date;
import java.util.UUID;

// made along with https://stackoverflow.com/questions/15194182/examples-for-oauth1-using-google-api-java-oauth
@RestController
@RequestMapping("auth")
public class AuthController {
    @Autowired
    UserService userService;
    @Autowired
    ConfigurationHelpers configurationHelpers;

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
    public String accessTokenWithUsosPin(@RequestBody UsosAuthModel authModel) throws IOException {
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

        Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(configurationHelpers.getJwtKey()));
        // add a bit less than 2hrs to exp time
        Date expDate = new Date(new Date().getTime() + 7000000L);
        UUID userId = userService.saveOrUpdate(new ApiUser(authModel.usosPin(), accessTokenResponse.token, accessTokenResponse.tokenSecret, expDate));
        return Jwts.builder().claim("userId", userId.toString()).setExpiration(expDate).signWith(key).compact();
    }
}
