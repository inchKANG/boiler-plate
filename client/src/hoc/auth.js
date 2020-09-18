import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";

export default function (SpecificComponent, option, adminRoute = null) {
  //인덱스에서 설정.
  //null => 아무나 출입이 가능한 페이지
  //true => 로그인한 유저만 출입이 가능한 페이지
  //false => 로그인한 유저는 출입이 불가능한 페이지.

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        //로그인 되지 않은 상태
        if (!response.payload.isAuth) {
          //만약 로그인 되지 않은 상태인데, 로그인한 유저가 접속이 가능한 페이지라면,
          if (option) {
            props.history.push("/login");
            return;
          }
        }
        //로그인한 생태
        else {
          //관리자가 아닌데, 관리자만 접근 가능한 페이지에 접근하려고 하는 경우.
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push("/");
            return;
          }
          //만약 로그인 한 생태인데, 로그인한 유저가 접속이 불가능한 페이지라면
          if (option===false) {
            props.history.push("/");
            return;        
        }
        }
      });
    }, []);

    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}
