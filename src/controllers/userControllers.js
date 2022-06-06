import fetch from "node-fetch";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import io from "../init.js";

export const login = (req, res) => {
  res.render("login", { pageTitle: "로그인" });
};
export const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const pageTitle = "로그인";
  const socialUser = await User.findOne({ email, socialKakao: true });
  const user = await User.findOne({ email, socialKakao: false });
  if (socialUser) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "카카오 로그인으로 이용해주세요",
    });
  }
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "해당 이메일은 존재하지 않습니다",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "비밀번호 오류입니다" });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  io.once("login", (socket) => {
    socket.data.user = req.session.user;
  });
  return res.redirect("/game");
};

export const getSignup = (req, res) => {
  res.render("signup");
};
export const postSignup = async (req, res) => {
  const { nickname, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).render("signup", {
      pageTitle: "회원가입",
      errorMessage: "비밀번호 확인 오류",
    });
  }
  const eExists = await User.exists({ email });
  if (eExists) {
    return res.status(400).render("signup", {
      pageTitle: "회원가입",
      errorMessage: "이미 가입되어 있는 이메일입니다!",
    });
  }
  const nExists = await User.exists({ nickname });
  if (nExists) {
    return res.status(400).render("signup", {
      pageTitle: "회원가입",
      errorMessage: "이미 가입되어 있는 닉네임입니다!",
    });
  }
  try {
    await User.create({
      nickname,
      email,
      password,
      socialKakao: false,
      image_url: `https://api.multiavatar.com/45678945/${Math.round(
        Math.random() * 1000
      )}.png`,
    });
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("signup", {
      pageTitle: "회원가입",
      errorMessage: error._message,
    });
  }
};

export const startKakaoLogin = (req, res) => {
  try {
    const baseUrl = "https://kauth.kakao.com/oauth/authorize";
    const options = {
      client_id: process.env.CLIENT_ID,
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
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
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
          property_keys: ["kakao_account.email"],
        },
      })
    ).json();
    let user = await User.findOne({
      email: userRequest.kakao_account.email,
    });
    if (!user) {
      user = await User.create({
        email: userRequest.email,
        password: "",
        user_id: userRequest.id,
        socialKakao: true,
        nickname: userRequest.properties.nickname,
        image_url: userRequest.properties.profile_image,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      io.once("login", (socket) => {
        socket.data.user = req.session.user;
      });
      return res.redirect("/game");
    }
    let updateUser = await User.findOneAndUpdate(
      user,
      {
        $set: {
          socialKakao: true,
          email: userRequest.email,
          password: "",
          user_id: userRequest.id,
          socialKakao: true,
          nickname: userRequest.properties.nickname,
          image_url: userRequest.properties.profile_image,
        },
      },
      { new: true }
    );
    req.session.loggedIn = true;
    req.session.user = updateUser;
    io.once("login", (socket) => {
      socket.data.user = req.session.user;
    });
    return res.redirect("/game");
  } else {
    return res.redirect("/");
  }
};

export const kakaoLogout = async (req, res) => {
  req.session.destroy();
  const baseUrl = "https://kauth.kakao.com/oauth/logout";
  const options = {
    client_id: process.env.CLIENT_ID,
    logout_redirect_uri: "http://localhost:5000/",
  };
  const params = new URLSearchParams(options).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

/*
export const kakaoExit = async (req, res) => {
  req.session.destroy();
  const baseUrl = "https://kapi.kakao.com/v1/user/unlink";
  const Exist = await (
    await fetch(baseUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-type": "application/json",
        property_keys: ["kakao_account.email"],
      },
    })
  ).json();
};
*/
