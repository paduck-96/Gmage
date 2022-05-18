//서버사이드 프로그램 코딩
import path from "path";
import "dotenv";
import express from "express";
import { Server } from "socket.io";
import morgan from "morgan";
import fetch from "node-fetch";
import socketController from "./socketControllers.js";

const __dirname = path.resolve();

//server 연결시키기
const app = express();
const PORT = 5000;
const httpServer = app.listen(
  PORT,
  console.log(`Server...http://localhost:${PORT}`)
);

//pug 활용
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

//express 설정
//미들웨어 설정
app.use(morgan("dev"));
app.use(express.static(process.cwd() + "/src/static"));
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});

const startKakaoLogin = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: "95ffc12a108499395f57b38cbcf14dd9",
    redirect_uri: "http://localhost:5000/login/finish",
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();

  const finalUrl = `${baseUrl}?${params}`;
  console.log(finalUrl);
  return res.redirect(finalUrl);
};
const finishKakaoLogin = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    client_id: "95ffc12a108499395f57b38cbcf14dd9",
    client_secret: process.env.KAKAO_SECRET,
    grant_type: "authorization_code",
    redirect_uri: "http://localhost:5000/login/finish",
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const kakaoTokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json", // 이 부분을 명시하지않으면 text로 응답을 받게됨
      },
    })
  ).json();
  if ("access_token" in kakaoTokenRequest) {
    // 엑세스 토큰이 있는 경우 API에 접근
    const { access_token } = kakaoTokenRequest;
    const userRequest = await (
      await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-type": "application/json",
        },
      })
    ).json();
    console.log(userRequest);
    return res.redirect("/game");
  } else {
    // 엑세스 토큰이 없으면 로그인페이지로 리다이렉트
    return res.redirect("/login");
  }
};

app.route("/login/start").get(startKakaoLogin);
app.route("/login/finish").get(finishKakaoLogin);
app.get("/game", (req, res) => {
  res.render("game");
});

//nickname 설정 불필요
//회원가입 정보에서 가져오기
const io = new Server(httpServer);
io.on("connection", (socket) => socketController(socket));
