import React,{useEffect} from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom';

function LandingPage(props) {


    const onClickHandler = ()=>{
        axios.get('api/users/logout')
        .then(response=>{
            if(response.data.success){
                props.history.push("/login");
            }else{
                alert('로그아웃에 실패하였습니다.');
            }
        })
    }

    return (
        <div style = {
            {
                display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',width:'100%'
            }
        }>
            <h2>시작페이지</h2>

            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default withRouter(LandingPage);
