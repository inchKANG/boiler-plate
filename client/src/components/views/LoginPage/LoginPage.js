import React,{useState} from 'react';
import {useDispatch} from 'react-redux';
import {loginUser} from '../../../_actions/user_action'
import {withRouter} from 'react-router-dom';

function LoginPage(props) {

    const dispatch = useDispatch();
    //usestate를 통해 쉽게 자동완성. useState 안에는 기본값 입력
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const onEmailHandler=(event)=>{

        setEmail(event.currentTarget.value);
    };
    const onPasswordHandler=(event)=>{
        setPassword(event.currentTarget.value);
    };

    const onSubmitHandler=(event)=>{
        //이걸 입력해줘야 페이지가 리프레쉬 되지 않음.
        event.preventDefault();
        
        const body={
            email:Email,
            password:Password,
        }
       
        dispatch(loginUser(body))
        .then(response=>{
            if(response.payload.loginSuccess){
                props.history.push('/');
            }else{
                alert(response.payload.message);
            }
        });


       
    }

    return (
        <div style = {
            {
                display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',width:'100%'
            }
        }>
            <form style={{display:'flex',flexDirection:'column'}}
            onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} required />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} required />
                <br />
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default withRouter(LoginPage);
