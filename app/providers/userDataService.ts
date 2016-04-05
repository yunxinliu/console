import {Injectable} from "angular2/core";
import {Http, HTTP_PROVIDERS, Response, Headers, RequestOptions} from "angular2/http";
import "rxjs/Rx";
import {GitHubUser} from "../model/gitHub/gitHubUser";

@Injectable()
export class UserDataService {

    // reference to the currently signed in user.
    public user: GitHubUser;

    // ctor
    constructor(public http: Http) {
        // init user state to start with.
        this.clearUserState();
    }

    // initiates signing-in a user with the given username and password.
    public initiateSignIn(userName: string, password: string): Promise<GitHubUser> {

        this.user.userName = userName;
        this.user.basicAuthHeader = "Basic " + btoa(userName + ":" + password);

        return this.http.get("https://api.github.com/user", this.httpAuthOptions())
            .toPromise()
            .then((res) => {
                return this.handleSignInResponse(res);
            }).catch((err) => {
                this.user.isSignedIn = false;
                console.log(err.text());
                return Promise.reject<GitHubUser>(err);
            });
    }

    // signs out the user.
    public signOut() {
        this.clearUserState();
    }

    // returns auth options for http requests
    public httpAuthOptions() {
        let headers = new Headers({ "Authorization": this.user.basicAuthHeader });
        return new RequestOptions({ headers: headers });
    }

    // clears in-memory state object.
    private clearUserState() {
        this.user = new GitHubUser();
    }

    // handles the sign-in response.
    private handleSignInResponse(res: Response): Promise<GitHubUser> {

        console.log("Sign in response status: " + res.status);

        if (res.status !== 200) {
            this.user.isSignedIn = false;
            console.log("Error: failed to sign in: \n" + res.text());
            return Promise.reject<GitHubUser>(res);
        }
        else {

            let responseObject = JSON.parse(res.text());
            this.user.isSignedIn = true;
            this.user.avatarUrl = responseObject.avatar_url;
            this.user.profileUrl = responseObject.html_url;

            console.log("Success: Signed in!");
            return Promise.resolve<GitHubUser>(this.user);
        }
    }
}