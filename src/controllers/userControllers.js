import fetch from "node-fetch";
import User from "../../models/User.js";

export const login = (req, res) => {
  res.render("login");
};

export const startKakaoLogin = (req, res) => {
  try {
    const baseUrl = "https://kauth.kakao.com/oauth/authorize";
    const options = {
      client_id: "18913573bd020281e3ba3a33d057574d",
      redirect_uri: "http://localhost:5000/login/finish",
      response_type: "code",
    };
    const params = new URLSearchParams(options).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
  } catch (err) {
    return res.send(err);
  }
};
export const finishKakaoLogin = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const options = {
    client_id: "18913573bd020281e3ba3a33d057574d",
    client_secret: "ohBwscNYAEe79QWToZuipSFsHPgMYhuc",
    grant_type: "authorization_code",
    redirect_uri: "http://localhost:5000/login/finish",
    code: req.query.code,
  };
  const params = new URLSearchParams(options).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      "Content-type": "application/json",
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const userRequest = await (
      await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-type": "application/json",
        },
      })
    ).json();
    let user = await User.findOne({ user_id: userRequest.id });
    if (!user) {
      user = await User.create({
        user_id: userRequest.id,
        socialKakao: true,
        nickname: userRequest.properties.nickname,
        image_url: userRequest.properties.profile_image,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/");
  }
};

export const kakaoLogout = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/logout";
  const options = {
    client_id: "18913573bd020281e3ba3a33d057574d",
    logout_redirect_uri: "http://localhost:5000/",
  };
  const params = new URLSearchParams(options).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
  req.session.destroy();
};
